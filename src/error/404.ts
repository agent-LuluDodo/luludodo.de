import error from './error.ts';

async function load(app: HTMLElement) {
    await error(app, '404: Page Not Found')
}

export default load;