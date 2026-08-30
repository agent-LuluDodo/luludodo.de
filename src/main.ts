import {init as initPaths} from './util/paths.ts'
import {init as initDrop} from './util/drop.ts'
import {init as initHotkeys} from './util/hotkey.ts'
import './style.css'

window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault()
})

initDrop()
initHotkeys()
await initPaths()