let hotkeys: Record<string, (() => unknown)[]> = {}
let paused = false

export function init() {
    window.addEventListener('keydown', (e) => {
        console.log(e)
        if (!paused && hotkeys.hasOwnProperty(e.key)) {
            console.log('2')
            e.preventDefault()
            if (!e.repeat) {
                for (const hotkey of (hotkeys[e.key.toUpperCase()] ?? [])) {
                    hotkey()
                }
            }
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
    key = key.toUpperCase()
    if (action === undefined) {
        delete hotkeys[key]
    } else {
        if (!hotkeys.hasOwnProperty(key)) {
            hotkeys[key] = []
        }
        hotkeys[key].push(action)
    }
}
