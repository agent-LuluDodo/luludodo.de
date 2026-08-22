import type {Text} from '../util/font.ts';
import from_mutf8 from '../util/mutf8.ts';

type u1 = number;
type u2 = number;
type u4 = number;

type Display = {
    info: {
        magic: Text,
        class_file: Text,
        java: Text,
    },
    constants: Constants,
    /*
    self: {
        access_flags: AccessFlags,
        this_class: ConstantPoolRef,
        super_class: ConstantPoolRef,
        interfaces: ConstantPoolRef[],
    },
    fields: {
        access_flags: AccessFlags,
        name: ConstantPoolRef,
        descriptor: ConstantPoolRef,
        attributes: Attributes,
    }[],
    methods: {
        access_flags: AccessFlags,
        name: ConstantPoolRef,
        descriptor: ConstantPoolRef,
        attributes: Attributes,
    }[],
    attributes: Attributes,
     */
}

type Constants = {
    index: number,
    preview: Text,
    data: Record<string, Text>,
}[]

type ConstantPoolRef = {
    value: Text,
    index: number,
}

type AccessFlags = {
    text: Text,
    raw: number
}

type Attributes = {

}

type ClassFile = {
    magic: u4,
    minor_version: u2,
    major_version: u2,
    constant_pool: CPInfo[],
    access_flags: u2,
    this_class: u2,
    super_class: u2,
    interfaces: u2[],
    fields: FieldInfo[],
    methods: MethodInfo[],
    attributes: AttributeInfo[],
}

type CPInfo =
    ConstantClassInfo |
    ConstantFieldrefInfo |
    ConstantMethodrefInfo |
    ConstantInterfaceMethodrefInfo |
    ConstantStringInfo |
    ConstantIntegerInfo |
    ConstantFloatInfo |
    ConstantLongInfo |
    ConstantDoubleInfo |
    ConstantNameAndTypeInfo |
    ConstantUtf8Info |
    ConstantMethodHandleInfo |
    ConstantMethodTypeInfo |
    ConstantDynamicInfo |
    ConstantInvokeDynamicInfo |
    ConstantModuleInfo |
    ConstantPackageInfo

type ConstantClassInfo = {
    tag: 7,
    name_index: u2,
}

type ConstantFieldrefInfo = {
    tag: 9,
    class_index: u2,
    name_and_type_index: u2,
}

type ConstantMethodrefInfo = {
    tag: 10,
    class_index: u2,
    name_and_type_index: u2,
}

type ConstantInterfaceMethodrefInfo = {
    tag: 11,
    class_index: u2,
    name_and_type_index: u2,
}

type ConstantStringInfo = {
    tag: 8,
    string_index: u2,
}

type ConstantIntegerInfo = {
    tag: 3,
    bytes: u4,
}

type ConstantFloatInfo = {
    tag: 4,
    bytes: u4,
}

type ConstantLongInfo = {
    tag: 5,
    high_bytes: u4,
    low_bytes: u4,
}

type ConstantDoubleInfo = {
    tag: 6,
    high_bytes: u4,
    low_bytes: u4,
}

type ConstantNameAndTypeInfo = {
    tag: 12,
    name_index: u2,
    descriptor_index: u2,
}

type ConstantUtf8Info = {
    tag: 1,
    bytes: u1[],
}

type ConstantMethodHandleInfo = {
    tag: 15,
    reference_kind: u1,
    reference_index: u2,
}

type ConstantMethodTypeInfo = {
    tag: 16,
    descriptor_index: u2,
}

type ConstantDynamicInfo = {
    tag: 17,
    bootstrap_method_attr_index: u2,
    name_and_type_index: u2,
}

type ConstantInvokeDynamicInfo = {
    tag: 18,
    bootstrap_method_attr_index: u2,
    name_and_type_index: u2,
}

type ConstantModuleInfo = {
    tag: 19,
    name_index: u2,
}

type ConstantPackageInfo = {
    tag: 20,
    name_index: u2,
}

type FieldInfo = {
    access_flags: u2,
    name_index: u2,
    descriptor_index: u2,
    attributes: AttributeInfo[],
}

type MethodInfo = {
    access_flags: u2,
    name_index: u2,
    descriptor_index: u2,
    attributes: AttributeInfo[],
}

type AttributeInfo = {
    attribute_name_index: u2,
    info: u1[]
}

class Reader {
    private readonly data: Uint8Array;
    private index: number;

    constructor(data: Uint8Array) {
        this.data = data
        this.index = 0
    }

    public u1(): u1 {
        return this.data[this.index++] >>> 0
    }

    public u2(): u2 {
        let result = this.data[this.index++] << 8
        result += this.data[this.index++]
        return result >>> 0
    }

    public u4(): u4 {
        let result = this.data[this.index++] << 24
        result += this.data[this.index++] << 16
        result += this.data[this.index++] << 8
        result += this.data[this.index++]
        return result >>> 0
    }
}

export async function read(blob: Blob): Promise<ClassFile> {
    let reader = new Reader(await blob.bytes());
    return {
        magic: reader.u4(),
        minor_version: reader.u2(),
        major_version: reader.u2(),
        constant_pool: read_constant_pool(reader),
        access_flags: reader.u2(),
        this_class: reader.u2(),
        super_class: reader.u2(),
        interfaces: read_interfaces(reader),
        fields: read_fields(reader),
        methods: read_methods(reader),
        attributes: read_attributes(reader),
    }
}

function read_constant_pool(reader: Reader): CPInfo[] {
    let length = reader.u2() - 1
    let result: CPInfo[] = new Array(length)
    for (let i = 0; i < length; i++) {
        result[i] = read_constant(reader)
    }
    return result
}

function read_constant(reader: Reader): CPInfo {
    let tag = reader.u1()
    switch (tag) {
        case 7:
            return {
                tag: 7,
                name_index: reader.u2(),
            }
        case 9:
            return {
                tag: 9,
                class_index: reader.u2(),
                name_and_type_index: reader.u2(),
            }
        case 10:
            return {
                tag: 10,
                class_index: reader.u2(),
                name_and_type_index: reader.u2(),
            }
        case 11:
            return {
                tag: 11,
                class_index: reader.u2(),
                name_and_type_index: reader.u2(),
            }
        case 8:
            return {
                tag: 8,
                string_index: reader.u2(),
            }
        case 3:
            return {
                tag: 3,
                bytes: reader.u4(),
            }
        case 4:
            return {
                tag: 4,
                bytes: reader.u4(),
            }
        case 5:
            return {
                tag: 5,
                high_bytes: reader.u4(),
                low_bytes: reader.u4(),
            }
        case 6:
            return {
                tag: 6,
                high_bytes: reader.u4(),
                low_bytes: reader.u4(),
            }
        case 12:
            return {
                tag: 12,
                name_index: reader.u2(),
                descriptor_index: reader.u2(),
            }
        case 1:
            return {
                tag: 1,
                bytes: read_bytes(reader, reader.u2())
            }
        case 15:
            return {
                tag: 15,
                reference_kind: reader.u1(),
                reference_index: reader.u2(),
            }
        case 16:
            return {
                tag: 16,
                descriptor_index: reader.u2(),
            }
        case 17:
            return {
                tag: 17,
                bootstrap_method_attr_index: reader.u2(),
                name_and_type_index: reader.u2(),
            }
        case 18:
            return {
                tag: 18,
                bootstrap_method_attr_index: reader.u2(),
                name_and_type_index: reader.u2(),
            }
        case 19:
            return {
                tag: 19,
                name_index: reader.u2(),
            }
        case 20:
            return {
                tag: 20,
                name_index: reader.u2(),
            }
        default:
            throw new Error("Unsupported constant tag: " + tag);
    }
}

function read_interfaces(reader: Reader): u2[] {
    let length = reader.u2()
    let result: u2[] = new Array(length)
    for (let i = 0; i < length; i++) {
        result[i] = reader.u2()
    }
    return result
}

function read_fields(reader: Reader): FieldInfo[] {
    let length = reader.u2()
    let result: FieldInfo[] = new Array(length)
    for (let i = 0; i < length; i++) {
        result[i] = {
            access_flags: reader.u2(),
            name_index: reader.u2(),
            descriptor_index: reader.u2(),
            attributes: read_attributes(reader),
        }
    }
    return result
}

function read_methods(reader: Reader): MethodInfo[] {
    let length = reader.u2()
    let result: MethodInfo[] = new Array(length)
    for (let i = 0; i < length; i++) {
        result[i] = {
            access_flags: reader.u2(),
            name_index: reader.u2(),
            descriptor_index: reader.u2(),
            attributes: read_attributes(reader),
        }
    }
    return result
}

function read_attributes(reader: Reader): AttributeInfo[] {
    let length = reader.u2()
    let result: AttributeInfo[] = new Array(length)
    for (let i = 0; i < length; i++) {
        result[i] = {
            attribute_name_index: reader.u2(),
            info: read_bytes(reader, reader.u4()),
        }
    }
    return result
}

function read_bytes(reader: Reader, len: number): u1[] {
    let result: u1[] = new Array(len)
    for (let i = 0; i < len; i++) {
        result[i] = reader.u1()
    }
    return result
}

class Writer {
    private readonly data: Uint8Array<ArrayBuffer>;
    private index: number;

    constructor() {
        this.data = new Uint8Array();
        this.index = 0
    }

    public u1(value: u1) {
        this.data[this.index++] = value
    }

    public u2(value: u2) {
        this.data[this.index++] = value >>> 8
        this.data[this.index++] = value & 0xFF
    }

    public u4(value: u4) {
        this.data[this.index++] = value >>> 24
        this.data[this.index++] = (value >>> 16) & 0xFF
        this.data[this.index++] = (value >>> 8) & 0xFF
        this.data[this.index++] = value & 0xFF
    }

    public get_array(): Uint8Array<ArrayBuffer> {
        return this.data
    }
}

export async function write(class_file: ClassFile): Promise<Blob> {
    let writer = new Writer()
    writer.u4(class_file.magic)
    writer.u2(class_file.minor_version)
    writer.u2(class_file.major_version)
    write_constant_pool(writer, class_file.constant_pool)
    writer.u2(class_file.access_flags)
    writer.u2(class_file.this_class)
    writer.u2(class_file.super_class)
    write_interfaces(writer, class_file.interfaces)
    write_fields(writer, class_file.fields)
    write_methods(writer, class_file.methods)
    write_attributes(writer, class_file.attributes)
    return new Blob([writer.get_array()])
}

function write_constant_pool(writer: Writer, constant_pool: CPInfo[]) {
    writer.u2(constant_pool.length + 1)
    for (let i = 0; i < constant_pool.length; i++) {
        const constant = constant_pool[i]
        writer.u1(constant.tag)
        switch (constant.tag) {
            case 7:
                writer.u2(constant.name_index)
                break
            case 9:
                writer.u2(constant.class_index)
                writer.u2(constant.name_and_type_index)
                break
            case 10:
                writer.u2(constant.class_index)
                writer.u2(constant.name_and_type_index)
                break
            case 11:
                writer.u2(constant.class_index)
                writer.u2(constant.name_and_type_index)
                break
            case 8:
                writer.u2(constant.string_index)
                break
            case 3:
                writer.u4(constant.bytes)
                break
            case 4:
                writer.u4(constant.bytes)
                break
            case 5:
                writer.u4(constant.high_bytes)
                writer.u4(constant.low_bytes)
                break
            case 6:
                writer.u4(constant.high_bytes)
                writer.u4(constant.low_bytes)
                break
            case 12:
                writer.u2(constant.name_index)
                writer.u2(constant.descriptor_index)
                break
            case 1:
                writer.u2(constant.bytes.length)
                for (let j = 0; j < constant.bytes.length; j++) {
                    writer.u1(constant.bytes[j])
                }
                break
            case 15:
                writer.u1(constant.reference_kind)
                writer.u2(constant.reference_index)
                break
            case 16:
                writer.u2(constant.descriptor_index)
                break
            case 17:
                writer.u2(constant.bootstrap_method_attr_index)
                writer.u2(constant.name_and_type_index)
                break
            case 18:
                writer.u2(constant.bootstrap_method_attr_index)
                writer.u2(constant.name_and_type_index)
                break
            case 19:
                writer.u2(constant.name_index)
                break
            case 20:
                writer.u2(constant.name_index)
                break
        }
    }
}

function write_interfaces(writer: Writer, interfaces: u2[]) {
    writer.u2(interfaces.length)
    for (let i = 0; i < interfaces.length; i++) {
        writer.u2(interfaces[i])
    }
}

function write_fields(writer: Writer, fields: FieldInfo[]) {
    writer.u2(fields.length)
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        writer.u2(field.access_flags)
        writer.u2(field.name_index)
        writer.u2(field.descriptor_index)
        write_attributes(writer, field.attributes)
    }
}

function write_methods(writer: Writer, methods: MethodInfo[]) {
    writer.u2(methods.length)
    for (let i = 0; i < methods.length; i++) {
        const method = methods[i]
        writer.u2(method.access_flags)
        writer.u2(method.name_index)
        writer.u2(method.descriptor_index)
        write_attributes(writer, method.attributes)
    }
}

function write_attributes(writer: Writer, attributes: AttributeInfo[]) {
    writer.u2(attributes.length)
    for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i]
        writer.u2(attribute.attribute_name_index)
        writer.u4(attribute.info.length)
        for (let j = 0; j < attribute.info.length; j++) {
            writer.u1(attribute.info[j])
        }
    }
}

export function display(class_file: ClassFile): Display {
    return {
        info: {
            magic: display_magic(class_file.magic),
            class_file: display_class_file(class_file.minor_version, class_file.major_version),
            java: display_java(class_file.minor_version, class_file.major_version),
        },
        constants: display_constants(class_file.constant_pool),
    }
}

function display_constants(constant_pool: CPInfo[]): Constants {
    let result: Constants = [{
        index: 0,
        preview: '<null>',
        data: {}
    }]
    for (let i = 0; i < constant_pool.length; i++) {
        result.push({
            index: i + 1,
            preview: constant_preview(constant_pool, constant_pool[i]),
            data: constant_data(constant_pool, constant_pool[i])
        })
    }
    return result
}

function constant_data(constant_pool: CPInfo[], constant: CPInfo): Record<string, Text> {
    return {}
}

function constant_preview(constant_pool: CPInfo[], constant: CPInfo): Text {
    switch (constant.tag) {
        case 7:
            // `class` Class TODO
            return get_class_preview(constant_pool, constant.name_index)
        case 9:
            // type Class.name TODO
            return get_fieldref_preview(constant_pool, constant.class_index, constant.name_and_type_index)
        case 10:
        case 11:
            // return_type Class.name(args) | <init>()V -> new Class() TODO
            return get_methodref_preview(constant_pool, constant.class_index, constant.name_and_type_index)
        case 8:
            // "value"
            return get_string(constant_pool, constant.string_index)
        case 3:
            // 1i
            return preview_integer(constant.bytes)
        case 4:
            // 1.0f
            return preview_float(constant.bytes)
        case 5:
            // 1l
            return preview_long(constant.high_bytes, constant.low_bytes)
        case 6:
            // 1.0d
            return preview_double(constant.high_bytes, constant.low_bytes)
        case 12:
            // name & type TODO
            return get_constant_name_and_type_preview(constant_pool, constant.name_index, constant.descriptor_index, (name, type) => name + ' & ' + type)
        case 1:
            // text
            return from_mutf8(constant.bytes)
        case 15:
        case 16:
        case 17:
        case 18:
            return { // TODO
                content: 'TODO',
                color: '#fce893'
            }
        case 19:
            // `module` Module
            return get_name(constant_pool, constant.name_index)
        case 20:
            // `package` Package
            return get_name(constant_pool, constant.name_index)
    }
}

function preview_integer(bytes: number): Text {
    return parse_integer(bytes).toString() + 'i'
}

function preview_float(bytes: number): Text {
    return parse_float(bytes).toString() + 'f'
}

function preview_long(high_bytes: number, low_bytes: number): Text {
    return parse_long(high_bytes, low_bytes).toString() + 'l'
}

function preview_double(high_bytes: number, low_bytes: number): Text {
    return parse_double(high_bytes, low_bytes).toString() + 'l'
}

function parse_integer(bytes: number): number {
    // JS converts numbers into signed 32-bit ints when shifting
    return bytes >> 0
}

function parse_float(bytes: number): number {
    const buf = new ArrayBuffer(4)
    let view = new DataView(buf)
    view.setUint32(0, bytes)
    return view.getFloat32(0)
}

function parse_long(high_bytes: number, low_bytes: number): number {
    // This sacrifices a few bits of precision for simpler code (JS numbers are 64-bit floats)
    return high_bytes * 4294967296 + low_bytes
}

function parse_double(high_bytes: number, low_bytes: number): number {
    const buf = new ArrayBuffer(8)
    let view = new DataView(buf)
    view.setUint32(0, high_bytes)
    view.setUint32(4, low_bytes)
    return view.getFloat64(0)
}

function get_string(constant_pool: CPInfo[], string_index: number): Text {
    return get_name(constant_pool, string_index, value => '"' + value + '"')
}

function get_fieldref_preview(constant_pool: CPInfo[], class_index: number, name_and_type_index: number): Text {
    return get_class(constant_pool, class_index, name => {
        const short_class = name.substring(name.lastIndexOf('/') + 1)
        const name_and_type = get_name_and_type_preview(constant_pool, name_and_type_index, (name, type) => type + ' ' + name)
        if (typeof name_and_type === 'string') {
            return short_class + ' { ' + name_and_type + ' }';
        } else {
            return name_and_type
        }
    })
}

function get_methodref_preview(constant_pool: CPInfo[], class_index: number, name_and_type_index: number): Text {
    return get_class(constant_pool, class_index, name => {
        const short_class = name.substring(name.lastIndexOf('/') + 1)
        const name_and_type = get_name_and_type_preview(constant_pool, name_and_type_index, (name, type) => name + type)
        if (typeof name_and_type === 'string') {
            return short_class + '.' + name_and_type;
        } else {
            return name_and_type
        }
    })
}

function get_name_and_type_preview(constant_pool: CPInfo[], index: number, onsucccess: (name: string, type: string) => string): Text {
    const value = constant_pool[index - 1]
    if (value.tag === 12) {
        return get_constant_name_and_type_preview(constant_pool, value.name_index, value.descriptor_index, onsucccess)
    } else {
        return {
            content: 'Expected NameAndType for ' + index,
            color: '#9e2927',
        }
    }
}

function get_constant_name_and_type_preview(constant_pool: CPInfo[], name_index: number, descriptor_index: number, onsucccess: (name: string, type: string) => string): Text {
    return get_name(constant_pool, name_index, name => {
        const type = get_descriptor_preview(constant_pool, descriptor_index)
        if (typeof type === 'string') {
            return onsucccess(name, type)
        } else {
            return type
        }
    })
}

function get_class(constant_pool: CPInfo[], index: number, onsuccess: (name: string) => Text = name => name): Text {
    const value = constant_pool[index - 1]
    if (value.tag === 7) {
        return get_name(constant_pool, value.name_index, onsuccess)
    } else {
        return {
            content: 'Expected Class for ' + index,
            color: '#9e2927',
        }
    }
}

function parse_descriptor(descriptor: string): Text {
    let array = 0
    while (descriptor.startsWith('[')) {
        array++
        descriptor = descriptor.substring(1)
    }

    let result: string
    if (descriptor.startsWith('L')) {
        result = parse_binary_name(descriptor.substring(1))
    } else if (descriptor.length != 1) {
        return {
            content: 'Invalid descriptor: ' + descriptor,
            color: '#9e2927',
        }
    }

    switch (descriptor.charAt(0)) {
        case 'B':
            result = 'byte'
            break
        case 'C':
            result = 'char'
            break
        case 'D':
            result = 'double'
            break
        case 'F':
            result = 'float'
            break
        case 'I':
            result = 'int'
            break
        case 'J':
            result = 'long'
            break
        case 'S':
            result = 'short'
            break
        case 'Z':
            result = 'boolean'
            break
        default:
            return {
                content: 'Invalid descriptor: ' + descriptor,
                color: '#9e2927',
            }
    }

    return result + '[]'.repeat(array)
}

function parse_binary_name(name: string): string {
    const sections = name.split('/')
    let result = ''
    for (const section of sections) {
        if (result !== '') {
            result += '.'
        }
        result += parse_unqualifed_name(section)
    }
    return result
}

function parse_unqualifed_name(name: string): string {
    if (name.length == 0) {
        return '\uFFFD'
    }

    let result = ''
    for (const char of name) {
        switch (char) {
            case '.':
            case ';':
            case '[':
            case '/':
                result += '\uFFFD'
                break
            default:
                result += char
                break
        }
    }
    return result
}

function parse_class(name: string): Text {
    if (name.startsWith('[')) {
        return parse_descriptor(name)
    } else {
        return parse_binary_name(name)
    }
}

function get_simple_class_name(name: string): string {

}

function get_descriptor_preview(constant_pool: CPInfo[], index: number): Text {
    return get_name(constant_pool, index, name => {
        const slash = name.lastIndexOf('/')
        if (slash === -1) {
            return name
        } else {
            return name.substring(0, name.lastIndexOf('[') + 1) + name.substring(slash + 1)
        }
    })
}

function get_class_preview(constant_pool: CPInfo[], name_index: number): Text {
    return get_name(constant_pool, name_index, name => {
        return 'class ' + name.substring(name.lastIndexOf('/') + 1)
    })
}

function get_name(constant_pool: CPInfo[], index: number, onsuccess: (value: string) => Text = (value) => value): Text {
    const value = constant_pool[index - 1]
    if (value.tag === 1) {
        return onsuccess(from_mutf8(value.bytes))
    } else {
        return {
            content: 'Expected UTF-8 for ' + index,
            color: '#9e2927',
        }
    }
}

function display_class_file(minor: number, major: number): Text {
    let version = major.toString()
    if (minor === 0xFFFF) {
        version += '.preview'
    } else if (major >= 45 && major <= 55) {
        version += '.' + minor.toString()
    }
    return version
}

function display_java(minor: number, major: number): Text {
    let java = major < 45 ? 'pre-1.0' : 'maybe ' + (major - 44)
    switch (major) {
        case 45:
            if (minor >= 3) {
                java = '1.1'
            } else {
                java = '1.0'
            }
            break
        case 46:
            java = '1.2'
            break
        case 47:
            java = '1.3'
            break
        case 48:
            java = '1.4'
            break
        case 49:
            java = '5.0'
            break
        case 50:
            java = '6'
            break
        case 51:
            java = '7'
            break
        case 52:
            java = '8'
            break
        case 53:
            java = '9'
            break
        case 54:
            java = '10'
            break
        case 55:
            java = '11'
            break
        case 56:
            java = '12'
            break
        case 57:
            java = '13'
            break
        case 58:
            java = '14'
            break
        case 59:
            java = '15'
            break
        case 60:
            java = '16'
            break
        case 61:
            java = '17'
            break
        case 62:
            java = '18'
            break
        case 63:
            java = '19'
            break
        case 64:
            java = '20'
            break
        case 65:
            java = '21'
            break
        case 66:
            java = '22'
            break
        case 67:
            java = '23'
            break
        case 68:
            java = '24'
            break
        case 69:
            java = '25'
            break
        case 70:
            java = '26'
            break
    }
    if (minor == 0xFFFF) {
        java += ' (+preview)'
    }
    return java
}

function display_magic(magic: u4): Text {
    if (magic === 0xCAFEBABE) {
        return "CAFEBABE"
    } else {
        return {
            content: 'Invalid magic number: ' + magic.toString(16),
            color: '#9e2927',
        }
    }
}