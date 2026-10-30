import {onDrop} from "../util/drop.ts";
import setStyle, {type Style} from "../util/style.ts";
import setTitle from "../util/title.ts";
import header from "../util/header.ts";
import footer from "../util/footer.ts";
import deco from "../util/deco.ts";
import text, {FONT_BIG, FONT_SMALL} from "../util/font.ts";
import {textButton} from "../util/button.ts";
import {showDialog} from "../file/helper.ts";
import {BlobReader, BlobWriter, TextWriter, ZipReader} from "@zip.js/zip.js";
import blobUrl from "../util/blob_url.ts";
import capitalize from "../util/capitalize.ts";

const style: Style = {
    text: '#eeffff',
    altText: '#546e7a',
    background: '#263238',
    altBackground: '#1f292e',
    link: '#808080'
}

async function load(app: HTMLElement) {
    setStyle(style)
    setTitle('Mod Analyser')

    app.appendChild(await header())

    const content = document.createElement('div')
    content.classList.add('mod-analyser')

    content.appendChild(deco(await text('Mod Analyser', FONT_BIG), 'title'))

    const upload_prompt = deco(await textButton('Upload Mod', () => showDialog(openFile)), 'quick')
    upload_prompt.id = 'upload-prompt'
    content.appendChild(upload_prompt)

    const mod = document.createElement('div')
    mod.id = 'show-mod'
    content.appendChild(mod)

    onDrop(openFile)

    app.appendChild(content)

    app.appendChild(await footer())
}

type ModError = {
    error: true,
    message: string,
}

type Mod = {
    error: false,
    name: string,
    id: string,
    icon: string,
    authors: string[],
    contributors: string[],
    description: string,
    links: Record<string, string>,
    version: string,
    curseforge?: string,
    modrinth?: string,
}

async function openFile(file: File) {
    try {
        const blobReader = new BlobReader(file)
        const zipReader = new ZipReader(blobReader)

        const entries = await zipReader.getEntries()

        const fabricModJsonFile = entries.find((entry) => entry.filename === "fabric.mod.json")!
        if (fabricModJsonFile.directory) {
            throw new Error('fabric.mod.json can\'t be a directory')
        }

        const fabricModJsonWriter = new TextWriter()
        const fabricModJson = JSON.parse(await fabricModJsonFile.getData(fabricModJsonWriter))

        let iconBlob: Blob | null = null
        if (typeof fabricModJson.icon === 'string') {
            const iconFile = entries.find((entry) => entry.filename === fabricModJson.icon)

            if (iconFile !== undefined && !iconFile.directory) {
                const iconWriter = new BlobWriter()
                iconBlob = await iconFile.getData(iconWriter)
            }
        }

        let authors: string[] = []
        if (Array.isArray(fabricModJson.authors)) {
            for (const author of fabricModJson.authors) {
                authors.push(author.name ?? author)
            }
        }

        let contributors: string[] = []
        if (Array.isArray(fabricModJson.contributors)) {
            for (const contributor of fabricModJson.contributors) {
                contributors.push(contributor.name ?? contributor)
            }
        }

        let links: Record<string, string> = {}
        if (fabricModJson.contact) {
            for (const [key, value] of Object.entries(fabricModJson.contact)) {
                links[capitalize(key)] = value as string
            }
        }

        await showMod({
            error: false,
            name: fabricModJson.name ?? 'Unknown',
            id: fabricModJson.id ?? 'unknown',
            icon: blobUrl('icon', iconBlob, '/TODO'),
            authors,
            contributors,
            description: fabricModJson.description ?? '-',
            links,
            version: fabricModJson.version ?? 'unknown',
        })
    } catch (err) {
        console.error(err)
        await showMod({
            error: true,
            message: 'Malformed or unsupported Mod'
        })
    }
}

async function showMod(mod: Mod | ModError) {
    const container = document.createElement('div')
    container.classList.add('mod-container')

    const div = document.createElement('div')
    div.classList.add('mod', 'corner-8')

    if (mod.error) {
        div.classList.add('error')

        const message = document.createElement('div')
        message.classList.add('message')
        message.textContent = mod.message

        div.appendChild(message)
    } else {
        const header = document.createElement('div')
        header.classList.add('header')

        const icon = document.createElement('img')
        icon.classList.add('icon', 'corner-1')
        icon.src = mod.icon
        header.appendChild(icon)

        const name = document.createElement('div')
        name.classList.add('name')

        const title = document.createElement('span')
        title.classList.add('title')
        title.appendChild(await text({
            content: mod.name,
            color: style.text
        }, FONT_BIG))
        name.appendChild(title)

        const slug = document.createElement('span')
        slug.classList.add('slug')
        slug.appendChild(await text({
            content: mod.id,
            color: style.altText
        }, FONT_SMALL, true))
        name.appendChild(slug)

        header.appendChild(name)

        const creditsIntro = document.createElement('div')
        creditsIntro.classList.add('credits-intro')
        creditsIntro.appendChild(await text({
            content: '-----',
            color: style.altText
        }, FONT_SMALL))
        header.appendChild(creditsIntro)

        const credits = document.createElement('div')
        credits.classList.add('credits')

        let firstCredit = true
        for (const modAuthor of mod.authors) {
            const author = document.createElement('span')
            author.classList.add('author')
            author.appendChild(await text({
                content: (firstCredit ? '' : ', ') + modAuthor,
                color: style.text
            }))
            firstCredit = false
            credits.appendChild(author)
        }

        for (const modContributor of mod.contributors) {
            const contributor = document.createElement('span')
            contributor.classList.add('contributor')
            contributor.appendChild(await text({
                content: (firstCredit ? '' : ', ') + modContributor,
                color: style.altText
            }))
            firstCredit = false
            credits.appendChild(contributor)
        }

        header.appendChild(credits)

        div.appendChild(header)

        const links = document.createElement('div')
        links.classList.add('links')

        for (const [name, href] of Object.entries(mod.links)) {
            links.appendChild(await textButton(name, href))
        }

        div.appendChild(links)

        const description = document.createElement('div')
        description.classList.add('description')
        for (const word of mod.description.split(' ')) {
            description.appendChild(await text({
                content: word + ' ',
                color: style.text
            }))
        }
        div.appendChild(description)

        const footer = document.createElement('div')
        footer.classList.add('footer')

        const version = document.createElement('div')
        version.classList.add('version')
        version.appendChild(await text({
            content: mod.version,
            color: style.altText
        }, FONT_SMALL))
        footer.appendChild(version)

        const downloads = document.createElement('div')
        downloads.classList.add('downloads')
        if (mod.curseforge) {
            downloads.appendChild(await textButton('Curseforge', mod.curseforge))
        }
        if (mod.modrinth) {
            downloads.appendChild(await textButton('Modrinth', mod.modrinth))
        }
        footer.appendChild(downloads)

        div.appendChild(footer)
    }

    container.appendChild(div)

    const show = document.getElementById('show-mod')!
    if (show.childElementCount !== 0) {
        show.children[0].remove()
    }
    show.appendChild(container)
}

export default load