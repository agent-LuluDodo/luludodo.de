import type {Text} from '../util/font.ts';
import from_mutf8 from '../util/mutf8.ts';

type u1 = number;
type u2 = number;
type u4 = number;

type Display = {
    metadata: {
        magic: Text
        class_file: Text
        java: Text
    },
    constants: Constants
    info: {
        preview: Text,
        access_flags: AccessFlags
        this_class: ConstantPoolRef
        super_class: ConstantPoolRef
        interfaces: ConstantPoolRef[]
    },
    fields: Fields
    methods: Methods
    /*
    attributes: Attributes,
     */
}

type Methods = {
    preview: Text
    access_flags: AccessFlags
    name: ConstantPoolRef
    descriptor: ConstantPoolRef
    attributes: Attributes
}[]

type Fields = {
    preview: Text
    access_flags: AccessFlags
    name: ConstantPoolRef
    descriptor: ConstantPoolRef
    attributes: Attributes
}[]

type Constants = {
    index: number
    preview: Text
    internal: boolean
    data: Record<string, Text>
}[]

type ConstantPoolRef = {
    value: Text
    index: number
}

type AccessFlags = {
    text: Text
    binary: Text
}

type Attributes = {

}

type ClassFile = {
    magic: u4
    minor_version: u2
    major_version: u2
    constant_pool: CPInfo[]
    access_flags: u2
    this_class: u2
    super_class: u2
    interfaces: u2[]
    fields: FieldInfo[]
    methods: MethodInfo[]
    attributes: AttributeInfo[]
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
    tag: 7
    name_index: u2
}

type ConstantFieldrefInfo = {
    tag: 9
    class_index: u2
    name_and_type_index: u2
}

type ConstantMethodrefInfo = {
    tag: 10
    class_index: u2
    name_and_type_index: u2
}

type ConstantInterfaceMethodrefInfo = {
    tag: 11
    class_index: u2
    name_and_type_index: u2
}

type ConstantStringInfo = {
    tag: 8
    string_index: u2
}

type ConstantIntegerInfo = {
    tag: 3
    bytes: u4
}

type ConstantFloatInfo = {
    tag: 4
    bytes: u4
}

type ConstantLongInfo = {
    tag: 5
    high_bytes: u4
    low_bytes: u4
}

type ConstantDoubleInfo = {
    tag: 6
    high_bytes: u4
    low_bytes: u4
}

type ConstantNameAndTypeInfo = {
    tag: 12
    name_index: u2
    descriptor_index: u2
}

type ConstantUtf8Info = {
    tag: 1
    bytes: u1[]
}

type ConstantMethodHandleInfo = {
    tag: 15
    reference_kind: u1
    reference_index: u2
}

type ConstantMethodTypeInfo = {
    tag: 16
    descriptor_index: u2
}

type ConstantDynamicInfo = {
    tag: 17
    bootstrap_method_attr_index: u2
    name_and_type_index: u2
}

type ConstantInvokeDynamicInfo = {
    tag: 18
    bootstrap_method_attr_index: u2
    name_and_type_index: u2
}

type ConstantModuleInfo = {
    tag: 19
    name_index: u2
}

type ConstantPackageInfo = {
    tag: 20
    name_index: u2
}

type FieldInfo = {
    access_flags: u2
    name_index: u2
    descriptor_index: u2
    attributes: AttributeInfo[]
}

type MethodInfo = {
    access_flags: u2
    name_index: u2
    descriptor_index: u2
    attributes: AttributeInfo[]
}

type AttributeInfo = {
    attribute_name_index: u2
    info: u1[]
}

class Reader {
    private readonly data: Uint8Array
    private index: number

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

    public index_as_str(): string {
        return this.index.toString(16).toUpperCase()
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

function is_large_constant(constant: CPInfo): boolean {
    return constant.tag === 5 || constant.tag === 6
}

function read_constant_pool(reader: Reader): CPInfo[] {
    let length = reader.u2() - 1
    let result: CPInfo[] = new Array(length)
    for (let i = 0; i < length; i++) {
        const constant = read_constant(reader)
        result[i] = constant
        console.log(reader.index_as_str(), i, result[i])
        if (is_large_constant(constant)) i++;
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
        if (is_large_constant(constant)) i++
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
        metadata: {
            magic: display_magic(class_file.magic),
            class_file: display_class_file(class_file.minor_version, class_file.major_version),
            java: display_java(class_file.minor_version, class_file.major_version),
        },
        constants: display_constants(class_file.constant_pool),
        info: {
            preview: preview_info(class_file.constant_pool, class_file.access_flags, class_file.this_class, class_file.super_class, class_file.interfaces),
            access_flags: display_access_flags(class_file.access_flags, 'class'),
            this_class: display_class(class_file.constant_pool, class_file.this_class),
            super_class: display_class(class_file.constant_pool, class_file.super_class),
            interfaces: display_interfaces(class_file.constant_pool, class_file.interfaces)
        },
        fields: display_fields(class_file.constant_pool, class_file.fields),
        methods: display_methods(class_file.constant_pool, class_file.this_class, class_file.methods),
    }
}

function preview_info(constant_pool: CPInfo[], access_flags: number, this_class: number, super_class: number, interfaces: number[]): Text {
    const result: { content: string, color: string }[] = [
        ...get_access_flags(access_flags, 'class', false)
    ]

    const name = get_class(constant_pool, this_class, parse_class)
    if (typeof name !== 'string')
        return name

    result.push(...pretty_class(name, true))

    const super_name = get_class(constant_pool, super_class, parse_class)
    if (typeof super_name !== 'string')
        return super_name

    if (super_name !== (is_enum(access_flags) ? 'java.lang.Enum' : 'java.lang.Object')) {
        result.push({
            content: ' extends ',
            color: '#c792ea'
        })
        result.push(...pretty_class(super_name, true))
    }

    const interface_names: string[] = []
    for (const interface_class of interfaces) {
        const name = get_class(constant_pool, interface_class, parse_class)
        if (typeof name !== 'string')
            return name
        interface_names.push(name)
    }

    let first = true
    for (const interface_name of interface_names) {
        if (is_annotation(access_flags) && interface_name === 'java.lang.annotation.Annotation')
            continue
        if (first) {
            result.push({
                content: is_interface(access_flags) ? ' extends ' : ' implements ',
                color: '#c792ea'
            })
            first = false
        } else {
            result.push({
                content: ', ',
                color: '#89ddff'
            })
        }
        result.push(...pretty_class(interface_name, true))
    }

    return result
}

function display_methods(constant_pool: CPInfo[], this_index: number, methods: MethodInfo[]): Methods {
    const result: Methods = []
    for (const method of methods) {
        result.push({
            preview: preview_method(constant_pool, this_index, method),
            access_flags: display_access_flags(method.access_flags, 'method'),
            name: display_name(constant_pool, method.name_index, '#82aaff'),
            descriptor: display_descriptor(constant_pool, method.descriptor_index, true),
            attributes: []
        })
    }
    return result
}

function display_descriptor(constant_pool: CPInfo[], index: number, method: boolean = false): ConstantPoolRef {
    return {
        value: get_name(constant_pool, index, value => {
            if (method) {
                return parse_method(value, (returns, args) => {
                    return [
                        ...pretty_class(returns),
                        {
                            content: ' '
                        },
                        ...pretty_args(args)
                    ]
                })
            }
            const parsed = parse_descriptor(value)
            if (typeof parsed === 'string') {
                return pretty_class(parsed)
            } else {
                return parsed
            }
        }),
        index
    }
}

function display_fields(constant_pool: CPInfo[], fields: FieldInfo[]): Fields {
    const result: Fields = []
    for (const field of fields) {
        result.push({
            preview: preview_field(constant_pool, field),
            access_flags: display_access_flags(field.access_flags, 'field'),
            name: display_name(constant_pool, field.name_index, '#eeffe3'),
            descriptor: display_descriptor(constant_pool, field.descriptor_index),
            attributes: []
        })
    }
    return result
}

function preview_field(constant_pool: CPInfo[], field: FieldInfo): Text {
    const name = get_name(constant_pool, field.name_index)
    if (typeof name !== 'string') {
        return name
    }

    if (is_enum(field.access_flags)) {
        return [
            ...get_access_flags(field.access_flags, 'field', false),
            {
                content: name,
                color: '#eeffe3'
            }
        ]
    }

    let descriptor = get_name(constant_pool, field.descriptor_index, value => parse_descriptor(value))
    if (typeof descriptor !== 'string') {
        return descriptor
    }

    return [
        ...get_access_flags(field.access_flags, 'field', false),
        ...pretty_class(descriptor, true),
        {
            content: ' ' + name,
            color: '#eeffe3'
        }
    ]
}

function preview_method(constant_pool: CPInfo[], this_index: number, method: MethodInfo): Text {
    const vararg = is_vararg(method.access_flags)

    const name = get_name(constant_pool, method.name_index)
    if (typeof name !== 'string') {
        return name
    }

    let descriptor = get_name(constant_pool, method.descriptor_index)
    if (typeof descriptor !== 'string') {
        return descriptor
    }

    return parse_method(descriptor, (returns, args) => {
        if (name === '<clinit>' && returns === 'void' && args.length === 0) {
            return [
                ...get_access_flags(method.access_flags, 'method', false),
                {
                    content: '{}',
                    color: '#89ddff'
                }
            ]
        } else if (name === '<init>' && returns === 'void') {
            const this_name = get_class(constant_pool, this_index, parse_class)
            if (typeof this_name === 'string') {
                return [
                    ...get_access_flags(method.access_flags, 'method', false),
                    ...pretty_class(this_name, true, '#82aaff'),
                    ...pretty_args(args, true, vararg)
                ]
            } else {
                return [
                    ...get_access_flags(method.access_flags, 'method', false),
                    {
                        content: '<init>',
                        color: '#c792ea'
                    },
                    ...pretty_args(args, true, vararg)
                ]
            }
        } else {
            return [
                ...get_access_flags(method.access_flags, 'method', false),
                ...pretty_class(returns, true),
                {
                    content: ' ' + name,
                    color: '#82aaff'
                },
                ...pretty_args(args, true, vararg)
            ]
        }
    })
}

function display_name(constant_pool: CPInfo[], index: number, color: string): ConstantPoolRef {
    return {
        value: get_name(constant_pool, index, value => { return {
            content: value,
            color
        }}),
        index
    }
}

function display_interfaces(constant_pool: CPInfo[], interfaces: number[]): ConstantPoolRef[] {
    const result: ConstantPoolRef[] = []
    for (const _interface of interfaces) {
        result.push(display_class(constant_pool, _interface))
    }
    return result
}

type AccessFlagsType = 'class' | 'method' | 'field'

function display_access_flags(access_flags: number, type: AccessFlagsType): AccessFlags {
    return {
        text: get_access_flags(access_flags, type, true, false),
        binary: bytes_to_string(access_flags, 2),
    }
}

function bytes_to_string(value: number, bytes: number): Text {
    const result: { content: string, color: string }[] = []
    for (let i = 0; i < bytes * 8; i++) {
        if ((value >> i) & 0x1) {
            result.push({
                content: '1',
                color: '#8eb0c0'
            })
        } else {
            result.push({
                content: '0',
                color: '#546e7a'
            })
        }
    }
    return result.reverse()
}

function is_vararg(access_flags: number): boolean {
    return (access_flags & 0x0080) !== 0
}

function is_enum(access_flags: number): boolean {
    return (access_flags & 0x4000) !== 0
}

function is_interface(access_flags: number): boolean {
    return (access_flags & 0x0200) !== 0
}

function is_annotation(access_flags: number): boolean {
    return (access_flags & 0x2000) !== 0
}

function get_access_flags(access_flags: number, type: AccessFlagsType, trim: boolean = true, preview: boolean = true): { content: string, color: string }[] {
    let flags: { name: string, implied?: boolean | number }[] = []

    if (access_flags & 0x0001) { // field, method, class: public
        flags.push({
            name: 'public',
            implied: type === 'field' && access_flags & 0x4000
        })
    }

    if (access_flags & 0x0002 && type !== 'class') { // field, method: private
        flags.push({
            name: 'private'
        })
    }

    if (access_flags & 0x0004 && type !== 'class') { // field, method: protected
        flags.push({
            name: 'protected'
        })
    }

    if (access_flags & 0x0008 && type !== 'class') { // field, method: static
        flags.push({
            name: 'static',
            implied: type === 'field' && access_flags & 0x4000
        })
    }

    if (access_flags & 0x0800 && type === 'method') { // method: strict
        flags.push({
            name: 'strictfp'
        })
    }

    if (access_flags & 0x0010) { // field, method, class: final
        flags.push({
            name: 'final',
            implied: type !== 'method' && access_flags & 0x4000
        })
    }

    if (access_flags & 0x0020) { // method: synchronized, class: super
        if (type === 'method') {
            flags.push({
                name: 'synchronized'
            })
        } else if (type === 'class') {
            flags.push({
                name: 'super',
                implied: true
            })
        }
    }

    if (access_flags & 0x0100 && type === 'method') { // method: native
        flags.push({
            name: 'native'
        })
    }

    if (access_flags & 0x0080) { // field: transient, method: vararg
        if (type === 'field') {
            flags.push({
                name: 'transient'
            })
        } else if (type === 'method') {
            flags.push({
                name: 'vararg',
                implied: true
            })
        }
    }

    if (access_flags & 0x1000 && type === 'method') { // field, method, class: synthetic
        flags.push({
            name: 'synthetic',
            implied: access_flags & 0x0040
        })
    }

    if (access_flags & 0x0040) { // field: volatile, method: bridge
        if (type === 'field') {
            flags.push({
                name: 'volatile'
            })
        } else if (type === 'method') {
            flags.push({
                name: 'bridge'
            })
        }
    }

    if (access_flags & 0x1000 && type !== 'method') { // field, method, class: synthetic
        flags.push({
            name: 'synthetic'
        })
    }

    if (access_flags & 0x0400 && type !== 'field') { // method, class: abstract
        flags.push({
            name: 'abstract',
            implied: type === 'class' && access_flags & 0x0200
        })
    }

    if (access_flags & 0x0200 && type === 'class') {
        flags.push({
            name: 'interface',
            implied: access_flags & 0x2000
        })
    }

    if (access_flags & 0x2000 && type === 'class') {
        flags.push({
            name: '@interface'
        })
    }

    if (access_flags & 0x4000 && type !== 'method') {
        flags.push({
            name: 'enum'
        })
    }

    if (access_flags & 0x8000 && type === 'class') {
        flags.push({
            name: 'module'
        })
    } else if (type === 'class' && !(access_flags & 0x0200 || access_flags & 0x4000)) {
        flags.push({
            name: 'class'
        })
    }

    let result: { content: string, color: string }[] = []
    for (const flag of flags) {
        if (flag.implied) {
            if (!preview) {
                result.push({
                    content: flag.name + ' ',
                    color: '#939fa5'
                })
            }
        } else {
            result.push({
                content: flag.name + ' ',
                color: '#c792ea'
            })
        }
    }

    if (trim && result.length > 0) {
        const last = result.length - 1
        result[last].content = result[last].content.trimEnd()
    }

    return result
}

function display_constants(constant_pool: CPInfo[]): Constants {
    let result: Constants = [{
        index: 0,
        preview: {
            content: 'null',
            color: '#546e7a'
        },
        internal: true,
        data: {}
    }]
    for (let i = 0; i < constant_pool.length; i++) {
        const constant = constant_pool[i]
        result.push({
            index: i + 1,
            preview: constant_preview(constant_pool, constant),
            internal: constant_internal(constant),
            data: constant_data(constant_pool, constant)
        })
        if (is_large_constant(constant)) i++
    }
    return result
}

function constant_internal(constant: CPInfo): boolean {
    return constant.tag === 12 || constant.tag === 1
}

function constant_data(_constant_pool: CPInfo[], _constant: CPInfo): Record<string, Text> {
    return {}
}

function constant_preview(constant_pool: CPInfo[], constant: CPInfo): Text {
    switch (constant.tag) {
        case 7:
            // `class` Class
            return get_class_preview(constant_pool, constant.name_index)
        case 9:
            // type Class.name
            return get_fieldref_preview(constant_pool, constant.class_index, constant.name_and_type_index)
        case 10:
            // return_type Class.name(args) | <init>()V -> new Class()
            return get_methodref_preview(constant_pool, constant.class_index, constant.name_and_type_index, false)
        case 11:
            // return_type Class.name(args)
            return get_methodref_preview(constant_pool, constant.class_index, constant.name_and_type_index, true)
        case 8:
            // "value"
            return get_string(constant_pool, constant.string_index)
        case 3:
            // 1i
            return preview_integer(constant.bytes)
        case 4:
            // TODO exponential numbers (e.g. 1.04e10)
            // 1.0f
            return preview_float(constant.bytes)
        case 5:
            // 1L
            return preview_long(constant.high_bytes, constant.low_bytes)
        case 6:
            // 1.0d
            return preview_double(constant.high_bytes, constant.low_bytes)
        case 12:
            // name & type TODO
            return preview_name_and_type(constant_pool, constant.name_index, constant.descriptor_index)
        case 1:
            // text
            return preview_utf8(constant.bytes)
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

function preview_utf8(bytes: number[]): Text {
    return [{
        content: 'utf8 ',
        color: '#546e7a'
    }, {
        content: from_mutf8(bytes)
    }]
}

function preview_name_and_type(constant_pool: CPInfo[], name_index: number, descriptor_index: number): Text {
    return get_constant_name_and_type(constant_pool, name_index, descriptor_index, (name, type) => {
        return [
            {
                content: 'name ',
                color: '#546e7a'
            },
            {
                content: name
            },
            {
                content: ' type ',
                color: '#546e7a'
            },
            {
                content: type
            }
        ]
    })
}

function parse_method(descriptor: string, onsuccess: (returns: string, args: string[]) => Text): Text {
    if (!descriptor.startsWith('(')) {
        return {
            content: 'Invalid method descriptor: ' + descriptor,
            color: '#9e2927',
        }
    }

    let argEnd = descriptor.indexOf(')')

    let returns = descriptor.substring(argEnd + 1)
    if (returns === 'V') {
        returns = 'void'
    } else {
        const result = parse_descriptor(returns)
        if (typeof result === 'string') {
            returns = result
        } else {
            return result
        }
    }

    let args: string[] = []
    let argsType = descriptor.substring(1, argEnd)
    while (argsType.length > 0) {
        let result: Text
        let start = 0
        while (argsType.charAt(start) === '[') {
            start++
        }
        if (argsType.charAt(start) === 'L') {
            const end = argsType.indexOf(';', start)
            result = parse_descriptor(argsType.substring(0, end + 1))
            argsType = argsType.substring(end + 1)
        } else {
            result = parse_descriptor(argsType.substring(0, start + 1))
            argsType = argsType.substring(start + 1)
        }
        if (typeof result === 'string') {
            args.push(result)
        } else {
            return result
        }
    }

    return onsuccess(returns, args)
}

function pretty_args(args: string[], simplify?: boolean, vararg: boolean = false): { content: string, color: string }[] {
    const argsText: { content: string, color: string }[] = [{
        content: '(',
        color: '#89ddff'
    }]
    let first = true
    for (const arg of args) {
        if (first) {
            first = false
        } else {
            argsText.push({
                content: ', ',
                color: '#89ddff'
            })
        }
        argsText.push(...pretty_class(arg, simplify))
    }
    if (vararg && argsText[argsText.length - 1].content === '[]') {
        argsText[argsText.length - 1].content = '...'
    }
    argsText.push({
        content: ')',
        color: '#89ddff'
    })
    return argsText
}

function pretty_class(class_name: string, simplify: boolean = false, color: string = '#ffcb6b'): { content: string, color: string }[] {
    const result: { content: string, color: string }[] = []

    let array = 0
    while (class_name.endsWith('[]')) {
        array++
        class_name = class_name.substring(0, class_name.length - 2)
    }

    switch (class_name) {
        case 'void':
        case 'boolean':
        case 'byte':
        case 'short':
        case 'int':
        case 'float':
        case 'long':
        case 'double':
        case 'char':
            result.push({
                content: class_name,
                color: '#c792ea'
            })
            break
        default:
            if (simplify) {
                result.push({
                    content: class_name.substring(class_name.lastIndexOf('.') + 1),
                    color: color
                })
            } else {
                let first = true
                for (const part of class_name.split('.')) {
                    if (first) {
                        first = false
                    } else {
                        result.push({
                            content: '.',
                            color: '#89ddff'
                        })
                    }
                    result.push({
                        content: part,
                        color: color
                    })
                }
            }
            break
    }

    while (array > 0) {
        array--
        result.push({
            content: '[]',
            color: '#89ddff'
        })
    }

    return result
}

function preview_integer(bytes: number): Text {
    return {
        content: parse_integer(bytes).toString() + 'i',
        color: '#f78c6c'
    }
}

function preview_float(bytes: number): Text {
    return {
        content: float_to_string(parse_float(bytes), false) + 'f',
        color: '#f78c6c'
    }
}

function preview_long(high_bytes: number, low_bytes: number): Text {
    return {
        content: parse_long(high_bytes, low_bytes).toString() + 'L',
        color: '#f78c6c'
    }
}

function preview_double(high_bytes: number, low_bytes: number): Text {
    return {
        content: float_to_string(parse_double(high_bytes, low_bytes), true) + 'd',
        color: '#f78c6c'
    }
}

function float_to_string(value: number, double: boolean) {
    let result = value.toPrecision(double ? 15 : 7)
    while (result.endsWith('0')) {
        result = result.substring(0, result.length - 1)
    }
    if (result.endsWith('.')) {
        result = result.substring(0, result.length - 1)
    }
    return result
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
    return get_name(constant_pool, string_index, value => { return {
        content: '"' + value + '"',
        color: '#c3e88d'
    }})
}

function get_fieldref_preview(constant_pool: CPInfo[], class_index: number, name_and_type_index: number): Text {
    return get_class(constant_pool, class_index, name => {
        const class_name = parse_class(name)
        if (typeof class_name !== 'string')
            return class_name

        return get_name_and_type(constant_pool, name_and_type_index, (name, type) => {
            const result = parse_descriptor(type)
            if (typeof result === 'string') {
                return [
                    ...pretty_class(result, true),
                    {
                        content: ' ',
                    },
                    ...pretty_class(class_name, true),
                    {
                        content: '.',
                        color: '#89ddff'
                    },
                    {
                        content: name,
                        color: '#eeffe3'
                    }
                ]
            } else {
                return result
            }
        })
    })
}

function get_methodref_preview(constant_pool: CPInfo[], class_index: number, name_and_type_index: number, is_interface: boolean): Text {
    return get_class(constant_pool, class_index, name => {
        const class_name = parse_class(name)
        if (typeof class_name !== 'string')
            return class_name

        return get_name_and_type(constant_pool, name_and_type_index, (name, type) => {
            return parse_method(type, (returns, args) => {
                if (name === '<init>' && returns === 'void') {
                    return [
                        {
                            content: 'new ',
                            color: '#c792ea'
                        },
                        ...pretty_class(class_name, true, '#82aaff'),
                        ...pretty_args(args, true)
                    ]
                } else {
                    return [
                        ...pretty_class(returns),
                        {
                            content: ' ',
                        },
                        ...pretty_class(class_name, true, is_interface ? '#c3e88d' : undefined),
                        {
                            content: '.',
                            color: '#89ddff'
                        },
                        {
                            content: name,
                            color: '#82aaff'
                        },
                        ...pretty_args(args, true)
                    ]
                }
            })
        })
    })
}

function get_name_and_type(constant_pool: CPInfo[], index: number, onsucccess: (name: string, type: string) => Text): Text {
    const value = constant_pool[index - 1]
    if (value.tag === 12) {
        return get_constant_name_and_type(constant_pool, value.name_index, value.descriptor_index, onsucccess)
    } else {
        return {
            content: 'Expected NameAndType for ' + index,
            color: '#9e2927',
        }
    }
}

function get_constant_name_and_type(constant_pool: CPInfo[], name_index: number, descriptor_index: number, onsucccess: (name: string, type: string) => Text): Text {
    return get_name(constant_pool, name_index, name => {
        const type = get_name(constant_pool, descriptor_index)
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
    if (descriptor.startsWith('L') && descriptor.endsWith(';')) {
        result = parse_binary_name(descriptor.substring(1, descriptor.length - 1))
    } else if (descriptor.length != 1) {
        return {
            content: 'Invalid descriptor: ' + descriptor,
            color: '#9e2927',
        }
    } else {
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

function get_class_preview(constant_pool: CPInfo[], name_index: number): Text {
    return get_name(constant_pool, name_index, name => {
        const result = parse_class(name)
        if (typeof result === 'string') {
            return pretty_class(result)
        } else {
            return result
        }
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

function display_class(constant_pool: CPInfo[], index: number): ConstantPoolRef {
    return {
        value: preview_this(constant_pool, index),
        index
    }
}

function preview_this(constant_pool: CPInfo[], index: number): Text {
    return get_class(constant_pool, index, name => {
        const result = parse_class(name)
        if (typeof result === 'string') {
            return pretty_class(result)
        } else {
            return result
        }
    })
}

function display_class_file(minor: number, major: number): Text {
    const result: { content: string, color: string }[] = []
    result.push({
        content: major.toString(),
        color: '#f78c6c'
    })
    if (minor === 0xFFFF) {
        result.push({
            content: '.',
            color: '#546e7a'
        })
        result.push({
            content: 'preview',
            color: '#c792ea'
        })
    } else if (major >= 45 && major <= 55) {
        result.push({
            content: '.',
            color: '#546e7a'
        })
        result.push({
            content: minor.toString(),
            color: '#f78c6c'
        })
    }
    return result
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
    return {
        content: java,
        color: '#c3e88d'
    }
}

function display_magic(magic: u4): Text {
    return {
        content: magic.toString(16).toUpperCase(),
        color: magic === 0xCAFEBABE ? '#c792ea' : '#9e2927',
    }
}