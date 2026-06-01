import text, {FONT_BIG, FONT_NORMAL, FONT_SMALL} from '../util/font.ts';

async function load(app: HTMLElement) {
    await timed(app, async app => {
        app.style.overflowX = 'auto'
        app.appendChild(await text('Big: abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.,!?:;1234567890/\\<>|"\'´`=%$§&{}()[]+-*~#_^°©®@-><-=><=:):(', FONT_BIG, false))
        app.appendChild(await text('Big Mono: abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.,!?:;1234567890/\\<>|"\'´`=%$§&{}()[]+-*~#_^°©®@==!=<=>=||-><-=><>', FONT_BIG, true))
        app.appendChild(await text('Normal: abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.,!?:;1234567890/\\<>|"\'´`=%$§&{}()[]+-*~#_^°©®@-><-=><=:):(', FONT_NORMAL, false))
        app.appendChild(await text('Normal Mono: abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.,!?:;1234567890/\\<>|"\'´`=%$§&{}()[]+-*~#_^°©®@==!=<=>=||-><-=><>', FONT_NORMAL, true))
        app.appendChild(await text('Small: abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.,!?:;1234567890/\\<>|"\'´`=%$§&{}()[]+-*~#_^°©®@-><-=><=:):(', FONT_SMALL, false))
        app.appendChild(await text('Small Mono: abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.,!?:;1234567890/\\<>|"\'´`=%$§&{}()[]+-*~#_^°©®@==!=<=>=||-><-=><>', FONT_SMALL, true))
        app.appendChild(await text([{
            content: 'My super amazing title!11!!!!',
            color: '#F00',
            underline: '#00F'
        }, {
            content: '!!!!\nWith a new line! (ä)',
            color: '#0FF',
            underline: '#FF0'
        }], FONT_BIG))
        app.appendChild(await text([{
            content: 'Lorem ipsum dolor sit amet. I don\'t know more of lorem ipsum,\nso just bear with me :)',
            color: '#FFF'
        }, {
            content: ' :(',
            color: '#F00'
        }, {
            content: '\n    Indented                                                    ö',
            color: '#FFF',
        }], FONT_NORMAL))
        app.appendChild(await text([{
            content: 'I\'m tiny!',
            color: '#777'
        }, {
            content: '\n\n\nLook here -->            ',
            color: '#0F0'
        }, {
            content: '                ',
            color: '#F00',
            underline: '#F00'
        }, {
            content: '\\(`_´)/',
            color: '#F00'
        }, {
            content: '\n...\n\nBad chars: äüößÄÜÖ\0',
            color: '#FFF7'
        }], FONT_SMALL))
    })
}

export async function timed(app: HTMLElement, action: (app: HTMLElement) => unknown) {
    const loadMs = performance.now();
    await text('', FONT_BIG, false);
    await text('', FONT_BIG, true);
    await text('', FONT_NORMAL, false);
    await text('', FONT_NORMAL, true);
    await text('', FONT_SMALL, false);
    await text('', FONT_SMALL, true);
    const renderMs = performance.now();
    await action(app);
    const info = document.createElement('div')
    info.style.minHeight = 'min-content'
    info.appendChild(await text([{
        content: '\n\n--------------------------------------------\n| ',
        color: '#777'
    }, {
        content: 'Rendering',
        color: '#AAA'
    }, {
        content: ' test page took ',
        color: '#777'
    }, {
        content: Math.round(performance.now() - renderMs) + "ms",
        color: '#0FF'
    }, {
        content: ' (',
        color: '#777'
    }, {
        content: 'Loading',
        color: '#AAA'
    }, {
        content: ' took ',
        color: '#777'
    }, {
        content: Math.round(renderMs - loadMs) + "ms",
        color: '#FA0'
    }, {
        content: ') |\n--------------------------------------------',
        color: '#777'
    }], FONT_NORMAL));
    info.style.maxWidth = '100vw'
    info.style.overflow = 'auto'
    app.appendChild(info);
}

export default load;