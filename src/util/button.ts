import {getStyle} from './style.ts';
import text from './font.ts';
import icon from './icon.ts';

export async function textButton(name: string, link: string | (() => unknown)) {
    const button = document.createElement('a')
    button.classList.add('text-button', 'button', 'corner-1')
    button.appendChild(await text({
        content: name
    }))
    if (typeof link === 'string') {
        button.href = link
    } else {
        button.onclick = async e => {
            e.preventDefault()
            e.stopImmediatePropagation()
            await link()
        }
    }
    return button
}

export async function iconButton(src: string, link: string | (() => unknown), alt?: string) {
    if (alt === undefined) {
        const words = src.split('_')
        alt = ''
        for (const word of words) {
            alt += ' '
            alt += word.substring(0, 1).toUpperCase()
            alt += word.substring(1).toLowerCase()
        }
        alt = alt.substring(1)
    }

    const button = document.createElement('a')
    button.classList.add('icon-button', 'button', 'corner-1')
    button.appendChild(icon(`/icon/${src}.png`, getStyle().text, 9, 9, alt, [], '/icon/not-found.png'))
    if (typeof link === 'string') {
        button.href = link
    } else {
        button.onclick = async e => {
            e.preventDefault()
            e.stopImmediatePropagation()
            await link()
        }
    }
    return button
}