import loadMarkdown from './markdown_container.ts';
import {style} from './home.ts';

async function load(app: HTMLElement) {
    await loadMarkdown(app, style, 'Privacy Policy', 'legal', 'privacy-policy')
}

export default load