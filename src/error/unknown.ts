import error from './error.ts';

async function load(app: HTMLElement) {
    await error(app, 'Error displaying page!')
}

export default load;