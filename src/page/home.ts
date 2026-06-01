import header from '../util/header.ts';
import footer from '../util/footer.ts';
import setStyle, {type Style} from '../util/style.ts';
import deco from '../util/deco.ts';
import text, {FONT_BIG} from '../util/font.ts';
import {mods} from './mod.ts';
import {iconButton} from '../util/button.ts';

export const style: Style = {
    text: '#FFF',
    altText: '#AAA',
    background: '#433f66',
    altBackground: '#000',
    link: '#AAA'
}

const socials = {
    modrinth: 'https://modrinth.com/user/agent-LuluDodo',
    curseforge: 'https://www.curseforge.com/members/agent_LuluDodo/projects',
    github: 'https://github.com/agent-LuluDodo',
    kofi: 'https://ko-fi.com/agent_luludodo'
}

async function load(app: HTMLElement) {
    setStyle(style)

    app.appendChild(await header())

    const container = document.createElement('div')

    const content = document.createElement('div')
    content.classList.add('home-container')

    const welcome = deco(await text('Welcome!', FONT_BIG), 'title')
    welcome.classList.add('welcome')
    content.appendChild(welcome)

    const modsWrapper = document.createElement('div')
    modsWrapper.classList.add('mods-wrapper')

    modsWrapper.appendChild(deco(await text('Check out my mods'), 'chains'))

    const modsDiv = document.createElement('div')
    modsDiv.classList.add('mods', 'links')
    for (const [key, mod] of Object.entries(mods)) {
        const modElement = document.createElement('a')
        modElement.appendChild(await text(mod.name))
        modElement.href = '/mod/' + key
        modsDiv.appendChild(deco(modElement, 'chains_entry'))
    }
    modsWrapper.appendChild(modsDiv)

    content.appendChild(modsWrapper)

    const socialsWrapper = document.createElement('div')
    socialsWrapper.classList.add('socials-wrapper')

    socialsWrapper.appendChild(deco(await text('Find me on other sites'), 'building'))

    const socialsDiv = document.createElement('div')
    socialsDiv.classList.add('socials', 'links')
    for (const [key, link] of Object.entries(socials)) {
        socialsDiv.appendChild(deco(await iconButton(key, link), 'building_entry'))
    }
    socialsDiv.appendChild(deco(document.createElement('div'), 'building_end'))
    socialsWrapper.appendChild(socialsDiv)

    content.appendChild(socialsWrapper)

    container.appendChild(content)

    app.appendChild(container)

    app.appendChild(await footer())
}

export default load;