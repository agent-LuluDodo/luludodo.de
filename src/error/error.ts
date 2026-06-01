import text, {FONT_BIG} from '../util/font.ts';
import setStyle, {type Style} from '../util/style.ts';
import header from '../util/header.ts';
import footer from '../util/footer.ts';
import deco from '../util/deco.ts';

const style: Style = {
    text: '#000',
    altText: '#000',
    background: '#F77',
    altBackground: '#000',
    link: '#722'
}

async function load(app: HTMLElement, message: string) {
    setStyle(style)

    app.appendChild(await header())

    const container = document.createElement('div')
    container.classList.add('error-container')
    container.appendChild(deco(await text(message, FONT_BIG), 'title'))
    app.appendChild(container)

    app.appendChild(await footer())
}

export default load;