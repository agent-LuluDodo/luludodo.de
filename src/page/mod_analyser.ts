import {onDrop} from '../util/drop.ts'
import setStyle, {type Style} from '../util/style.ts'
import setTitle from '../util/title.ts'
import header from '../util/header.ts'
import footer from '../util/footer.ts'
import deco from '../util/deco.ts'
import text, {FONT_BIG, FONT_SMALL} from '../util/font.ts'
import {iconButton, textButton} from '../util/button.ts'
import {showDialog} from '../file/helper.ts'
import {BlobReader, BlobWriter, type Entry, TextWriter, ZipReader} from '@zip.js/zip.js'
import {addBlobUrl, clearBlobUrl} from '../util/blob_url.ts'
import {load as toml} from 'js-toml'
import markdown from '../util/markdown.ts';
import {
    type AdditionalInfo,
    type AnalysedMod, formatToName,
    type InfoState,
    loaderToName,
    type ModAnalyser,
    type ModInfo, typeToName
} from './mod_analyser/mod.ts';
import fabric from './mod_analyser/fabric.ts';
import forge from './mod_analyser/forge.ts';
import neoforge from './mod_analyser/neoforge.ts';
import oldForge from './mod_analyser/old_forge.ts';
import findOnModrinth from './mod_analyser/modrinth.ts';
import findOnCurseforge from './mod_analyser/curseforge.ts';
import quilt from './mod_analyser/quilt.ts';
import mrpack from './mod_analyser/mrpack.ts';

// TODO: multi-file d'n'd support
//       mod pack support - WIP
//       Jar-in-Jar support

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

    const spacer = document.createElement('div')
    spacer.classList.add('spacer')
    content.appendChild(spacer)

    const infoWrapper = document.createElement('div')
    infoWrapper.classList.add('info')
    const info = await markdown('mod-analyser', 'info')
    info.classList.add('corner-8')
    infoWrapper.appendChild(info)
    content.appendChild(infoWrapper)

    app.appendChild(content)

    app.appendChild(await footer())
}

async function openFile(file: File) {
    const showMod = document.getElementById('show-mod')!

    for (let i = showMod.childNodes.length - 1; i >= 0; i--) {
        showMod.childNodes[i].remove()
    }

    clearBlobUrl('icon')

    let infos: ModInfo[] = []

    try {

        await analyseFile(file, infos)

    } catch (e) {
        console.error('Error analysing file', e)
    }

    for (const info of infos) {
        await updateMod(info)
        showMod.appendChild(info.element)
    }
}

async function analyseFile(file: Blob, infos: ModInfo[]) {
    const blobReader = new BlobReader(file)
    const zipReader = new ZipReader(blobReader)

    const entries = await zipReader.getEntries()

    const mods: AnalysedMod[] = []

    await analyse(entries, mods, fabric)
    await analyse(entries, mods, forge)
    await analyse(entries, mods, neoforge)
    await analyse(entries, mods, mrpack)
    await analyse(entries, mods, oldForge)
    await analyse(entries, mods, quilt)

    let first = true
    let primary: ModInfo
    let state: InfoState
    for (const mod of mods) {
        let iconBlob: Blob | null = null
        if (mod.icon) {
            const iconFile = entries.find(file => file.filename === mod.icon)
            if (iconFile && !iconFile.directory) {
                const writer = new BlobWriter()
                iconBlob = await iconFile.getData(writer)
            }
        }

        const details: Record<string, string> = {}
        if (mod.type) {
            details['Type'] = typeToName[mod.type]
        }
        if (mod.format) {
            details['Format'] = formatToName[mod.format]
        }
        if (mod.loader) {
            details['Loader'] = loaderToName[mod.loader]
        }

        const info: ModInfo = {
            element: document.createElement('div'),
            name: mod.name ?? 'Unknown Name',
            id: mod.id ?? 'unknown',
            icon: addBlobUrl('icon', iconBlob, '/icon/mod-not-found.png'),
            authors: mod.authors ?? [],
            contributors: mod.contributors ?? [],
            description: mod.description ?? '-',
            links: mod.links ?? {},
            details,
            version: mod.version ?? 'unknown'
        }

        if (first) {
            first = false
            primary = info
            state = {
                name: !!mod.name,
                icon: !!mod.icon,
                downloads: 0,
                description: !!mod.description,
            }
        }

        infos.push(info)
    }

    if (first) {
        const info = {
            element: document.createElement('div'),
            name: 'Unsupported Mod',
            id: 'unknown',
            icon: '/icon/mod-not-supported.png',
            authors: [],
            contributors: [],
            description: 'Couldn\'t find mod metadata!',
            links: {},
            details: {},
            version: 'unknown',
        }

        infos.push(info)

        primary = info
        state = {
            name: false,
            icon: false,
            downloads: 0,
            description: false,
        }
    }

    async function callback(additional: AdditionalInfo) {
        if (!state.name) {
            state.name = true
            primary.name = additional.name
        }
        if (!state.icon && additional.icon) {
            state.icon = true
            primary.icon = additional.icon
        }
        state.downloads += additional.downloads
        primary.details['Downloads'] = state.downloads.toString()
        for (const [key, value] of Object.entries(additional.links)) {
            if (!primary.links.hasOwnProperty(key)) {
                primary.links[key] = value
            }
        }
        if (!state.description) {
            state.description = true
            primary.description = additional.description
        }

        await updateMod(primary)
    }

    await findOnModrinth(file, async link => {
        primary.modrinth = link
        await updateMod(primary)
    }, callback)
    await findOnCurseforge(file, async link => {
        primary.curseforge = link
        await updateMod(primary)
    }, callback)
}

async function analyse(entries: Entry[], mods: AnalysedMod[], analyser: ModAnalyser) {
    const files = entries.filter((entry) => entry.filename === analyser.file)

    for (const file of files) {
        if (file.directory) continue

        try {
            const writer = new TextWriter()
            const data = await file.getData(writer)

            let info: any
            switch (analyser.format) {
                case 'json':
                    info = JSON.parse(data)
                    break
                case 'toml':
                    info = toml(data)
                    break
            }

            for (const mod of analyser.parse(info)) {
                mods.push(mod)
            }
        } catch (e) {
            console.error('Error while parsing mod file', e)
        }
    }
}

async function updateMod(mod: ModInfo) {
    for (let i = mod.element.childNodes.length - 1; i >= 0; i--) {
        mod.element.childNodes[i].remove()
    }

    mod.element.classList.add('mod-container')

    const div = document.createElement('div')
    div.classList.add('mod', 'corner-8')

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

    const details = document.createElement('div')
    details.classList.add('details')

    let first = true
    for (const [key, value] of Object.entries(mod.details)) {
        if (first) {
            first = false
        } else {
            details.appendChild(await text({
                content: ', ',
                color: style.altText
            }, FONT_SMALL))
        }
        details.appendChild(await text({
            content: key + ': ',
            color: style.altText
        }, FONT_SMALL))
        details.appendChild(await text({
            content: value,
            color: style.text
        }, FONT_SMALL))
    }

    div.appendChild(details)

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
        downloads.appendChild(await iconButton('curseforge', mod.curseforge))
    }
    if (mod.modrinth) {
        downloads.appendChild(await iconButton('modrinth', mod.modrinth))
    }
    footer.appendChild(downloads)

    div.appendChild(footer)

    mod.element.appendChild(div)
}

export default load