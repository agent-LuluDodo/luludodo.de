import next_frame from './next_frame.ts';

let paused = false
let ondrop: ((files: FileList, callback: (success: boolean) => void) => void) | null = null
export function init() {
    window.addEventListener('dragenter', ev => {
        if (!paused && ondrop !== null && ev.dataTransfer?.types.includes('Files')) {
            document.body.classList.add('potential-drop')
        }
    })
    window.addEventListener('dragover', ev => {
        if (!paused && ondrop !== null && ev.dataTransfer?.types.includes('Files')) {
            if (!document.body.classList.contains('potential-drop')) {
                document.body.classList.add('potential-drop')
            }
            ev.preventDefault()
        }
    })
    window.addEventListener('dragleave', ev => {
        if (ev.target === document.body) {
            document.body.classList.remove('potential-drop')
        }
    })
    window.addEventListener('drop', async ev => {
        console.log(ev.dataTransfer)

        function show(success: boolean) {
            let clazz = success ? 'drop-success' : 'drop-failure'
            document.body.classList.remove('potential-drop')
            document.body.classList.add(clazz)
            setTimeout(() => {
                document.body.classList.remove(clazz)
            }, 1000)
        }

        if (!paused && ondrop !== null) {
            ev.preventDefault()
            try {
                ondrop(ev.dataTransfer!.files, show)
            } catch (e) {
                console.error(e)
                show(false)
            }
        }
    })
}

export function pauseDropUpdates() {
    document.body.classList.remove('potential-drop')
    paused = true
}

export function resumeDropUpdates() {
    paused = false
}

export function resetDrop() {
    document.body.classList.remove('potential-drop')
    ondrop = null
}

export default function drop(callback: (files: FileList, callback: (success: boolean) => void) => void) {
    ondrop = callback
}

export function onDrop(callback: (file: File) => unknown) {
    ondrop = async (files, returns) => {
        if (files.length !== 1) {
            returns(false)
        } else {
            returns(true)
            await next_frame()
            await callback(files[0])
        }
    }
}