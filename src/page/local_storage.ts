import loadMarkdown from './markdown_container.ts';
import {style} from './home.ts';
import {textButton} from '../util/button.ts';
import {hidePopup, showPopup} from '../util/storage.ts';
import {clearHash} from '../util/paths.ts';

async function load(app: HTMLElement) {
    await loadMarkdown(app, style, 'Local Storage', 'legal', 'local-storage')
    const markdown = app.children[1]!
    markdown.classList.add('markdown-buttons')
    console.log(markdown)
    markdown.insertBefore(await textButton('Show Popup', '#show'), markdown.lastElementChild!)
}

export async function startHash(hash: string) {
    switch (hash) {
        case 'show':
            await showPopup(_ => clearHash())
            break;
    }
}

export async function endHash(hash: string) {
    switch (hash) {
        case 'show':
            await hidePopup()
            break;
    }
}

export default load