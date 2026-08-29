import setTitle from '../util/title.ts';
import header from '../util/header.ts';
import footer from '../util/footer.ts';
import text, {FONT_BIG, FONT_NORMAL, FONT_SMALL} from '../util/font.ts';
import deco from '../util/deco.ts';
import setStyle, {type Style} from '../util/style.ts';
import {textButton} from '../util/button.ts';
import {showDialog} from '../file/helper.ts';
import {display, read} from '../file/java_bytecode.ts';
import next_frame from '../util/next_frame.ts';
import {wip_disclaimer} from './wip.ts';
import markdown from '../util/markdown.ts';

const style: Style = {
    text: '#eeffff',
    altText: '#546e7a',
    background: '#263238',
    altBackground: '#1f292e',
    link: '#808080'
}

async function load(app: HTMLElement) {
    setStyle(style)
    setTitle('Java Bytecode Viewer')

    app.appendChild(await header())

    const content = document.createElement('div')
    content.classList.add('java-bytecode-viewer')

    content.appendChild(deco(await text('Java Bytecode Viewer'), 'title'))

    content.appendChild(await wip_disclaimer())

    const upload_prompt = deco(await textButton('Upload File', () => showDialog(openFile)), 'quick')
    upload_prompt.id = 'upload-prompt'
    content.appendChild(upload_prompt)

    const file_content = document.createElement('div')
    file_content.id = 'file-content'

    content.appendChild(file_content)

    const creditsWrapper = document.createElement('div')
    creditsWrapper.classList.add('credits')
    const credits = await markdown('java-bytecode-viewer', 'credits')
    credits.classList.add('corner-8')
    creditsWrapper.appendChild(credits)
    content.appendChild(creditsWrapper)

    app.appendChild(content)

    app.appendChild(await footer())
}

async function openFile(file: File) {
    const upload_prompt = document.getElementById('upload-prompt')!

    const file_content = document.getElementById('file-content')!
    for (let i = file_content.childNodes.length - 1; i >= 0; i--) {
        file_content.removeChild(file_content.childNodes[i])
    }

    const parsing = document.createElement('div')
    parsing.id = 'parsing'
    parsing.classList.add('corner-1')
    parsing.appendChild(await text('Reading...'))
    await next_frame()

    upload_prompt.hidden = true
    file_content.appendChild(parsing)

    let class_file = await read(file)
    console.log(class_file)

    parsing.removeChild(parsing.children[0])
    parsing.appendChild(await text('Parsing...'))
    await next_frame()

    let data = display(class_file)
    console.log(data)

    parsing.removeChild(parsing.children[0])
    parsing.appendChild(await text('Rendering...'))
    await next_frame()

    //document.getElementById('upload-prompt')!.remove()

    const metadata = document.createElement('table')
    metadata.classList.add('metadata')

    const metadataTitle = document.createElement('div')
    metadataTitle.classList.add('sub-title')
    metadataTitle.appendChild(deco(await text(file.name, FONT_BIG), 'sub_title', false, style.text))
    metadata.appendChild(metadataTitle)

    const magic = document.createElement('tr')
    const magicName = document.createElement('td')
    magicName.appendChild(await text({
        content: 'Magic Bytes',
        color: '#546e7a'
    }))
    magic.appendChild(magicName)
    const magicBytes = document.createElement('td')
    magicBytes.appendChild(await text(data.metadata.magic, FONT_NORMAL, true))
    magic.appendChild(magicBytes)
    metadata.appendChild(magic)

    const java = document.createElement('tr')
    java.classList.add('metadata-row')
    const javaName = document.createElement('td')
    javaName.appendChild(await text({
        content: 'Java SE',
        color: '#546e7a'
    }))
    java.appendChild(javaName)
    const javaBytes = document.createElement('td')
    javaBytes.appendChild(await text(data.metadata.java))
    java.appendChild(javaBytes)
    metadata.appendChild(java)

    const classFile = document.createElement('tr')
    classFile.classList.add('metadata-row')
    const classFileName = document.createElement('td')
    classFileName.appendChild(await text({
        content: 'Class File',
        color: '#546e7a'
    }))
    classFile.appendChild(classFileName)
    const classFileBytes = document.createElement('td')
    classFileBytes.appendChild(await text(data.metadata.class_file))
    classFile.appendChild(classFileBytes)
    metadata.appendChild(classFile)

    const constants = document.createElement('table')
    constants.classList.add('constants')

    const constantsTitle = document.createElement('div')
    constantsTitle.classList.add('sub-title')
    constantsTitle.appendChild(deco(await text('Constant Pool', FONT_BIG), 'sub_title', false, style.text))
    constants.appendChild(constantsTitle)

    const constantsHeader = document.createElement('tr')
    constantsHeader.classList.add('constant')
    const constantsIndex = document.createElement('th')
    constantsIndex.classList.add('index')
    constantsIndex.appendChild(await text('Index'))
    constantsHeader.appendChild(constantsIndex)
    const constantsInfo = document.createElement('th')
    constantsInfo.appendChild(await text('Constant'))
    constantsHeader.appendChild(constantsInfo)
    constants.appendChild(constantsHeader)

    for (const constantData of data.constants) {
        const constant = document.createElement('tr')
        constant.classList.add('constant', 'collapsed')
        if (constantData.internal) constant.classList.add('internal')
        const index = document.createElement('td')
        index.classList.add('index')
        index.appendChild(await text({
            content: constantData.index.toString(),
            color: '#546e7a'
        }, FONT_SMALL, true))
        constant.appendChild(index)
        const preview = document.createElement('td')
        preview.classList.add('preview')
        preview.appendChild(await text(constantData.preview, FONT_NORMAL, true))
        constant.appendChild(preview)
        constants.appendChild(constant)
    }

    const clazz = document.createElement('table')
    clazz.classList.add('class')

    const classTitle = document.createElement('div')
    classTitle.classList.add('sub-title')
    classTitle.appendChild(deco(await text('This', FONT_BIG), 'sub_title', false, style.text))
    clazz.appendChild(classTitle)

    const classPreview = document.createElement('div')
    classPreview.classList.add('preview')
    classPreview.appendChild(await text(data.info.preview, FONT_NORMAL, true))
    clazz.appendChild(classPreview)

    const accessFlags = document.createElement('tr')
    const accessFlagsName = document.createElement('td')
    accessFlagsName.appendChild(await text({
        content: 'Access Flags',
        color: '#546e7a'
    }))
    accessFlags.appendChild(accessFlagsName)
    const accessFlagsText = document.createElement('td')
    accessFlagsText.classList.add('access-flags')
    accessFlagsText.appendChild(await text(data.info.access_flags.text, FONT_NORMAL, true))
    accessFlagsText.appendChild(await text(data.info.access_flags.binary, FONT_NORMAL, true))
    accessFlags.appendChild(accessFlagsText)
    clazz.appendChild(accessFlags)

    const thisClass = document.createElement('tr')
    const thisClassName = document.createElement('td')
    thisClassName.appendChild(await text({
        content: 'Class',
        color: '#546e7a'
    }))
    thisClass.appendChild(thisClassName)
    const thisClassText = document.createElement('td')
    thisClassText.appendChild(await text(data.info.this_class.value, FONT_NORMAL, true))
    thisClassText.appendChild(await text({
        content: '#' + data.info.this_class.index,
        color: '#546e7a'
    }, FONT_SMALL, true))
    thisClass.appendChild(thisClassText)
    clazz.appendChild(thisClass)

    const superClass = document.createElement('tr')
    const superClassName = document.createElement('td')
    superClassName.appendChild(await text({
        content: 'Extends',
        color: '#546e7a'
    }))
    superClass.appendChild(superClassName)
    const superClassText = document.createElement('td')
    superClassText.appendChild(await text(data.info.super_class.value, FONT_NORMAL, true))
    superClassText.appendChild(await text({
        content: '#' + data.info.super_class.index,
        color: '#546e7a'
    }, FONT_SMALL, true))
    superClass.appendChild(superClassText)
    clazz.appendChild(superClass)

    const interfaces = document.createElement('tr')
    const interfacesName = document.createElement('td')
    interfacesName.appendChild(await text({
        content: 'Implements',
        color: '#546e7a'
    }))
    interfaces.appendChild(interfacesName)
    const interfacesText = document.createElement('td')
    if (data.info.interfaces.length === 0) {
        interfacesText.appendChild(await text({
            content: '-',
            color: '#546e7a'
        }))
    } else {
        for (const interfaceData of data.info.interfaces) {
            const _interface = document.createElement('div')
            _interface.appendChild(await text(interfaceData.value, FONT_NORMAL, true))
            _interface.appendChild(await text({
                content: '#' + interfaceData.index,
                color: '#546e7a'
            }, FONT_SMALL, true))
            interfacesText.appendChild(_interface)
        }
    }
    interfaces.appendChild(interfacesText)
    clazz.appendChild(interfaces)

    const fields = document.createElement('table')
    fields.classList.add('fields')

    const fieldsTitle = document.createElement('div')
    fieldsTitle.classList.add('sub-title')
    fieldsTitle.appendChild(deco(await text('Fields', FONT_BIG), 'sub_title', false, style.text))
    fields.appendChild(fieldsTitle)

    if (data.fields.length === 0) {
        const empty = document.createElement('div')
        empty.classList.add('empty')
        empty.appendChild(await text({
            content: '-',
            color: '#546e7a'
        }))
        fields.appendChild(empty)
    }
    for (const fieldData of data.fields) {
        const row = document.createElement('tr')
        const field = document.createElement('td')
        field.appendChild(await text(fieldData.preview, FONT_NORMAL, true))
        row.appendChild(field)
        fields.appendChild(row)
    }

    const methods = document.createElement('table')
    methods.classList.add('methods')

    const methodsTitle = document.createElement('div')
    methodsTitle.classList.add('sub-title')
    methodsTitle.appendChild(deco(await text('Methods', FONT_BIG), 'sub_title', false, style.text))
    methods.appendChild(methodsTitle)

    if (data.methods.length === 0) {
        const empty = document.createElement('div')
        empty.classList.add('empty')
        empty.appendChild(await text({
            content: '-',
            color: '#546e7a'
        }))
        methods.appendChild(empty)
    }
    for (const methodData of data.methods) {
        const row = document.createElement('tr')
        const method = document.createElement('td')
        method.appendChild(await text(methodData.preview, FONT_NORMAL, true))
        row.appendChild(method)
        methods.appendChild(row)
    }

    parsing.remove()
    upload_prompt.hidden = false
    file_content.appendChild(deco(metadata , 'subtle'))
    file_content.appendChild(deco(constants, 'subtle'))
    file_content.appendChild(deco(clazz    , 'subtle'))
    file_content.appendChild(deco(fields   , 'subtle'))
    file_content.appendChild(deco(methods  , 'subtle'))
}

export default load;