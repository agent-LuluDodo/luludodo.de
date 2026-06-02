import text, {FONT_BIG} from '../util/font.ts';
import setStyle, {type Style} from '../util/style.ts';
import header from '../util/header.ts';
import footer from '../util/footer.ts';
import deco from '../util/deco.ts';
import {mods} from './mod.ts';
import setTitle from '../util/title.ts';

const style: Style = {
    text: '#FFF',
    altText: '#7AF',
    background: '#035',
    altBackground: '#000',
    link: '#7AF'
}

async function load(app: HTMLElement) {
    setStyle(style)
    setTitle('Mods')

    app.appendChild(await header())

    const container = document.createElement('div')
    container.classList.add('mods-container')
    container.appendChild(deco(await text({
        content: 'Mods',
        color: style.text
    }, FONT_BIG), 'title'))

    const modsDiv = document.createElement('div')
    modsDiv.classList.add('mods')

    for (const [key, mod] of Object.entries(mods)) {
        const modElement = document.createElement('a')
        modElement.appendChild(await text(mod.name))
        modElement.href = '/mod/' + key
        modsDiv.appendChild(deco(modElement, 'mod'))
    }

    container.appendChild(modsDiv)

    app.appendChild(container)

    app.appendChild(await footer())
}

export default load;