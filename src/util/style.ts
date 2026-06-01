export type Style = {
    text: string
    altText: string
    background: string
    altBackground: string
    link: string
}

export type StyleCallback = (style: Style) => unknown

let curStyle = {
    text: '#FFF',
    altText: '#AAA',
    background: '#333',
    altBackground: '#111',
    link: '#7AF'
}

const callbacks: StyleCallback[] = []

export function getStyle() {
    return curStyle;
}

export function onChange(callback: StyleCallback) {
    callbacks.push(callback);
    callback(curStyle)
}

export function applyStyle() {
    document.documentElement.style.setProperty('--text', curStyle.text)
    document.documentElement.style.setProperty('--alt-text', curStyle.altText)
    document.documentElement.style.setProperty('--background', curStyle.background)
    document.documentElement.style.setProperty('--alt-background', curStyle.altBackground)
}

export default function setStyle(style: Style) {
    curStyle = style
    for (const callback of callbacks) {
        callback(style)
    }
}