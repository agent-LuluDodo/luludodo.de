import {getStyle} from './style.ts';
import text from './font.ts';
import icon from './icon.ts';

export async function textButton(name: string, link: string) {
    const button = document.createElement('a')
    button.classList.add('text-button', 'button', 'corner-1')
    button.appendChild(await text({
        content: name
    }))
    button.href = link
    return button
}

export async function iconButton(src: string, link: string | (() => unknown)) {
    const button = document.createElement('a')
    button.classList.add('icon-button', 'button', 'corner-1')
    button.appendChild(icon(`/icon/${src}.png`, getStyle().text, 9, 9, [], '/icon/not-found.png'))
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