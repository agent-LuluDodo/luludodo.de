import loadMarkdown from './markdown_container.ts';
import {style} from './home.ts';

async function load(app: HTMLElement) {
    await loadMarkdown(app, style, 'Terms of Use', 'legal', 'terms-of-use')
}

export default load