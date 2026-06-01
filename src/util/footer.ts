import text, {FONT_SMALL} from './font.ts';

const content = {
    'Privacy Policy': '/privacy-policy',
    'Terms of Use': '/terms-of-use',
    'Source Code': 'https://github.com/agent-LuluDodo/luludodo.de'
}

export default async function footer() {
    const footer = document.createElement('footer')

    for (const [title, link] of Object.entries(content)) {
        const a = document.createElement('a')
        a.classList.add('corner-1')
        a.href = link
        a.appendChild(await text(title, FONT_SMALL))
        footer.appendChild(a)
    }

    return footer
}