import text, {FONT_BIG} from './font.ts';
import {getStyle} from './style.ts';
import deco from './deco.ts';

type Link = {
    name: string
    location: string
}

const links: Link[] = [{
    name: 'Home',
    location: ''
}, {
    name: 'Mods',
    location: 'mods'
}]

let mobile = false

export default async function header() {
    let header = document.createElement('header')
    header.classList.add('invert-links')

    mobile = window.innerWidth <= 850

    window.addEventListener('resize', async () => {
        const newMobile = window.innerWidth <= 850
        if (newMobile !== mobile) {
            mobile = newMobile
            const newHeader = header.cloneNode(false) as HTMLElement
            await populate(newHeader)
            header.replaceWith(newHeader)
            header = newHeader
        }
    })

    await populate(header)

    return deco(header, 'header')
}

async function populate(header: HTMLElement) {
    const brandingDiv = document.createElement('div')
    brandingDiv.classList.add('branding')
    brandingDiv.appendChild(await text('LuluDodo', FONT_BIG))
    header.appendChild(brandingDiv)

    const linksDiv = document.createElement('div')
    linksDiv.classList.add('links')

    for (const link of links) {
        const linkDiv = document.createElement('a')
        linkDiv.appendChild(await text({
            content: link.name,
            underline: getStyle().text
        }))
        linkDiv.href = '/' + link.location
        linksDiv.appendChild(linkDiv)
    }

    header.appendChild(linksDiv)
}