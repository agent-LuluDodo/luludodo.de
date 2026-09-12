import setStyle, {type Style} from '../util/style.ts';
import header from '../util/header.ts';
import footer from '../util/footer.ts';
import setTitle from '../util/title.ts';
import deco from '../util/deco.ts';
import text, {FONT_BIG, FONT_NORMAL} from '../util/font.ts';
import icon from '../util/icon.ts';
import hotkey from '../util/hotkey.ts';

const style: Style = {
    text: '#FFF',
    altText: '#CCE',
    link: '#77F',
    altBackground: '#335',
    background: '#002'
}

async function load(app: HTMLElement) {
    setStyle(style)
    setTitle('RNG')
    app.appendChild(await header())

    const container = document.createElement('div')
    container.appendChild(deco(await text('Random Numbers', FONT_BIG), 'title'))

    const content = document.createElement('div')

    container.appendChild(content)
    container.classList.add('rng')
    container.appendChild(await rng(1, 'int'))
    container.appendChild(await rng(1, 'uint'))
    container.appendChild(await rng(1, 'hex'))
    container.appendChild(await rng(2, 'int'))
    container.appendChild(await rng(2, 'uint'))
    container.appendChild(await rng(2, 'hex'))
    container.appendChild(await rng(4, 'int'))
    container.appendChild(await rng(4, 'uint'))
    container.appendChild(await rng(4, 'hex'))
    container.appendChild(await rng(8, 'int'))
    container.appendChild(await rng(8, 'uint'))
    container.appendChild(await rng(8, 'hex'))
    container.appendChild(await rng(16, 'int'))
    container.appendChild(await rng(16, 'uint'))
    container.appendChild(await rng(16, 'hex'))
    container.appendChild(await rng(32, 'int'))
    container.appendChild(await rng(32, 'uint'))
    container.appendChild(await rng(32, 'hex'))

    app.appendChild(container)

    app.appendChild(await footer())
}

async function _rng(name: string, bytes: number, display: (array: Uint8Array) => string) {
    const array = new Uint8Array(bytes);
    crypto.getRandomValues(array)

    const div = document.createElement('div')
    div.classList.add('number')
    div.appendChild(await text(name, FONT_NORMAL, true))
    const copy = display(array)
    let valueDiv = document.createElement('div')
    valueDiv.classList.add('value', 'clickable')
    let value = await text(copy, FONT_NORMAL, true)
    value.onclick = () => {
        navigator.clipboard.writeText(copy.trim())
    }
    valueDiv.appendChild(value)
    div.appendChild(valueDiv)
    const reroll = icon('icon/reroll.png', style.text)
    reroll.classList.add('reroll', 'clickable')
    reroll.onclick = async () => {
        crypto.getRandomValues(array)
        const copy = display(array)
        const newValue = await text(copy, FONT_NORMAL, true)
        newValue.onclick = () => {
            navigator.clipboard.writeText(copy.trim())
        }
        value.replaceWith(newValue)
        value = newValue
    }
    hotkey('f5', () => reroll.click())
    div.appendChild(reroll)

    return div
}

async function rng(bytes: number, type: 'uint' | 'int' | 'hex') {
    return await _rng(type[0] + (bytes * 8), bytes, (array) => {
        switch (type) {
            case 'uint':
                return toInt(array, false)
            case 'int':
                return toInt(array, true)
            case 'hex':
                return toHex(array)
        }
    })
}

function toInt(array: Uint8Array, signed: boolean) {
    const negative = signed && (array[0] & 0x80) !== 0
    if (negative) {
        array[0] = array[0] & 0x7F
    }
    let width = signed ?
        (BigInt(1n) << (BigInt(array.length) * 8n - 1n)).toString().length + 1 :
        ((BigInt(1n) << (BigInt(array.length) * 8n)) - 1n).toString().length
    let result: string = " ".repeat(width)
    if (negative) {
        let bigint = BigInt(toHex(array))
        bigint ^= -1n;
        result += bigint.toString()
    } else {
        result += BigInt(toHex(array)).toString()
    }
    return result.substring(result.length - width)
}

function toHex(array: Uint8Array) {
    let result = '0x'
    for (let i = 0; i < array.length; i++) {
        const value = "0" + array[i].toString(16)
        result += value.substring(value.length - 2).toUpperCase()
    }
    return result
}

export default load