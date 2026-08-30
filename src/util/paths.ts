import {applyStyle} from './style.ts';
import {pauseTitleUpdates, resetTitle, resumeTitleUpdates} from './title.ts';
import progress from './progress.ts';
import {pauseDropUpdates, resetDrop, resumeDropUpdates} from './drop.ts';
import {pauseHotkeyUpdates, resetHotkeys, resumeHotkeyUpdates} from './hotkey.ts';

export const paths: Record<string, string> = {
    '': 'home',
    'mod': 'mod',
    'mods': 'mods',
    'lorem-ipsum': 'lorem_ipsum',
    'privacy-policy': 'privacy_policy',
    'terms-of-use': 'terms_of_use',
    'java-bytecode-viewer': 'java_bytecode_viewer',

    'test-font': 'test_font',
    'test-code': 'test_code',
    'test-markdown': 'test_markdown',
    'test-wip': 'wip',
}

let lastPath: [string, string] | undefined = undefined
let lastHash: string = ''

function cleanPath(path: string): [string, string] {
    const lastSlash = path.indexOf('/', 1);

    const page = path.substring(
        path.startsWith('/') ? 1 : 0,
        lastSlash == -1 ? path.length : lastSlash)

    const subpath = lastSlash == -1 ? '' : path.substring(lastSlash + 1)

    return [page, subpath.endsWith('/') ? subpath.substring(0, subpath.length - 1) : subpath]
}

async function navigate() {
    const cleaned = cleanPath(window.location.pathname)
    if (lastPath === undefined || lastPath[0] !== cleaned[0] || lastPath[1] !== cleaned[1]) {
        lastPath = cleaned;
        await load(...cleaned)
        lastHash = window.location.hash.substring(1)
        await startHash(lastHash)
    } else {
        const hash = window.location.hash.substring(1)
        if (lastHash !== hash) {
            await endHash(lastHash)
            lastHash = hash
            await startHash(hash)
        } else {
            window.scrollTo(0, 0)
        }
    }
}

export async function init() {
    function linkClicked(e: MouseEvent) {
        if (e.currentTarget instanceof HTMLAnchorElement) {
            if (e.currentTarget.hasAttribute('href') && e.currentTarget.host == window.location.host) {
                window.history.pushState(null, document.title, e.currentTarget.href)
                e.preventDefault()
                e.stopImmediatePropagation()
                navigate()
            }
        }
    }

    window.addEventListener('popstate', navigate)

    const links = document.getElementsByTagName('a')
    const observer = new MutationObserver(() => {
        for (const link of links) {
            link.addEventListener('click', linkClicked)
        }
    })
    observer.observe(document.body, {subtree: true, childList: true})

    await navigate()
}

async function getModule(path: string) {
    const file = paths[path]

    return file === undefined ?
        await import('../error/404.ts') :
        await import(`../page/${file}.ts`)
}

let curIndex = 0;

export async function load(path: string, subpath: string) {
    pauseTitleUpdates()
    pauseDropUpdates()
    pauseHotkeyUpdates()
    resetTitle()
    resetDrop()
    resetHotkeys()

    const index = ++curIndex;

    if (index < curIndex) return;
    progress(0)

    const oldApp = document.getElementById('app')!
    let app = document.createElement('div')

    if (index < curIndex) return;
    progress(0.1)

    const module = await getModule(path)

    if (index < curIndex) return;
    progress(0.5)

    try {
        await module.default(app, subpath)
    } catch (e) {
        if (index < curIndex) return;
        progress(0)

        console.error(e)
        app = document.createElement('div')

        if (index < curIndex) return;
        progress(0.1)
        const errorPage = await import('../error/unknown.ts')

        if (index < curIndex) return;
        progress(0.5)

        await errorPage.default(app)
    }

    if (index < curIndex) return;
    progress(0.8)

    app.id = 'app'
    applyStyle()
    oldApp.replaceWith(app)

    if (index < curIndex) return;
    progress(0.9)

    const loading = document.getElementById('loading')
    if (loading) loading.remove()

    window.scrollTo(0, 0)

    if (index < curIndex) return;
    progress(1.0)

    resumeHotkeyUpdates()
    resumeDropUpdates()
    resumeTitleUpdates()
}

export async function startHash(hash: string) {
    if (lastPath !== undefined) {
        const [path, subpath] = lastPath;

        const module = await getModule(path)
        const startHash = module.startHash;
        if (startHash !== undefined)
            await startHash(hash, subpath);
    }
}

export async function endHash(hash: string) {
    if (lastPath !== undefined) {
        const [path, subpath] = lastPath;

        const module = await getModule(path)
        const endHash = module.endHash;
        if (endHash !== undefined)
            await endHash(hash, subpath);
    }
}