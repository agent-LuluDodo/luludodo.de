import markdown from '../util/markdown.ts';
import text, {FONT_BIG} from '../util/font.ts';
import setStyle, {type Style} from '../util/style.ts';
import header from '../util/header.ts';
import footer from '../util/footer.ts';
import deco from '../util/deco.ts';
import {iconButton} from '../util/button.ts';
import error from '../error/error.ts';
import {getLink} from '../util/link.ts';

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
        download: 'https://modrinth.com/mod/improvemymenus#download',
        modrinth: 'https://modrinth.com/mod/improvemymenus',
        curseforge: 'https://www.curseforge.com/minecraft/mc-mods/improvemymenus',
        github: 'https://github.com/agent-LuluDodo/ImproveMyMenus'
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
        download: 'https://modrinth.com/mod/rebindmykeys#download',
        modrinth: 'https://modrinth.com/mod/rebindmykeys',
        github: 'https://github.com/agent-LuluDodo/RebindMyKeys'
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
        download: 'https://modrinth.com/mod/rebindmykeys#download',
        modrinth: 'https://modrinth.com/mod/rebindmykeys',
        github: 'https://github.com/agent-LuluDodo/RebindMyKeys'
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
    download?: string
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
    if (mod.download) {
        buttonsDiv.appendChild(await iconButton('download', mod.download))
    }
    if (mod.modrinth) {
        buttonsDiv.appendChild(await iconButton('modrinth', mod.modrinth))
    }
    if (mod.curseforge) {
        buttonsDiv.appendChild(await iconButton('curseforge', mod.curseforge))
    }
    if (mod.github) {
        buttonsDiv.appendChild(await iconButton('github', mod.github))
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

    app.appendChild(await footer())
}

export default load;

export async function startHash(hash: string) {
    if (hash === 'more') {
        await repopulateGlobalButtons(moreButtons)
    }
}

export async function endHash(hash: string) {
    if (hash === 'more') {
        await repopulateGlobalButtons(globalButtons)
    }
}

async function repopulateGlobalButtons(entries: Record<string, string | (() => unknown)>) {
    const globalButtonsDiv = document.getElementById('global-buttons')!
    for (let i = globalButtonsDiv.childNodes.length - 1; i >= 0; i--) {
        globalButtonsDiv.removeChild(globalButtonsDiv.childNodes[i])
    }
    for (const [icon, link] of Object.entries(entries)) {
        globalButtonsDiv.appendChild(await iconButton(icon, link))
    }
}