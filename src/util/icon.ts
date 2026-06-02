export default function icon(src: string, color: string, width: number = 0, height: number = 0, alt?: string, classList?: string[], fallback?: string, onload?: (canvas: HTMLCanvasElement) => unknown) {
    const img = document.createElement('img')
    img.src = src
    if (alt) img.ariaLabel = alt
    else img.ariaHidden = 'true'
    img.classList.add('icon-loading')
    if (classList) img.classList.add(...classList)
    img.style.width = width * 3 + 'px'
    img.style.height = height * 3 + 'px'
    img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth * 3
        canvas.height = img.naturalHeight * 3
        const ctx = canvas.getContext('2d')!
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, canvas.width, canvas.height)
        ctx.globalCompositeOperation = 'source-in'
        ctx.fillStyle = color
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        canvas.className = img.className
        canvas.classList.remove('icon-loading')
        canvas.ariaLabel = img.ariaLabel
        canvas.ariaHidden = img.ariaHidden
        img.replaceWith(canvas)

        if (onload) onload(canvas)
    }
    if (fallback) {
        img.onerror = () => {
            img.src = fallback
        }
    }
    return img
}