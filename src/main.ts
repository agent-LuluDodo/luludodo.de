import {init} from './util/paths.ts';
import './style.css'

window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault()
})

await init()