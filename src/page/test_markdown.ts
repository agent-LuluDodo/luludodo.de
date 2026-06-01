import markdown from '../util/markdown.ts';
import {timed} from './test_font.ts';

async function load(app: HTMLElement) {
    await timed(app, async app => {
        app.appendChild(await markdown('test', 'test'));
    })
}

export default load;