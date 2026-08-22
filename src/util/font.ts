// noinspection SpellCheckingInspection
import {onChange} from './style.ts';
import rel from './link.ts';

const chars = [...'\0abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.,!?:;1234567890/\\<>|"\'´`=%$§&{}()[]+-*~#_^°©®@\uFFFD'.split('')];

type Font = {
    file: string
    height: number
    line: number
    space: number
    gap: number
    underline: number
    widths: number[]
    gapOverrides: {
        first: string,
        second: string,
        gap: number
    }[],
    ligatures: string[]
}

type MonoFont = {
    file: string
    height: number
    line: number
    gap: number
    underline: number
    width: number
    ligatures: string[]
}

const fonts: Font[] = [{
    file: 'font/big.png',
    height: 12,
    line: 2,
    space: 3,
    gap: 1,
    underline: 10,
    widths: [6, 7, 6, 6, 7, 6, 4, 6, 6, 1, 3, 5, 4, 8, 6, 6, 6, 6, 5, 6, 5, 6, 7, 7, 5, 7, 6, 6, 6, 6, 6, 5, 7, 6, 6, 3, 5, 5, 5, 7, 7, 6, 6, 7, 6, 6, 7, 6, 7, 7, 5, 5, 5, 1, 2, 1, 5, 1, 2, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 5, 4, 4, 1, 3, 1, 2, 2, 6, 9, 5, 6, 7, 3, 3, 2, 2, 2, 2, 7, 6, 3, 7, 6, 6, 3, 3, 9, 9, 9, 7, 10, 10, 10, 10, 8, 8],
    gapOverrides: [{
        first: 'f',
        second: 'acdefgjmnopqrsuvwxyzJ.,/<>=+-~_',
        gap: 0
    }, {
        first: 'abcdefhuiklmnoprstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\<>|"\'´`=+-*~^°1234567890',
        second: 'j',
        gap: 0
    }, {
        first: 'adl',
        second: 'ftFTVWY',
        gap: 0
    }, {
        first: '-',
        second: '-',
        gap: 0
    }, {
        first: '_',
        second: '_',
        gap: 0
    }],
    ligatures: ['->', '<-', '=>', '<=', ':)', ':(']
}, {
    file: 'font/normal.png',
    height: 9,
    line: 1,
    space: 2,
    gap: 1,
    underline: 8,
    widths: [5, 6, 5, 5, 6, 5, 4, 5, 5, 1, 2, 4, 3, 7, 5, 5, 5, 5, 4, 4, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 5, 5, 3, 4, 4, 4, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 7, 5, 5, 5, 1, 1, 1, 5, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3, 1, 3, 1, 2, 2, 5, 7, 5, 5, 6, 3, 3, 2, 2, 2, 2, 5, 5, 3, 7, 5, 5, 3, 3, 7, 7, 7, 7, 9, 9, 9, 9, 6, 6],
    gapOverrides: [{
        first: 'f',
        second: 'acdefgjmnopqrsuvwxyzJ.,/<>=+-~_',
        gap: 0
    }, {
        first: 'abcdefhuiklmnoprstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\<>|"\'´`=+-*~^°1234567890',
        second: 'j',
        gap: 0
    }, {
        first: 'adl',
        second: 'ftFTVWY',
        gap: 0
    }, {
        first: '-',
        second: '-',
        gap: 0
    }, {
        first: '_',
        second: '_',
        gap: 0
    }],
    ligatures: ['->', '<-', '=>', '<=', ':)', ':(']
}, {
    file: 'font/small.png',
    height: 8,
    line: 1,
    space: 2,
    gap: 1,
    underline: 7,
    widths: [4, 5, 4, 3, 5, 4, 3, 4, 4, 1, 2, 3, 2, 6, 4, 4, 4, 4, 3, 4, 3, 4, 5, 5, 3, 5, 4, 4, 4, 4, 4, 4, 5, 4, 4, 3, 3, 4, 4, 5, 5, 4, 4, 5, 4, 4, 5, 4, 5, 7, 5, 5, 4, 1, 1, 1, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 1, 3, 1, 2, 2, 4, 6, 4, 4, 5, 3, 3, 2, 2, 2, 2, 5, 4, 3, 5, 5, 4, 3, 3, 6, 6, 6, 5, 8, 8, 8, 8, 5, 5],
    gapOverrides: [{
        first: 'abcdefhuiklmnoprstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\<>|"\'´`=+-*~^°1234567890',
        second: 'j',
        gap: 0
    }, {
        first: 'l',
        second: 'ftFTVWY',
        gap: 0
    }, {
        first: '-',
        second: '-',
        gap: 0
    }, {
        first: '_',
        second: '_',
        gap: 0
    }],
    ligatures: ['->', '<-', '=>', '<=', ':)', ':(']
}]

const monoFonts: MonoFont[] = [{
    file: 'font/big-mono.png',
    height: 12,
    line: 2,
    gap: 1,
    underline: 10,
    width: 6,
    ligatures: ['==', '!=', '<=', '>=', '||', '->', '<-', '=>', '<>']
}, {
    file: 'font/normal-mono.png',
    height: 9,
    line: 1,
    gap: 1,
    underline: 8,
    width: 5,
    ligatures: ['==', '!=', '<=', '>=', '||', '->', '<-', '=>', '<>']
}, {
    file: 'font/small-mono.png',
    height: 8,
    line: 1,
    gap: 1,
    underline: 7,
    width: 4,
    ligatures: ['==', '!=', '<=', '>=', '||', '->', '<-', '=>', '<>']
}]

const specialFonts: Record<string, Font> = {
    'tiny-1': {
        file: 'font/tiny1.png',
        height: 5,
        line: 1,
        space: 1,
        gap: 1,
        underline: 4,
        widths: [3, 3, 3, 2, 3, 3, 3, 3, 3, 1, 2, 3, 2, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 2, 2, 3, 3, 1, 2, 3, 2, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 2, 1, 1, 1, 2, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 3, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 3, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3],
        gapOverrides: [{
            first: '/',
            second: '/',
            gap: 0
        }],
        ligatures: []
    },
    'tiny-2': {
        file: 'font/tiny2.png',
        height: 5,
        line: 1,
        space: 1,
        gap: 1,
        underline: 4,
        widths: [3, 3, 3, 2, 3, 3, 3, 3, 3, 1, 2, 3, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 2, 1, 1, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 3, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3],
        gapOverrides: [{
            first: '/',
            second: '/',
            gap: 0
        }],
        ligatures: []
    },
    'tiny-3': {
        file: 'font/tiny3.png',
        height: 5,
        line: 1,
        space: 1,
        gap: 1,
        underline: 4,
        widths: [3, 3, 3, 2, 3, 3, 3, 3, 3, 1, 2, 3, 2, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 3, 3, 3, 4, 3, 2, 3, 3, 3, 5, 3, 3, 3, 1, 1, 1, 2, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 3, 1, 2, 2, 3, 4, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 2, 3, 3, 5, 3, 3, 3, 3, 3, 3, 5],
        gapOverrides: [{
            first: '/',
            second: '/',
            gap: 0
        }],
        ligatures: []
    },
    'tiny': {
        file: 'font/tiny4.png',
        height: 5,
        line: 1,
        space: 1,
        gap: 1,
        underline: 4,
        widths: [3, 3, 3, 2, 3, 3, 3, 3, 3, 1, 2, 3, 2, 5, 3, 3, 3, 3, 3, 2, 3, 3, 3, 5, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 2, 3, 3, 5, 4, 3, 3, 4, 3, 2, 3, 3, 3, 5, 3, 3, 2, 1, 1, 1, 2, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 3, 1, 2, 2, 3, 4, 3, 3, 3, 3, 3, 2, 2, 2, 2, 3, 2, 3, 3, 5, 3, 3, 2, 7, 7, 3, 3],
        gapOverrides: [{
            first: '/',
            second: '/',
            gap: 0
        }],
        ligatures: []
    }
}

type ParsedFont = {
    image: Promise<ImageBitmap>
    line: number
    height: number
    space: number
    gap: number
    underline: number
    charTable: CharTable
    gapOverrides: Record<string, number>
}

type CharTable = {
    [char: string]: {
        x: number
        width: number
    }
}

const parsedFonts: Record<number, ParsedFont> = {}
const parsedMonoFonts: Record<number, ParsedFont> = {}

const parsedSpecialFonts: Record<string, ParsedFont> = {}

function loadImage(font: Font | MonoFont, mono: boolean, expectedWidth: number): Promise<ImageBitmap> {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img')
        img.src = '/' + font.file
        img.fetchPriority = 'high'
        img.onload = async _ => {
            const bitmap = await window.createImageBitmap(img)

            if (bitmap.width != expectedWidth)
                console.error("Width mismatch for font (" + font.height + (mono ? '-mono' : '') + ") " + bitmap.width + " != " + expectedWidth);

            resolve(bitmap)
        }
        img.onerror = _ => reject(new Error('Could not load font! (unable to load \'' + font.file + '\')'))
    });
}

function get_special_font(name: string) {
    let parsed = parsedSpecialFonts[name]
    if (parsed === undefined) {
        parsed = parse_font(specialFonts[name]);
        parsedSpecialFonts[name] = parsed
    }
    return parsed
}

function parse_font(font: Font): ParsedFont {
    const charTable: CharTable = {}
    let i = 0
    let x = 0
    for (const char of chars) {
        const width = font.widths[i]
        charTable[char] = {x, width}
        x += width + 1
        i++
    }
    for (const ligature of font.ligatures) {
        const width = font.widths[i]
        charTable[ligature] = {x, width}
        x += width + 1
        i++
    }

    const gapOverrides: Record<string, number> = {}
    for (const gapOverride of font.gapOverrides) {
        for (const first of gapOverride.first.split('')) {
            for (const second of gapOverride.second.split('')) {
                gapOverrides[first + second] = gapOverride.gap
            }
        }
    }

    const image: Promise<ImageBitmap> = loadImage(font, false, x)

    return {
        image,
        line: font.line,
        height: font.height,
        space: font.space,
        gap: font.gap,
        underline: font.underline,
        charTable,
        gapOverrides
    }
}

for (const font of fonts) {
    parsedFonts[font.height] = parse_font(font)
}

for (const monoFont of monoFonts) {

    const charTable: CharTable = {}
    let i = 0
    let x = 0
    for (const char of chars) {
        const width = monoFont.width;
        charTable[char] = {x, width}
        x += width + 1
        i++
    }
    for (const ligature of monoFont.ligatures) {
        const width = ligature.length * monoFont.width + (ligature.length - 1) * monoFont.gap
        charTable[ligature] = {x, width}
        x += width + 1
        i++
    }

    const image: Promise<ImageBitmap> = loadImage(monoFont, true, x)

    parsedMonoFonts[monoFont.height] = {
        image,
        line: monoFont.line,
        height: monoFont.height,
        space: monoFont.width,
        gap: monoFont.gap,
        underline: monoFont.underline,
        charTable,
        gapOverrides: {}
    }
}

export const FONT_BIG = 12;
export const FONT_NORMAL = 9;
export const FONT_SMALL = 8;

const SCALE = 3

type RenderableTextSection = {
    x: number,
    y: number,
    width: number,
    height: number,
    chars: string[],
    color: string,
    underline?: string,
    bold?: boolean
}

type TextComponent = {
    content: string,
    color?: string,
    underline?: string
    bold?: boolean
}

export type Text = string | TextComponent | TextComponent[]

async function renderSingleSection(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, font: ParsedFont, image: ImageBitmap, text: RenderableTextSection, scale: number) {
    let canvasX = 0;
    for (let i = 0; i < text.chars.length; i++) {
        const char = text.chars[i]
        if (i > 0) {
            canvasX += font.gapOverrides[text.chars[i - 1] + char] ?? font.gap
        }

        if (char == ' ') {
            canvasX += font.space
        } else {
            let entry: {x: number, width: number} | undefined = undefined;
            if (i < text.chars.length - 1) {
                entry = font.charTable[char + text.chars[i + 1]]
            }
            if (entry === undefined) {
                entry = font.charTable[char]
            } else {
                i++
            }
            if (entry === undefined) entry = font.charTable['\0']
            const {x, width} = entry
            ctx.drawImage(image, x, 0, width, text.height, canvasX * scale, 0, width * scale, text.height * scale)
            canvasX += width
        }
    }

    ctx.globalCompositeOperation = 'source-in'
    ctx.fillStyle = text.color
    ctx.fillRect(0, 0, text.width * scale, text.height * scale);

    if (text.underline) {
        ctx.globalCompositeOperation = 'destination-over'
        ctx.fillStyle = text.underline
        ctx.fillRect(0, font.underline * scale, text.width * scale, scale);
    }
}

const sharedCanvas = new OffscreenCanvas(1024, 1024)
const sharedCtx = sharedCanvas.getContext('2d')!

async function renderSection(ctx: CanvasRenderingContext2D, font: ParsedFont, image: ImageBitmap, text: RenderableTextSection) {
    let canvas;
    let textCtx;
    if (text.width <= 1024 && text.height <= 1024) {
        canvas = sharedCanvas
        textCtx = sharedCtx
        textCtx.globalCompositeOperation = 'source-over'
        textCtx.clearRect(0, 0, text.width, text.height)
    } else {
        canvas = new OffscreenCanvas(text.width, text.height);
        textCtx = canvas.getContext('2d')!;
    }

    await renderSingleSection(textCtx, font, image, text, 1)

    ctx.drawImage(canvas, 0, 0, text.width, text.height, text.x * SCALE, text.y * SCALE, text.width * SCALE, text.height * SCALE)
}

export default async function text(text: Text, special: string): Promise<HTMLCanvasElement>;
export default async function text(text: Text, height?: number, mono?: boolean): Promise<HTMLCanvasElement>;
export default async function text(text: Text, height: number | string = FONT_NORMAL, mono: boolean = false) {
    if (typeof text === 'string') {
        text = [{
            content: text
        }];
    } else if (!Array.isArray(text)) {
        text = [text]
    }

    const font = typeof height === 'string' ?
        get_special_font(height) :
        mono ? parsedMonoFonts[height] : parsedFonts[height]
    height = font.height

    const image = await font.image

    const sections: RenderableTextSection[] = []

    let label = ''

    let textWidth = 0
    let textHeight = 0
    let lineWidth = 0
    for (const component of text) {
        let x = lineWidth
        let start = 0

        label += component.content

        const chars = component.content.split('');
        for (let i = 0; i < chars.length; i++) {
            const char = chars[i]
            if (char == ' ') {
                lineWidth += font.space
            } else if (char == '\n') {
                if (start < i) {
                    sections.push({
                        x,
                        y: textHeight,
                        width: lineWidth - x,
                        height,
                        chars: chars.slice(start, i),
                        color: component.color ?? TEXT,
                        underline: component.underline
                    });
                }

                x = 0
                start = i + 1
                textWidth = Math.max(textWidth, lineWidth)
                lineWidth = -font.gap
                textHeight += height + font.line
            } else {
                let entry: { x: number, width: number } | undefined = undefined;
                if (i < chars.length - 1) {
                    entry = font.charTable[char + chars[i + 1]]
                }
                if (entry === undefined) {
                    entry = font.charTable[char]
                } else {
                    i++
                }
                if (entry === undefined) entry = font.charTable['\0']
                lineWidth += entry.width;
            }

            lineWidth += font.gap
        }

        if (start < chars.length) {
            sections.push({
                x,
                y: textHeight,
                width: lineWidth - x,
                height,
                chars: chars.slice(start),
                color: component.color ?? TEXT,
                underline: component.underline,
            });
        }
    }
    textWidth = Math.max(textWidth, lineWidth)
    textHeight += height + font.line

    const canvas = document.createElement('canvas')
    canvas.ariaLabel = label
    canvas.classList = 'text'
    canvas.width = textWidth * SCALE
    canvas.height = textHeight * SCALE

    const ctx = canvas.getContext('2d')!
    ctx.imageSmoothingEnabled = false

    if (sections.length == 1 && sections[0].x == 0 && sections[0].y == 0) {
        await renderSingleSection(ctx, font, image, sections[0], SCALE)
    } else if (sections.length != 0) {
        for (const section of sections) {
            await renderSection(ctx, font, image, section)
        }
    }

    return canvas
}


let TEXT: string;
let ALT_TEXT: string;
let LINK: string

onChange(style => {
    TEXT = style.text
    ALT_TEXT = style.altText
    LINK = style.link
})

export async function getWidth(chars: number, height: number = FONT_NORMAL) {
    return parsedMonoFonts[height].charTable['\0'].width * SCALE * chars;
}

export async function renderHTML(html: HTMLElement, linkPrefix?: string) {
    return await renderNode(html, linkPrefix) as HTMLElement
}

async function renderNode(html: Node, linkPrefix: string | undefined, height: number = FONT_NORMAL, color: string = ALT_TEXT, underline: string | undefined = undefined, mono = false, allow_newlines = false): Promise<Node | Node[]> {
    if (html instanceof Text) {
        let content = html.data
        if (content != '\n') {
            if (!allow_newlines) {
                content = content.replaceAll('\n', ' ')
            } else if (content.endsWith('\n')) {
                content = content.substring(0, content.length - 1)
            }
            if (content.length > 0) {
                const words = allow_newlines ? [content] : content.split(' ')
                if (words.length > 1) {
                    const result: HTMLCanvasElement[] = []
                    for (let i = 0; i < words.length; i++) {
                        let content = words[i]
                        if (i < words.length - 1)
                            content += ' '
                        result.push(await text([{
                            content,
                            color,
                            underline
                        }], height, mono))
                    }
                    return result
                } else {
                    return await text([{
                        content,
                        color,
                        underline
                    }], height, mono)
                }
            } else {
                return []
            }
        }
        return html.cloneNode(true)
    } else if (html instanceof HTMLElement) {
        let result = html.cloneNode(false)
        let ol = false
        let ul = false
        switch (html.tagName) {
            case 'DIV':
                break
            case 'PRE':
                allow_newlines = true
                break
            case 'H1':
                color = TEXT
                underline = TEXT
                height = FONT_BIG;
                break
            case 'H2':
                color = TEXT
                height = FONT_BIG;
                break
            case 'H3':
                color = TEXT
                underline = TEXT
                break
            case 'H4':
                color = TEXT
                break
            case 'H5':
                color = TEXT
                height = FONT_SMALL
                underline = TEXT
                break
            case 'H6':
                color = TEXT
                height = FONT_SMALL
                break
            case 'A':
                color = LINK;
                underline = LINK;
                (result as HTMLAnchorElement).href = rel((result as HTMLAnchorElement).href, linkPrefix)
                break
            case 'STRONG':
                color = TEXT
                break
            case 'EM':
                height = FONT_SMALL
                break
            case 'CODE':
                mono = true;
                break
            case 'P':
                break
            case 'UL':
                ul = true
                break
            case 'OL':
                ol = true
                break
            case 'LI':
                result = document.createElement('span')
                break
            case 'TABLE':
                break
            case 'THEAD':
                break
            case 'TBODY':
                break
            case 'TR':
                break
            case 'TH':
                break
            case 'TD':
                break
            case 'HR':
                break
            case 'IMG':
                (result as HTMLImageElement).src = rel((result as HTMLImageElement).src, linkPrefix)
                break
            case 'BR':
                break
            default:
                console.log('Unknown HTML Element: ' + html.tagName)
                return html.cloneNode(true)
        }

        if (ol) {
            let j = 1;
            for (let i = 0; i < html.childNodes.length; i++) {
                const child = html.childNodes[i]
                if (child instanceof HTMLLIElement) {
                    const li = document.createElement('li')
                    let padding: number;
                    if (j >= 100) {
                        padding = 0
                    } else if (j >= 10) {
                        padding = await getWidth(1)
                    } else {
                        padding = await getWidth(2)
                    }

                    const prefix = await text(j++ + '. ')
                    prefix.style.paddingLeft = padding + 'px'

                    li.appendChild(prefix)
                    li.appendChild(await renderNode(child, linkPrefix, height, color, underline, mono, allow_newlines) as Node)
                    result.appendChild(li)
                }
            }
        } else if (ul) {
            for (let i = 0; i < html.childNodes.length; i++) {
                const child = html.childNodes[i]
                if (child instanceof HTMLLIElement) {
                    const li = document.createElement('li')
                    const prefix = await text('- ')
                    prefix.style.paddingLeft = (await getWidth(2) + 3) + 'px'
                    li.appendChild(prefix)
                    li.appendChild(await renderNode(child, linkPrefix, height, color, underline, mono, allow_newlines) as Node)
                    result.appendChild(li)
                }
            }
        } else {
            for (const childNode of html.childNodes) {
                const childRendered = await renderNode(childNode, linkPrefix, height, color, underline, mono, allow_newlines)
                if (Array.isArray(childRendered)) {
                    for (const node of childRendered) {
                        result.appendChild(node)
                    }
                } else {
                    result.appendChild(childRendered)
                }
            }
        }

        return result
    } else {
        console.log('Unknown Node: ' + html)
        return html.cloneNode(true)
    }
}