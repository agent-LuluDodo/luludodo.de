import setTitle from '../util/title.ts';
import header from '../util/header.ts';
import footer from '../util/footer.ts';
import text from '../util/font.ts';
import deco from '../util/deco.ts';
import setStyle, {type Style} from '../util/style.ts';
import {textButton} from '../util/button.ts';
import {showDialog} from '../file/helper.ts';
import {display, read} from '../file/java_bytecode.ts';

const style: Style = {
    text: '#eeffff',
    altText: '#727e8b',
    background: '#263238',
    altBackground: '#1f292e',
    link: '#808080'
}

async function load(app: HTMLElement) {
    setStyle(style)
    setTitle('Java Bytecode Editor')

    app.appendChild(await header())

    const content = document.createElement('div')
    content.classList.add('java-bytecode-editor')

    content.appendChild(deco(await text('Java Bytecode Editor'), 'title'))

    const upload_prompt = deco(await textButton('Upload File', () => showDialog(openFile)), 'quick')
    upload_prompt.id = 'upload-prompt'
    content.appendChild(upload_prompt)

    app.appendChild(content)

    const file_content = document.createElement('div')
    file_content.id = 'file-content'

    app.appendChild(file_content)

    app.appendChild(await footer())
}

async function openFile(file: File) {
    let class_file = await read(file)
    console.log(class_file)

    let data = display(class_file)
    console.log(data)

    document.getElementById('upload-prompt')!.remove()

    const info = document.createElement('div')



    const file_content = document.getElementById('file-content')!
    for (let i = file_content.childNodes.length - 1; i >= 0; i--) {
        file_content.removeChild(file_content.childNodes[i])
    }

    file_content.appendChild(info)
}

export default load;