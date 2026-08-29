import setTitle from '../util/title.ts';
import setStyle, {type Style} from '../util/style.ts';
import header from '../util/header.ts';
import footer from '../util/footer.ts';
import icon from '../util/icon.ts';
import deco from '../util/deco.ts';
import text from '../util/font.ts';

const style: Style = {
    background: '#FF8C42',
    altBackground: '#000',
    text: '#FFF',
    altText: '#FFF',
    link: '#FFF'
}

async function load(app: HTMLElement) {
    setStyle(style)
    setTitle('WIP')
    app.appendChild(await header())
    const content = document.createElement('div');
    content.classList.add('wip-content')
    content.appendChild(icon('wip.png', '#FF8C42'))
    app.appendChild(content)
    app.appendChild(await footer())
}

export async function wip_disclaimer() {
    const content = await text({
        content: 'This page is still under development!\nYou can already use it, but expect some bugs',
        color: style.text
    })
    content.style.backgroundColor = style.background
    return deco(content, 'disclaimer', false, style.background)
}

export default load