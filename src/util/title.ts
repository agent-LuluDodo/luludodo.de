let curTitle = 'LuluDodo'
let areTitleUpdatesPaused = false

function updateTitle() {
    if (!areTitleUpdatesPaused) {
        const title = document.getElementById('title')!
        title.textContent = curTitle
    }
}

export default function setTitle(title: string) {
    curTitle = title
    updateTitle()
}

export function resetTitle() {
    setTitle('LuluDodo')
}

export function pauseTitleUpdates() {
    areTitleUpdatesPaused = true
}

export function resumeTitleUpdates() {
    areTitleUpdatesPaused = false
    updateTitle()
}