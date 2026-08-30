let hotkeys: Record<string, () => unknown> = {}
let paused = false

export function init() {
    window.addEventListener('keydown', (e) => {
        if (!paused && hotkeys.hasOwnProperty(e.key)) {
            hotkeys[e.key]()
            e.preventDefault()
        }
    })
}

export function resetHotkeys() {
    hotkeys = {}
}

export function pauseHotkeyUpdates() {
    paused = true
}

export function resumeHotkeyUpdates() {
    paused = false
}

export default function hotkey(key: string, action?: () => unknown) {
    if (action === undefined) {
        delete hotkeys[key]
    } else {
        hotkeys[key] = action
    }
}
