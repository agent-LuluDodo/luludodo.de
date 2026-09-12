import text, {FONT_BIG} from '../util/font.ts';
import setStyle, {type Style} from '../util/style.ts';
import header from '../util/header.ts';
import footer from '../util/footer.ts';
import deco from '../util/deco.ts';
import setTitle from '../util/title.ts';

const style: Style = {
    text: '#000',
    altText: '#FA7',
    background: '#FA7',
    altBackground: '#000',
    link: '#FA7'
}

type Tools = Record<string, string>

const tools: Tools = {
    'rng': 'Random Numbers'
}

async function load(app: HTMLElement) {
    setStyle(style)
    setTitle('Tools')

    app.appendChild(await header())

    const container = document.createElement('div')
    container.classList.add('mods-container')
    container.appendChild(deco(await text({
        content: 'Tools',
        color: style.text
    }, FONT_BIG), 'title'))

    const modsDiv = document.createElement('div')
    modsDiv.classList.add('mods', 'tools')

    for (const [key, tool] of Object.entries(tools)) {
        const modElement = document.createElement('a')
        modElement.appendChild(await text(tool))
        modElement.href = '/' + key
        modsDiv.appendChild(deco(modElement, 'mod'))
    }

    container.appendChild(modsDiv)

    app.appendChild(container)

    app.appendChild(await footer())
}

export default load;