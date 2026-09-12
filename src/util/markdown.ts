import {FONT_NORMAL, getWidth, renderHTML} from './font.ts';

export default async function markdown(folder: string, file: string, linkPrefix?: string, width: number = 60) {
    const {html} = await import(`../markdown/${folder}/${file}.md`);

    const container = document.createElement('div');
    container.classList.add('markdown');
    container.style.width = await getWidth(width, FONT_NORMAL) + 'px';
    container.innerHTML = html;

    return await renderHTML(container, linkPrefix)
}