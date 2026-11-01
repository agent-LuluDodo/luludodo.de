import {onDrop} from '../util/drop.ts'
import setStyle, {type Style} from '../util/style.ts'
import setTitle from '../util/title.ts'
import header from '../util/header.ts'
import footer from '../util/footer.ts'
import deco from '../util/deco.ts'
import text, {FONT_BIG, FONT_NORMAL, FONT_SMALL} from '../util/font.ts'
import {iconButton, textButton} from '../util/button.ts'
import {showDialog} from '../file/helper.ts'
import {BlobReader, BlobWriter, type Entry, TextWriter, ZipReader} from '@zip.js/zip.js'
import blobUrl from '../util/blob_url.ts'
import capitalize from '../util/capitalize.ts'
import hash from '../util/hash.ts'
import {versionFromHash} from '../api/modrinth.ts'
import {getMod, matchFingerprint} from '../api/curseforge.ts'
import {load as toml} from 'js-toml'

// TODO: link to curseforge/modrinth
//       multi-file d'n'd support
//       mod pack support
//       better fallback image

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

type Loader = 'unknown' | 'fabric' | 'forge' | 'neoforge'

type Mod = {
    error: false,
    loader: Loader,
    name: string,
    id: string,
    icon: string,
    authors: string[],
    contributors: string[],
    description: string,
    links: Record<string, string>,
    version: string,
    curseforge: HTMLElement,
    modrinth: HTMLElement,
}

type Analysis = {
    name?: string,
    id?: string,
    icon?: string,
    authors: string[],
    contributors: string[],
    description?: string,
    links: Record<string, string>,
    version?: string,
}

type AnalysisWithLoader = {
    loader: Loader
} & Analysis

async function openFile(file: File) {
    try {

        const blobReader = new BlobReader(file)
        const zipReader = new ZipReader(blobReader)

        const entries = await zipReader.getEntries()

        const writer = new TextWriter()

        let analysis: AnalysisWithLoader =
            await analyse(writer, entries, 'fabric.mod.json', 'fabric', 'json', analyseFabricMod) ??
            await analyse(writer, entries, 'META-INF/mods.toml', 'forge', 'toml', analyseForgeMod) ??
            await analyse(writer, entries, 'META-INF/neoforge.mods.toml', 'neoforge', 'toml', analyseForgeMod) ??
            await analyse(writer, entries, 'mcmod.info', 'forge', 'json', analyseOldForgeMod) ??
            { loader: 'unknown', authors: [], contributors: [], links: {} }

        let iconBlob: Blob | null = null
        if (analysis.icon) {
            const entry = entries.find((entry) => entry.filename === analysis.icon)

            if (entry !== undefined && !entry.directory) {
                const iconWriter = new BlobWriter()
                iconBlob = await entry.getData(iconWriter)
            }
        }

        const modrinth = await iconButton('modrinth', '')
        modrinth.hidden = true
        const curseforge = await iconButton('curseforge', '')
        curseforge.hidden = true

        await findOnModrinth(modrinth, file)
        await findOnCurseforge(curseforge, file)

        await showMod({
            error: false,
            loader: analysis.loader,
            name: analysis.name ?? 'Missing Name',
            id: analysis.id ?? 'unknown',
            icon: blobUrl('icon', iconBlob, '/icon/mod-not-found.png'),
            authors: analysis.authors,
            contributors: analysis.contributors,
            description: analysis.description ?? 'Missing Description',
            links: analysis.links,
            version: analysis.version ?? 'unknown',
            modrinth,
            curseforge,
        })
    } catch (err) {
        console.error(err)
        await showMod({
            error: true,
            message: 'Malformed or unsupported Mod'
        })
    }
}

async function findOnModrinth(button: HTMLAnchorElement, file: Blob) {
    const sha512 = await hash('sha-512', file)

    versionFromHash({
        hash: sha512,
        algorithm: 'sha512',
        multiple: false
    }, response => {
        console.log(response)
        button.href = `https://modrinth.com/mod/${response.project_id}/version/${response.id}`
        button.hidden = false
    })
}

async function findOnCurseforge(button: HTMLAnchorElement, file: Blob) {
    const fingerprint = await hash('curseforge', file)

    matchFingerprint(
        fingerprint,
        response => {
            getMod(
                response.file.modId,
                modResponse => {
                    button.href = `https://www.curseforge.com/minecraft/mc-mods/${modResponse.slug}/files/${response.file.id}`
                    button.hidden = false
                }
            )
        })
}

type FileType = 'json' | 'toml'

async function analyse(writer: TextWriter, entries: Entry[], file: string, loader: Loader, type: FileType, callback: (info: any) => Analysis): Promise<AnalysisWithLoader | null> {
    const entry = entries.find((entry) => entry.filename === file)
    if (entry === undefined || entry.directory)
        return null

    const data = await entry.getData(writer)

    let info: any
    try {
        switch (type) {
            case 'json':
                info = JSON.parse(data)
                break
            case 'toml':
                info = toml(data)
                break
        }
    } catch (e) {
        return null
    }

    const analysis = callback(info) as AnalysisWithLoader
    analysis.loader = loader
    return analysis
}

function analyseFabricMod(info: any): Analysis {
    let analysis: Analysis = {
        authors: [],
        contributors: [],
        links: {}
    }

    try {

        if (typeof info.name === 'string') {
            analysis.name = info.name
        }

        if (typeof info.id === 'string') {
            analysis.id = info.id
        }

        if (typeof info.icon === 'string') {
            analysis.icon = info.icon
        }

        if (Array.isArray(info.authors)) {
            for (const author of info.authors) {
                if (typeof author === 'string') {
                    analysis.authors.push(author)
                } else if (typeof author.name === 'string') {
                    analysis.authors.push(author.name)
                }
            }
        }

        if (Array.isArray(info.contributors)) {
            for (const contributor of info.contributors) {
                if (typeof contributor === 'string') {
                    analysis.authors.push(contributor)
                } else if (typeof contributor.name === 'string') {
                    analysis.authors.push(contributor.name)
                }
            }
        }

        if (typeof info.description === 'string') {
            analysis.description = info.description
        }

        if (info.contact && typeof info.contact === 'object') {
            for (const [key, value] of Object.entries(info.contact)) {
                analysis.links[capitalize(key)] = value as string
            }
        }

        if (typeof info.version === 'string') {
            analysis.version = info.version
        }

    } catch (e) {
        console.error('Error while analysing Fabric Mod', e)
    }

    return analysis
}

function analyseForgeMod(info: any): Analysis {
    let analysis: Analysis = {
        authors: [],
        contributors: [],
        links: {}
    }

    try {

        if (typeof info.issueTrackerURL === 'string') {
            analysis.links['Issues'] = info.issueTrackerURL
        }

        if (Array.isArray(info.mods)) {

            if (typeof info.mods[0].displayName === 'string') {
                analysis.name = info.mods[0].displayName
            }

            if (typeof info.mods[0].modId === 'string') {
                analysis.id = info.mods[0].modId
            }

            if (typeof info.mods[0].logoFile === 'string') {
                analysis.icon = info.mods[0].logoFile
            }

            if (typeof info.mods[0].authors === 'string') {
                analysis.authors.push(info.mods[0].authors)
            }

            if (typeof info.mods[0].description === 'string') {
                analysis.description = info.mods[0].description
            }

            if (typeof info.mods[0].displayURL === 'string') {
                analysis.links['Homepage'] = info.mods[0].displayURL
            }

            if (typeof info.mods[0].version === 'string') {
                analysis.version = info.mods[0].version
            }

        }
    } catch (e) {
        console.error('Error while analysing Forge Mod', e)
    }

    console.log(analysis)

    return analysis
}

function analyseOldForgeMod(info: any): Analysis {
    let analysis: Analysis = {
        authors: [],
        contributors: [],
        links: {}
    }

    try {
        if (Array.isArray(info)) {

            console.log(info[0])

            if (typeof info[0].name === 'string') {
                analysis.name = info[0].name
            }

            if (typeof info[0].modid === 'string') {
                analysis.id = info[0].modid
            }

            if (typeof info[0].logoFile === 'string') {
                analysis.icon = info[0].logoFile
            }

            if (Array.isArray(info[0].authorList)) {
                for (const author of info[0].authorList) {
                    if (typeof author === 'string') {
                        analysis.authors.push(author)
                    }
                }
            }

            if (typeof info[0].description === 'string') {
                analysis.description = info[0].description
            }

            if (typeof info[0].url === 'string') {
                analysis.links['URL'] = info[0].displayURL
            }

            if (typeof info[0].version === 'string') {
                analysis.version = info[0].version
            }

        }
    } catch (e) {
        console.error('Error while analysing Forge Mod', e)
    }

    console.log(analysis)

    return analysis
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
        message.appendChild(await text(mod.message, FONT_NORMAL))

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
        for (const word of mod.description.replace('\n', ' ').split(' ')) {
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
        downloads.appendChild(mod.curseforge)
        downloads.appendChild(mod.modrinth)
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