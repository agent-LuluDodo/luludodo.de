import markdown from '../util/markdown.ts';
import text, {FONT_BIG} from '../util/font.ts';
import setStyle, {type Style} from '../util/style.ts';
import header from '../util/header.ts';
import footer from '../util/footer.ts';
import deco from '../util/deco.ts';
import {iconButton} from '../util/button.ts';
import error from '../error/error.ts';
import {getLink} from '../util/link.ts';
import * as Modrinth from '../api/modrinth.ts';
import * as Curseforge from '../api/cfwidget.ts';
import * as Github from '../api/github.ts';
import setTitle from '../util/title.ts';

export const mods: Record<string, Mod> = {
    ImproveMyMenus: {
        name: 'ImproveMyMenus',
        id: 'improvemymenus',
        style: {
            text: '#000',
            altText: '#000',
            background: '#FFF',
            altBackground: '#000',
            link: '#000'
        },
        invertLinks: true,
        modrinth: 'improvemymenus',
        curseforge: 'improvemymenus',
        github: 'ImproveMyMenus'
    },
    RebindMyKeys: {
        name: 'RebindMyKeys',
        id: 'rebindmykeys',
        style: {
            text: '#FFF',
            altText: '#a2a2a2',
            background: '#484848',
            altBackground: '#000',
            link: '#7AF'
        },
        modrinth: 'rebindmykeys',
        github: 'RebindMyKeys'
    },
    DefinitelyMyCoords: {
        name: 'DefinitelyMyCoords',
        id: 'definitelymycoords',
        style: {
            text: '#FFF',
            altText: '#AAA',
            background: '#111',
            altBackground: '#AAA',
            link: '#AAA'
        },
        modrinth: 'definitelymycoords',
        github: 'DefinitelyMyCoords'
    }
}

const globalButtons = {
    kofi: 'https://ko-fi.com/agent_luludodo',
    more: '#more'
}

const moreButtons: Record<string, string | (() => unknown)> = {
    kofi: 'https://ko-fi.com/agent_luludodo',
    copy_link: copy
}

if (navigator.share !== undefined) {
    moreButtons['share'] = share;
}

moreButtons['close'] = ''

type Mod = {
    name: string
    id: string
    style: Style
    invertLinks?: boolean
    modrinth?: string
    curseforge?: string
    github?: string
}

let curMod: Mod

async function copy() {
    await navigator.clipboard.writeText(getLink())
}

async function share() {
    await navigator.share({
        url: getLink(),
        title: curMod.name
    })
}

async function load(app: HTMLElement, subpath: string) {
    const mod = mods[subpath]
    if (mod === undefined) {
        await error(app, '404: Mod Not Found')
        return;
    }
    curMod = mod

    setStyle(mod.style)
    setTitle(mod.name)

    app.appendChild(await header())

    const container = document.createElement('div')
    container.classList.add('mod-container')
    container.appendChild(deco(await text({
        content: mod.name,
        color: mod.style.text
    }, FONT_BIG), 'title'))

    const allButtonsDiv = document.createElement('div')
    allButtonsDiv.classList.add('buttons-container')

    const buttonsDiv = document.createElement('div')
    buttonsDiv.classList.add('buttons')

    const downloadButton = await iconButton('download', 'javascript:void(0)')
    buttonsDiv.appendChild(downloadButton)

    let downloads = 0
    let downloadsText: HTMLElement | null = null
    async function updateDownloads(add: number) {
        downloads += add
        const newDownloadsText = await text('' + downloads)
        if (downloadsText === null) {
            const child = downloadButton.children[0]
            downloadButton.insertBefore(newDownloadsText, child)
        } else {
            downloadsText.replaceWith(newDownloadsText)
        }
        downloadsText = newDownloadsText
    }

    let downloadLink = false
    if (mod.modrinth) {
        buttonsDiv.appendChild(await iconButton('modrinth', 'https://modrinth.com/mod/' + mod.modrinth))
        downloadLink = true
        downloadButton.href = `https://modrinth.com/mod/${mod.modrinth}#download`

        Modrinth.getProject(mod.modrinth, async response => {
            await updateDownloads(response.downloads)
        })
    }
    if (mod.curseforge) {
        buttonsDiv.appendChild(await iconButton('curseforge', 'https://curseforge.com/minecraft/mc-mods/' + mod.curseforge))
        if (!downloadLink) {
            downloadLink = true
            downloadButton.href = 'https://www.curseforge.com/minecraft/mc-mods/improvemymenus'
        }

        Curseforge.getProject(mod.curseforge, async response => {
            await updateDownloads(response.downloads.total)
        })
    }
    if (mod.github) {
        buttonsDiv.appendChild(await iconButton('github', 'https://github.com/agent-LuluDodo/' + mod.github))
        if (!downloadLink) {
            downloadLink = true
            downloadButton.href = `https://github.com/agent-LuluDodo/${mod.github}/releases`
        }

        Github.getReleases('agent-LuluDodo', mod.github, async response => {
            let downloads = 0
            for (const release of response) {
                for (const asset of release.assets) {
                    downloads += asset.download_count
                }
            }
            await updateDownloads(downloads)
        })
    }

    if (!downloadLink) {
        downloadButton.style.display = 'none'
    }

    allButtonsDiv.appendChild(buttonsDiv)

    const globalButtonDiv = document.createElement('div')
    globalButtonDiv.id = 'global-buttons'
    globalButtonDiv.classList.add('buttons')
    for (const [icon, link] of Object.entries(globalButtons)) {
        globalButtonDiv.appendChild(await iconButton(icon, link))
    }
    allButtonsDiv.appendChild(globalButtonDiv)

    container.appendChild(allButtonsDiv)

    const markdownDiv = deco(await markdown('mod', subpath, `/mod/${mod.id}/`), 'fancy')
    if (mod.invertLinks) {
        markdownDiv.classList.add('invert-links')
    } else {
        markdownDiv.classList.remove('invert-links')
    }
    container.appendChild(markdownDiv)
    app.appendChild(container)

    const popup = document.createElement('div')
    popup.id = 'popup'
    app.appendChild(popup)

    app.appendChild(await footer())
}

export default load;

export async function startHash(hash: string) {
    switch (hash) {
        case 'more':
            await repopulateGlobalButtons(moreButtons)
            break;
    }
}

export async function endHash(hash: string) {
    switch (hash) {
        case 'more':
            await repopulateGlobalButtons(globalButtons)
            break;
    }
}

async function repopulateGlobalButtons(entries: Record<string, string | (() => unknown)>) {
    const globalButtonsDiv = document.getElementById('global-buttons')!
    let newChildren = 0
    for (let i = globalButtonsDiv.childNodes.length - 1; i >= 0; i--) {
        globalButtonsDiv.removeChild(globalButtonsDiv.childNodes[i])
        newChildren--
    }
    for (const [icon, link] of Object.entries(entries)) {
        globalButtonsDiv.appendChild(await iconButton(icon, link))
        newChildren++
    }
    globalButtonsDiv.parentElement!.scrollLeft += newChildren * 45
}