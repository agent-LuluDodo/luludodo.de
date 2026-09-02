import type {Text} from '../util/font.ts';
import from_mutf8 from '../util/mutf8.ts';

const colors = {
    keyword: '#c792ea',
    operator: '#89ddff',
    number: '#f78c6c',
    string: '#c3e88d',
    _class: '#ffcb6b',
    _interface: '#c3e88d',
    method: '#82aaff',
    field: '#eeffe3',
    error: '#ff5370',
    unused: '#939fa5',
    note: '#546e7a',
    highlight: '#8eb0c0',
    todo: '#fce893'
}

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
    attributes: ClassFileAttributes
}

type Methods = {
    preview: Text
    access_flags: AccessFlags
    name: ConstantPoolRef
    descriptor: ConstantPoolRef
    attributes: MethodAttributes
}[]

type Fields = {
    preview: Text
    access_flags: AccessFlags
    name: ConstantPoolRef
    descriptor: ConstantPoolRef
    attributes: FieldAttributes
}[]

type Constants = {
    index: number
    preview: Text
    internal: boolean
    data: Data
}[]

type Data = Record<string, [Text[]] | [Text[], string]>

type ConstantPoolRef = {
    value: Text
    index: number
}

type AccessFlags = {
    text: Text
    binary: Text
}

type ClassFileAttributes = {
    source_file?: SourceFileAttribute
    inner_classes?: InnerClassesAttribute
    enclosing_method?: EnclosingMethodAttribute
    source_debug_extension?: SourceDebugExtensionAttribute
    bootstrap_methods?: BootstrapMethodsAttribute
    module?: ModuleAttribute
    module_packages?: ModulePackagesAttribute
    module_main_class?: ModuleMainClassAttribute
    nest_host?: NestHostAttribute
    nest_member?: NestMembersAttribute
    record?: RecordAttribute
    permitted_subclasses?: PermittedSubclassesAttribute
    synthetic?: SyntheticAttribute
    deprecated?: DeprecatedAttribute
    signature?: SignatureAttribute
    runtime_visible_annotations?: RuntimeVisibleAnnotationsAttribute
    runtime_invisible_annotations?: RuntimeInvisibleAnnotationsAttribute
    runtime_visible_type_annotations?: RuntimeVisibleTypeAnnotationsAttribute
    runtime_invisible_type_annotations?: RuntimeInvisibleTypeAnnotationsAttribute
    unknown: UnknownAttribute[]
}

type MethodAttributes = {
    code?: CodeAttribute
    exceptions?: ExceptionsAttribute
    runtime_visible_parameter_annotations?: RuntimeVisibleParameterAnnotationsAttribute
    runtime_invisible_parameter_annotations?: RuntimeInvisibleParameterAnnotationsAttribute
    annotations_default?: AnnotationDefaultAttribute
    method_parameters?: MethodParametersAttribute
    synthetic?: SyntheticAttribute
    deprecated?: DeprecatedAttribute
    signature?: SignatureAttribute
    runtime_visible_annotations?: RuntimeVisibleAnnotationsAttribute
    runtime_invisible_annotations?: RuntimeInvisibleAnnotationsAttribute
    runtime_visible_type_annotations?: RuntimeVisibleTypeAnnotationsAttribute
    runtime_invisible_type_annotations?: RuntimeInvisibleTypeAnnotationsAttribute
    unknown: UnknownAttribute[]
}

type FieldAttributes = {
    constant_value?: ConstantValueAttribute
    synthetic?: SyntheticAttribute
    deprecated?: DeprecatedAttribute
    signature?: SignatureAttribute
    runtime_visible_annotations?: RuntimeVisibleAnnotationsAttribute
    runtime_invisible_annotations?: RuntimeInvisibleAnnotationsAttribute
    runtime_visible_type_annotations?: RuntimeVisibleTypeAnnotationsAttribute
    runtime_invisible_type_annotations?: RuntimeInvisibleTypeAnnotationsAttribute
    unknown: UnknownAttribute[]
}

type Attributes = {
    unknown: UnknownAttribute[]
}

type UnknownAttribute = {
    name: Text
    bytes: number[]
}

type ConstantValueAttribute = {
    name: 'ConstantValue'
    value: ConstantPoolRef
}

type CodeAttribute = {
    name: 'Code'
    max_stack: Text
    max_locals: Text
    code: Text[]
    exception_table: {
        start_pc: Text
        end_pc: Text
        handler_pc: Text
        catch_type: ConstantPoolRef
    }
    attributes: Attributes
}

// @ts-ignore
type StackMapTableAttribute = {
    name: 'StackMapTable'
}

type ExceptionsAttribute = {
    name: 'Exceptions'
}

type InnerClassesAttribute = {
    name: 'InnerClasses'
    classes: InnerClass[]
}

type InnerClass = {
    inner_class_info: ConstantPoolRef
    outer_class_info: ConstantPoolRef
    inner_name: ConstantPoolRef
    inner_class_access_flags: AccessFlags
}

type EnclosingMethodAttribute = {
    name: 'EnclosingMethod'
    preview: Text
    class: ConstantPoolRef
    method_name: ConstantPoolRef
    args: {
        value: Text[],
        index: number
    }
    returns: ConstantPoolRef
}

type SyntheticAttribute = {
    name: 'Synthetic'
}

type SignatureAttribute = {
    name: 'Signature'
}

type SourceFileAttribute = {
    name: 'SourceFile',
    source_file: ConstantPoolRef
}

type SourceDebugExtensionAttribute = {
    name: 'SourceDebugExtension'
}

// @ts-ignore
type LineNumberTableAttribute = {
    name: 'LineNumberTable'
}

// @ts-ignore
type LocalVariableTableAttribute = {
    name: 'LocalVariableTable'
}

// @ts-ignore
type LocalVariableTypeTableAttribute = {
    name: 'LocalVariableTypeTable'
}

type DeprecatedAttribute = {
    name: 'Deprecated'
}

type RuntimeVisibleAnnotationsAttribute = {
    name: 'RuntimeVisibleAnnotations'
}

type RuntimeInvisibleAnnotationsAttribute = {
    name: 'RuntimeInvisibleAnnotations'
}

type RuntimeVisibleParameterAnnotationsAttribute = {
    name: 'RuntimeVisibleParameterAnnotations'
}

type RuntimeInvisibleParameterAnnotationsAttribute = {
    name: 'RuntimeInvisibleParameterAnnotations'
}

type RuntimeVisibleTypeAnnotationsAttribute = {
    name: 'RuntimeVisibleTypeAnnotations'
}

type RuntimeInvisibleTypeAnnotationsAttribute = {
    name: 'RuntimeInvisibleTypeAnnotations'
}

type AnnotationDefaultAttribute = {
    name: 'AnnotationDefault'
}

type BootstrapMethodsAttribute = {
    name: 'BootstrapMethods'
}

type MethodParametersAttribute = {
    name: 'MethodParameters'
}

type ModuleAttribute = {
    name: 'Module'
}

type ModulePackagesAttribute = {
    name: 'ModulePackages'
}

type ModuleMainClassAttribute = {
    name: 'ModuleMainClass'
}

type NestHostAttribute = {
    name: 'NestHost'
}

type NestMembersAttribute = {
    name: 'NestMembers'
}

type RecordAttribute = {
    name: 'Record'
}

type PermittedSubclassesAttribute = {
    name: 'PermittedSubclasses'
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
            super_class: display_class(class_file.constant_pool, class_file.super_class, true),
            interfaces: display_interfaces(class_file.constant_pool, class_file.interfaces)
        },
        fields: display_fields(class_file.constant_pool, class_file.fields),
        methods: display_methods(class_file.constant_pool, class_file.this_class, class_file.methods),
        attributes: display_class_file_attributes(class_file.constant_pool, class_file.attributes)
    }
}

function display_unknown_attributes(constant_pool: CPInfo[], attributes: AttributeInfo[]): { unknown: UnknownAttribute[] } {
    const result: { unknown: UnknownAttribute[] } = {
        unknown: []
    }
    for (const attribute of attributes) {
        result.unknown.push({
            name: get_name(constant_pool, attribute.attribute_name_index),
            bytes: attribute.info
        })
    }
    return result
}

function display_class_file_attributes(constant_pool: CPInfo[], attributes: AttributeInfo[]): ClassFileAttributes {
    const result: ClassFileAttributes = {
        unknown: []
    }
    for (const attribute of attributes) {
        const name = get_name(constant_pool, attribute.attribute_name_index)
        if (typeof name === 'string') {
            const view = new DataView(new Uint8Array(attribute.info).buffer)
            switch (name) {
                case 'SourceFile':
                    result.source_file = display_source_file(constant_pool, view)
                    break
                case 'InnerClasses':
                    result.inner_classes = display_inner_classes(constant_pool, view)
                    break
                case 'EnclosingMethod':
                    result.enclosing_method = display_enclosing_method(constant_pool, view)
                    break
                default:
                    result.unknown.push({
                        name,
                        bytes: attribute.info
                    })
                    break
            }
        } else {
            result.unknown.push({
                name,
                bytes: attribute.info
            })
        }
    }
    return result
}

function display_enclosing_method(constant_pool: CPInfo[], view: DataView): EnclosingMethodAttribute {
    const class_index = view.getUint16(0)
    const method_index = view.getUint16(2)
    return {
        name: 'EnclosingMethod',
        preview: preview_enclosing_method(constant_pool, class_index, method_index),
        class: {
            value: get_class(constant_pool, class_index, name => {
                const parsed = parse_class(name)
                if (typeof parsed === 'string') {
                    return pretty_class(parsed)
                } else {
                    return parsed
                }
            }),
            index: class_index
        },
        method_name: {
            value: get_name_and_type(constant_pool, method_index, (name, _) => {
                return {
                    content: name,
                    color: colors.method
                }
            }),
            index: method_index
        },
        args: {
            value: get_method_arguments(constant_pool, method_index),
            index: method_index
        },
        returns: {
            value: get_name_and_type(constant_pool, method_index, (_, type) =>
                parse_method(type, (returns, _) => pretty_class(returns))),
            index: method_index
        }
    }
}

function preview_enclosing_method(constant_pool: CPInfo[], class_index: number, method_index: number): Text {
    const clazz = get_class(constant_pool, class_index, parse_class)
    if (typeof clazz !== 'string')
        return clazz

    return get_name_and_type(constant_pool, method_index, (name, type) => {
        return parse_method(type, (returns, args) => {
            return [
                ...pretty_class(returns, true),
                {
                    content: ' '
                },
                ...pretty_class(clazz, true),
                {
                    content: '.',
                    color: colors.operator
                },
                {
                    content: name,
                    color: colors.method
                },
                ...pretty_args(args, true)
            ]
        })
    })
}

function display_inner_classes(constant_pool: CPInfo[], view: DataView): InnerClassesAttribute {
    const classes: InnerClass[] = new Array(view.getUint16(0))
    for (let i = 0; i < classes.length; i++) {
        classes[i] = display_inner_class(
            constant_pool,
            view.getUint16(2 + i * 8),
            view.getUint16(4 + i * 8),
            view.getUint16(6 + i * 8),
            view.getUint16(8 + i * 8),
        )
    }
    return {
        name: 'InnerClasses',
        classes
    }
}

function display_inner_class(constant_pool: CPInfo[], inner_class_info_index: number, outer_class_info_index: number, inner_name_index: number, inner_class_access_flags: number): InnerClass {
    return {
        inner_class_info: display_class(constant_pool, inner_class_info_index),
        outer_class_info: display_class(constant_pool, outer_class_info_index, true),
        inner_name: {
            value: inner_name_index === 0 ? {
                content: '-',
                color: colors.note
            } : get_name(constant_pool, inner_name_index, name => { return {
                content: name,
                color: colors._class
            }}),
            index: inner_name_index
        },
        inner_class_access_flags: display_access_flags(inner_class_access_flags, 'inner_class')
    }
}

function display_source_file(constant_pool: CPInfo[], view: DataView): SourceFileAttribute {
    const index = view.getUint16(0)
    return {
        name: 'SourceFile',
        source_file: {
            value: get_name(constant_pool, index),
            index
        }
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
            color: colors.keyword
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
                color: colors.keyword
            })
            first = false
        } else {
            result.push({
                content: ', ',
                color: colors.operator
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
            name: display_name(constant_pool, method.name_index, colors.method),
            descriptor: display_descriptor(constant_pool, method.descriptor_index, true),
            attributes: display_unknown_attributes(constant_pool, method.attributes)
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
            name: display_name(constant_pool, field.name_index, colors.field),
            descriptor: display_descriptor(constant_pool, field.descriptor_index),
            attributes: display_unknown_attributes(constant_pool, field.attributes)
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
                color: colors.field
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
            color: colors.field
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
                    color: colors.operator
                }
            ]
        } else if (name === '<init>' && returns === 'void') {
            const this_name = get_class(constant_pool, this_index, parse_class)
            if (typeof this_name === 'string') {
                return [
                    ...get_access_flags(method.access_flags, 'method', false),
                    ...pretty_class(this_name, true, colors.method),
                    ...pretty_args(args, true, vararg)
                ]
            } else {
                return [
                    ...get_access_flags(method.access_flags, 'method', false),
                    {
                        content: '<init>',
                        color: colors.keyword
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
                    color: colors.method
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

type AccessFlagsType = 'class' | 'method' | 'field' | 'inner_class'

function display_access_flags(access_flags: number, type: AccessFlagsType): AccessFlags {
    return {
        text: get_access_flags(access_flags, type, true, false),
        binary: bytes_to_text(access_flags, 2),
    }
}

function bytes_to_text(value: number, bytes: number): Text {
    const result: { content: string, color: string }[] = []
    for (let i = 0; i < bytes * 8; i++) {
        if ((value >> i) & 0x1) {
            result.push({
                content: '1',
                color: colors.highlight
            })
        } else {
            result.push({
                content: '0',
                color: colors.note
            })
        }
    }
    return result.reverse()
}

function hex_to_string(...u32s: number[]): string {
    let result = ''
    for (const u32 of u32s) {
        const str = '00000000' + u32.toString(16).toUpperCase()
        result += str.substring(str.length - 8)
    }
    return result
}

function bytes_to_string(bytes: number[]): string {
    let result = ''
    for (const byte of bytes) {
        const str = '00' + byte.toString(16).toUpperCase()
        result += str.substring(str.length - 2)
    }
    return result
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

    if (access_flags & 0x0001) { // field, method, class, inner_class: public
        flags.push({
            name: 'public',
            implied: type === 'field' && access_flags & 0x4000
        })
    }

    if (access_flags & 0x0002 && type !== 'class') { // field, method, inner_class: private
        flags.push({
            name: 'private'
        })
    }

    if (access_flags & 0x0004 && type !== 'class') { // field, method, inner_class: protected
        flags.push({
            name: 'protected'
        })
    }

    if (access_flags & 0x0008 && type !== 'class') { // field, method, inner_class: static
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

    if (access_flags & 0x0010) { // field, method, class, inner_class: final
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

    if (access_flags & 0x1000 && type === 'method') { // field, method, class, inner_class: synthetic
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

    if (access_flags & 0x1000 && type !== 'method') { // field, method, class, inner_class: synthetic
        flags.push({
            name: 'synthetic'
        })
    }

    if (access_flags & 0x0400 && type !== 'field') { // method, class, inner_class: abstract
        flags.push({
            name: 'abstract',
            implied: type === 'class' && access_flags & 0x0200
        })
    }

    if (access_flags & 0x0200 && (type === 'class' || type === 'inner_class')) {
        flags.push({
            name: 'interface',
            implied: access_flags & 0x2000
        })
    }

    if (access_flags & 0x2000 && (type === 'class' || type === 'inner_class')) {
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
    } else if ((type === 'class' || type === 'inner_class') && !(access_flags & 0x0200 || access_flags & 0x4000)) {
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
                    color: colors.unused
                })
            }
        } else {
            result.push({
                content: flag.name + ' ',
                color: colors.keyword
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
            color: colors.note
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

function constant_data(constant_pool: CPInfo[], constant: CPInfo): Data {
    switch (constant.tag) {
        case 7:
            return get_class_data(constant_pool, constant.name_index)
        case 9:
            return get_field_ref_data(constant_pool, constant.class_index, constant.name_and_type_index)
        case 10:
            return get_method_ref_data(constant_pool, constant.class_index, constant.name_and_type_index, false)
        case 11:
            return get_method_ref_data(constant_pool, constant.class_index, constant.name_and_type_index, true)
        case 8:
            return get_string_data(constant_pool, constant.string_index)
        case 3:
            return get_integer_data(constant.bytes)
        case 4:
            return get_float_data(constant.bytes)
        case 5:
            return get_long_data(constant.high_bytes, constant.low_bytes)
        case 6:
            return get_double_data(constant.high_bytes, constant.low_bytes)
        case 12:
            return get_name_and_type_data(constant_pool, constant.name_index, constant.descriptor_index)
        case 1:
            // text
            return get_utf8_data(constant.bytes)
        case 15:
            return get_method_handle_data(constant_pool, constant.reference_kind, constant.reference_index)
        case 16:
            return get_method_type_data(constant_pool, constant.descriptor_index)
        case 17:
            return get_dynamic_data(constant_pool, constant.bootstrap_method_attr_index, constant.name_and_type_index)
        case 18:
            return get_invoke_dynamic_data(constant_pool, constant.bootstrap_method_attr_index, constant.name_and_type_index)
        case 19: // module
        case 20: // package
            return {} // TODO
        default:
            return {}
    }
}

function get_dynamic_data(constant_pool: CPInfo[], bootstrap_method_attr_index: number, name_and_type_index: number): Data {
    return {
        'Tag': [[{
            content: 'Dynamic'
        }], '17'],
        'Bootstrap Method': [[{
            content: '#' + bootstrap_method_attr_index.toString(),
        }]],
        'Name': [[get_name_and_type(constant_pool, name_and_type_index, (name, _) => { return {
            content: name,
            color: colors.field
        }})], '#' + name_and_type_index],
        'Type': [[get_name_and_type(constant_pool, name_and_type_index, (_, type) => {
            const parsed = parse_descriptor(type)
            if (typeof parsed === 'string') {
                return pretty_class(parsed)
            } else {
                return parsed
            }
        })], '#' + name_and_type_index]
    }
}

function get_invoke_dynamic_data(constant_pool: CPInfo[], bootstrap_method_attr_index: number, name_and_type_index: number): Data {
    return {
        'Tag': [[{
            content: 'Invoke Dynamic'
        }], '18'],
        'Bootstrap Method': [[{
            content: '#' + bootstrap_method_attr_index.toString(),
        }]],
        'Name': [[get_name_and_type(constant_pool, name_and_type_index, (name, _) => { return {
            content: name,
            color: colors.method
        }})], '#' + name_and_type_index],
        'Arguments': [get_method_arguments(constant_pool, name_and_type_index), '#' + name_and_type_index],
        'Returns': [[get_name_and_type(constant_pool, name_and_type_index, (_, type) => {
            return parse_method(type, (returns, _) => {
                return pretty_class(returns)
            })
        })], '#' + name_and_type_index]
    }
}

function get_method_type_data(constant_pool: CPInfo[], descriptor_index: number): Data {
    return {
        'Tag': [[{
            content: 'Method Type'
        }], '16'],
        'Arguments': [get_method_arguments(constant_pool, descriptor_index, true), '#' + descriptor_index],
        'Returns': [[get_name(constant_pool, descriptor_index, (type) => {
            return parse_method(type, (returns, _) => {
                return pretty_class(returns)
            })
        })], '#' + descriptor_index]
    }
}

function get_method_handle_data(constant_pool: CPInfo[], reference_kind: number, reference_index: number): Data {
    return {
        'Tag': [[{
            content: 'Method Handle'
        }], '15'],
        'Kind': [[get_method_handle_kind(reference_kind)], reference_kind.toString()],
        'Target': [[constant_preview(constant_pool, constant_pool[reference_index - 1])], '#' + reference_index]
    }
}

function get_utf8_data(bytes: number[]): Data {
    return {
        'Tag': [[{
            content: 'UTF8'
        }], '1'],
        'Value': [[from_mutf8(bytes)], bytes_to_string(bytes)]
    }
}

function get_name_and_type_data(constant_pool: CPInfo[], name_index: number, descriptor_index: number): Data {
    return {
        'Tag': [[{
            content: 'Name & Type',
        }], '12'],
        'Name': [[get_name(constant_pool, name_index)], '#' + name_index],
        'Type': [[get_name(constant_pool, descriptor_index)], '#' + descriptor_index]
    }
}

function get_integer_data(bytes: number): Data {
    return {
        'Tag': [[{
            content: 'Integer'
        }], '3'],
        'Value': [[preview_integer(bytes, '')], hex_to_string(bytes)]
    }
}

function get_float_data(bytes: number): Data {
    return {
        'Tag': [[{
            content: 'Float'
        }], '4'],
        'Value': [[preview_float(bytes, '')], hex_to_string(bytes)]
    }
}

function get_long_data(high_bytes: number, low_bytes: number): Data {
    return {
        'Tag': [[{
            content: 'Long'
        }], '5'],
        'Value': [[preview_long(high_bytes, low_bytes, '')], hex_to_string(high_bytes, low_bytes)]
    }
}

function get_double_data(high_bytes: number, low_bytes: number): Data {
    return {
        'Tag': [[{
            content: 'Double'
        }], '6'],
        'Value': [[preview_double(high_bytes, low_bytes, '')], hex_to_string(high_bytes, low_bytes)]
    }
}

function get_string_data(constant_pool: CPInfo[], string_index: number): Data {
    return {
        'Tag': [[{
            content: 'String'
        }], '8'],
        'Value': [[get_string(constant_pool, string_index, '')], '#' + string_index]
    }
}

function get_field_ref_data(constant_pool: CPInfo[], class_index: number, name_and_type_index: number): Data {
    return {
        'Tag': [[{
            content: 'Field Reference'
        }], '9'],
        'Class': [[get_class(constant_pool, class_index, name => {
            const parsed = parse_class(name)
            if (typeof parsed === 'string') {
                return pretty_class(parsed)
            } else {
                return parsed
            }
        })], '#' + class_index],
        'Name': [[get_name_and_type(constant_pool, name_and_type_index, (name, _) => { return {
            content: name,
            color: colors.field
        }})], '#' + name_and_type_index],
        'Type': [[get_name_and_type(constant_pool, name_and_type_index, (_, type) => {
            const parsed = parse_descriptor(type)
            if (typeof parsed === 'string') {
                return pretty_class(parsed)
            } else {
                return parsed
            }
        })], '#' + name_and_type_index]
    }
}

function get_method_ref_data(constant_pool: CPInfo[], class_index: number, name_and_type_index: number, is_interface: boolean): Data {
    return {
        'Tag': [[{
            content: is_interface ? 'Interface Method Reference' : 'Method Reference'
        }], is_interface ? '11' : '10'],
        'Class': [[get_class(constant_pool, class_index, name => {
            const parsed = parse_class(name)
            if (typeof parsed === 'string') {
                return pretty_class(parsed, false, is_interface ? colors._interface : undefined)
            } else {
                return parsed
            }
        })], '#' + class_index],
        'Name': [[get_name_and_type(constant_pool, name_and_type_index, (name, _) => { return {
            content: name,
            color: colors.method
        }})], '#' + name_and_type_index],
        'Arguments': [get_method_arguments(constant_pool, name_and_type_index), '#' + name_and_type_index],
        'Returns': [[get_name_and_type(constant_pool, name_and_type_index, (_, type) => {
            return parse_method(type, (returns, _) => {
                return pretty_class(returns)
            })
        })], '#' + name_and_type_index]
    }
}

function get_method_arguments(constant_pool: CPInfo[], index: number, is_descriptor: boolean = false): Text[] {
    let result: Text[] = []
    function get_args(type: string) {
        return parse_method(type, (_, args) => {
            let index = 0
            let length = args.length.toString().length
            for (const arg of args) {
                result.push([
                    {
                        content: (++index).toString().padStart(length, ' ') + ' ',
                        color: colors.note
                    },
                    ...pretty_class(arg)
                ])
            }
            if (args.length === 0) {
                result.push({
                    content: '-',
                    color: colors.note
                })
            }
            return ''
        })
    }
    const error = is_descriptor ?
        get_name(constant_pool, index, (type) => get_args(type)) :
        get_name_and_type(constant_pool, index, (_, type) => get_args(type))
    if (error === '') {
        return result
    } else {
        return [error]
    }
}

function get_class_data(constant_pool: CPInfo[], name_index: number): Data {
    return {
        'Tag': [[{
            content: 'Class',
        }], '7'],
        'Value': [[get_name(constant_pool, name_index, name => {
            const parsed = parse_class(name)
            if (typeof parsed === 'string') {
                return pretty_class(parsed)
            } else {
                return parsed
            }
        })], '#' + name_index]
    }
}

function constant_preview(constant_pool: CPInfo[], constant: CPInfo): Text {
    switch (constant.tag) {
        case 7:
            // Class
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
            return preview_method_handle(constant_pool, constant.reference_kind, constant.reference_index)
        case 16:
            return preview_method_type(constant_pool, constant.descriptor_index)
        case 17:
            return preview_dynamic(constant_pool, constant.name_and_type_index)
        case 18:
            return preview_invoke_dynamic(constant_pool, constant.name_and_type_index)
        case 19:
            // `module` Module
            return get_name(constant_pool, constant.name_index)
        case 20:
            // `package` Package
            return get_name(constant_pool, constant.name_index)
    }
}

function preview_dynamic(constant_pool: CPInfo[], name_and_type_index: number): Text {
    return get_name_and_type(constant_pool, name_and_type_index, (name, type) => {
        const type_name = parse_descriptor(type)
        if (typeof type_name !== 'string')
            return type_name

        return [
            {
                content: 'dynamic ',
                color: colors.note
            },
            ...pretty_class(type_name, true),
            {
                content: ' ' + name,
                color: colors.field
            }
        ]
    })
}

function preview_invoke_dynamic(constant_pool: CPInfo[], name_and_type_index: number): Text {
    return get_name_and_type(constant_pool, name_and_type_index, (name, type) => {
        return parse_method(type, (returns, args) => {
            return [
                {
                    content: 'dynamic ',
                    color: colors.note
                },
                ...pretty_class(returns, true),
                {
                    content: ' ' + name,
                    color: colors.method
                },
                ...pretty_args(args, true)
            ]
        })
    })
}

function preview_method_type(constant_pool: CPInfo[], descriptor_index: number): Text {
    return get_name(constant_pool, descriptor_index, (type) => {
        return parse_method(type, (returns, args) => {
            return [
                ...pretty_args(args, true),
                {
                    content: ' -> ',
                    color: colors.operator
                },
                ...pretty_class(returns, true)
            ]
        })
    })
}

function preview_method_handle(constant_pool: CPInfo[], reference_kind: number, reference_index: number) {
    let kind = get_method_handle_kind(reference_kind)
    if (typeof kind !== 'string') {
        return kind
    }

    let reference = constant_pool[reference_index - 1]
    if (reference !== undefined) {
        let result: Text | null = null
        if (reference.tag == 9) {
            result = get_fieldref_preview(constant_pool, reference.class_index, reference.name_and_type_index)
        } else if (reference.tag == 10) {
            result = get_methodref_preview(constant_pool, reference.class_index, reference.name_and_type_index, false)
        } else if (reference.tag == 11) {
            result = get_methodref_preview(constant_pool, reference.class_index, reference.name_and_type_index, true)
        }
        if (Array.isArray(result)) {
            return [
                {
                    content: kind + ' ',
                    color: colors.note
                },
                ...result
            ]
        } else if (result !== null) {
            return result
        }
    }

    return {
        content: 'Expected method/field reference (9-11), got ' + reference?.tag + " " + reference_index,
        color: colors.error
    }
}

function get_method_handle_kind(reference_kind: number, onsuccess: (kind: string) => Text = kind => kind): Text {
    switch (reference_kind) {
        case 1:
            return onsuccess('getField')
        case 2:
            return onsuccess('getStatic')
        case 3:
            return onsuccess('putField')
        case 4:
            return onsuccess('putStatic')
        case 5:
            return onsuccess('invokeVirtual')
        case 6:
            return onsuccess('invokeStatic')
        case 7:
            return onsuccess('invokeSpecial')
        case 8:
            return onsuccess('newInvokeSpecial')
        case 9:
            return onsuccess('invokeInterface')
        default:
            return {
                content: 'Invalid reference kind: ' + reference_kind,
                color: colors.error
            }
    }
}

function preview_utf8(bytes: number[]): Text {
    return [{
        content: 'utf8 ',
        color: colors.note
    }, {
        content: from_mutf8(bytes)
    }]
}

function preview_name_and_type(constant_pool: CPInfo[], name_index: number, descriptor_index: number): Text {
    return get_constant_name_and_type(constant_pool, name_index, descriptor_index, (name, type) => {
        return [
            {
                content: 'name ',
                color: colors.note
            },
            {
                content: name
            },
            {
                content: ' type ',
                color: colors.note
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
            color: colors.error,
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
        color: colors.operator
    }]
    let first = true
    for (const arg of args) {
        if (first) {
            first = false
        } else {
            argsText.push({
                content: ', ',
                color: colors.operator
            })
        }
        argsText.push(...pretty_class(arg, simplify))
    }
    if (vararg && argsText[argsText.length - 1].content === '[]') {
        argsText[argsText.length - 1].content = '...'
    }
    argsText.push({
        content: ')',
        color: colors.operator
    })
    return argsText
}

function pretty_class(class_name: string, simplify: boolean = false, color: string = colors._class): { content: string, color: string }[] {
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
                color: colors.keyword
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
                            color: colors.operator
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
            color: colors.operator
        })
    }

    return result
}

function preview_integer(bytes: number, suffix: string = 'i'): Text {
    return {
        content: parse_integer(bytes).toString() + suffix,
        color: colors.number
    }
}

function preview_float(bytes: number, suffix: string = 'f'): Text {
    return {
        content: float_to_string(parse_float(bytes), false) + suffix,
        color: colors.number
    }
}

function preview_long(high_bytes: number, low_bytes: number, suffix: string = 'L'): Text {
    return {
        content: parse_long(high_bytes, low_bytes).toString() + suffix,
        color: colors.number
    }
}

function preview_double(high_bytes: number, low_bytes: number, suffix: string = 'd'): Text {
    return {
        content: float_to_string(parse_double(high_bytes, low_bytes), true) + suffix,
        color: colors.number
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

function get_string(constant_pool: CPInfo[], string_index: number, encase: string = '"'): Text {
    return get_name(constant_pool, string_index, value => { return {
        content: encase + value + encase,
        color: colors.string
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
                        color: colors.operator
                    },
                    {
                        content: name,
                        color: colors.field
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
                            color: colors.keyword
                        },
                        ...pretty_class(class_name, true, colors.method),
                        ...pretty_args(args, true)
                    ]
                } else {
                    return [
                        ...pretty_class(returns, true),
                        {
                            content: ' ',
                        },
                        ...pretty_class(class_name, true, is_interface ? colors._interface : undefined),
                        {
                            content: '.',
                            color: colors.operator
                        },
                        {
                            content: name,
                            color: colors.method
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
    if (value !== undefined && value.tag === 12) {
        return get_constant_name_and_type(constant_pool, value.name_index, value.descriptor_index, onsucccess)
    } else {
        return {
            content: 'Expected NameAndType (12), got ' + value?.tag,
            color: colors.error,
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
    if (value !== undefined && value.tag === 7) {
        return get_name(constant_pool, value.name_index, onsuccess)
    } else {
        return {
            content: 'Expected Class (7), got ' + value?.tag,
            color: colors.error,
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
            color: colors.error,
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
                    color: colors.error,
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
    if (value !== undefined && value.tag === 1) {
        return onsuccess(from_mutf8(value.bytes))
    } else {
        return {
            content: 'Expected UTF-8 (1), got ' + value?.tag,
            color: colors.error,
        }
    }
}

function display_class(constant_pool: CPInfo[], index: number, optional: boolean = false): ConstantPoolRef {
    return {
        value: (optional && index === 0) ? {
            content: '-',
            color: colors.note
        } : preview_this(constant_pool, index),
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
        color: colors.number
    })
    if (minor === 0xFFFF) {
        result.push({
            content: '.preview',
            color: colors.number
        })
    } else if (major >= 45 && major <= 55) {
        result.push({
            content: '.' + minor.toString(),
            color: colors.number
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
        color: colors.string
    }
}

function display_magic(magic: u4): Text {
    return {
        content: magic.toString(16).toUpperCase(),
        color: magic === 0xCAFEBABE ? colors.keyword : colors.error,
    }
}