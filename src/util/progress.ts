export default function progress(percent: number) {
    const progress = document.getElementById('progress')!
    if (percent < 1) {
        if (progress.childElementCount == 0) {
            progress.appendChild(document.createElement('div'))
        }
        (progress.children[0] as HTMLElement).style.width = `${percent * 100}%`
    } else if (progress.childElementCount == 1) {
        progress.removeChild(progress.children[0])
    }
}