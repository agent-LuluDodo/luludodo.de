import {getStyle} from './style.ts';
import icon from './icon.ts';

type Deco = 'title' | 'fancy' | 'mod' | 'quick' | 'chains' | 'chains_entry' | 'building' | 'building_entry' | 'building_end' | 'header'

export type DecoInfo = {
    prefix?: string
    relink?: boolean
    html?: string
    deco?: string
    leftTop?: string
    left?: string
    leftBottom?: string
    rightTop?: string
    right?: string
    rightBottom?: string
    topLeft?: string
    top?: string
    topRight?: string
    bottomLeft?: string
    bottom?: string
    bottomRight?: string
}

const decos: Record<Deco, DecoInfo> = {
    title: {
        html: 'corner-8',
        left: '1',
        right: '1.flip-h',
        top: '2',
        bottom: '2.flip-v',
    },
    fancy: {
        html: 'corner-8',
        top: '1',
        bottom: '1.flip-v',
    },
    mod: {
        html: 'corner-8',
        relink: true,
        left: '1',
        right: '1.flip-h',
        top: '2',
        bottom: '2.flip-h.flip-v',
    },
    quick: {
        html: 'corner-1',
        relink: true,
        left: '1',
        top: '2',
        bottom: '2.flip-v',
    },
    chains: {
        html: 'corner-8',
        relink: true,
        bottom: '1',
        left: '2',
        right: '2.flip-h',
        top: '3',
    },
    chains_entry: {
        html: 'corner-1',
        bottom: '1',
        top: '2'
    },
    building: {
        html: 'corner-8',
        bottom: '1',
        left: '2',
        right: '2.flip-h',
    },
    building_entry: {
        html: 'corner-1',
        left: '2',
        right: '1.flip-h',
    },
    building_end: {
        top: '1',
        bottom: '2'
    },
    header: {
        left: '1',
        right: '1.flip-h',
        bottom: '2'
    }
}

export default function deco(html: HTMLElement, decoration: Deco | DecoInfo, alt = false) {
    const info = typeof decoration === 'string' ? decos[decoration] : decoration;
    let wrapper;
    if (info.relink && html instanceof HTMLAnchorElement) {
        wrapper = document.createElement('a');
        for (const attributeName of html.getAttributeNames()) {
            if (attributeName !== 'class') {
                wrapper.setAttribute(attributeName, html.getAttribute(attributeName)!)
                html.removeAttribute(attributeName)
            }
        }
    } else {
        wrapper = document.createElement('div');
    }
    wrapper.classList.add('deco')
    if (typeof decoration === 'string')
        wrapper.classList.add(decoration)
    if (alt) wrapper.classList.add('alt')


    const grid = document.createElement('div')
    grid.classList.add('grid')

    const prefix = typeof decoration === 'string' ? decoration : undefined
    add(grid, prefix, info, 'left'  , alt)
    add(grid, prefix, info, 'right' , alt)
    add(grid, prefix, info, 'top'   , alt)
    add(grid, prefix, info, 'bottom', alt)

    if (info.html !== undefined)
        html.classList.add(...info.html.split('.'))
    html.classList.add('html')

    grid.appendChild(html)

    if (info.deco !== undefined)
        wrapper.classList.add(...info.deco.split('.'))

    wrapper.appendChild(grid)

    return wrapper
}

function add(grid: HTMLElement, prefix: string | undefined, info: DecoInfo, direction: 'left' | 'right' | 'top' | 'bottom', alt: boolean) {
    const image = info[direction]
    if (image === undefined) return;

    const dot = image.indexOf('.')
    const imgName = dot == -1 ? image : image.substring(0, dot)
    const classes = dot == -1 ? [] : image.substring(dot + 1).split('.')

    let src;
    if (info.prefix === undefined) {
        if (prefix !== undefined) {
            src = `/deco/${prefix}/${imgName}.png`
        } else {
            src = `/deco/${imgName}.png`
        }
    } else {
        src = `/deco/${info.prefix}/${imgName}.png`
    }
    grid.appendChild(icon(src, alt ? getStyle().altBackground : getStyle().background, 0, 0, ['deco-img', direction, ...classes], undefined, canvas => {
        switch (direction) {
            case 'left':
                grid.style.marginLeft = '-' + canvas.width + 'px'
                break
            case 'right':
                grid.style.marginRight = '-' + canvas.width + 'px'
                break
            case 'top':
                grid.style.marginTop = '-' + canvas.height + 'px'
                break
            case 'bottom':
                grid.style.marginBottom = '-' + canvas.height + 'px'
                break
        }
    }))
}