import {applyStyle} from './style.ts';

export const paths: Record<string, string> = {
    '': 'home',
    'mod': 'mod',
    'mods': 'mods',
    'test-font': 'test_font',
    'test-code': 'test_code',
    'test-markdown': 'test_markdown',
    'lorem-ipsum': 'lorem_ipsum',
    'privacy-policy': 'privacy_policy',
    'terms-of-use': 'terms_of_use',
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

export async function load(path: string, subpath: string) {
    window.scrollTo(0, 0)

    const oldApp = document.getElementById('app')!
    const app = document.createElement('div')

    const module = await getModule(path)
    await module.default(app, subpath)

    app.id = 'app'
    applyStyle()
    oldApp.replaceWith(app)
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