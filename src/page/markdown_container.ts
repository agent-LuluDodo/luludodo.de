import markdown from '../util/markdown.ts';
import header from '../util/header.ts';
import footer from '../util/footer.ts';
import deco from '../util/deco.ts';
import text, {FONT_BIG} from '../util/font.ts';
import setStyle, {type Style} from '../util/style.ts';
import setTitle from '../util/title.ts';

async function loadMarkdown(app: HTMLElement, style: Style, title: string, folder: string, file: string) {
    setStyle(style)
    setTitle(title)
    app.appendChild(await header())
    const content = document.createElement('div')
    content.classList.add('markdown-container')
    content.appendChild(deco(await text(title, FONT_BIG), 'title'))
    content.appendChild(deco(await markdown(folder, file), 'fancy'))
    app.appendChild(content)
    app.appendChild(await footer())
}

export default loadMarkdown