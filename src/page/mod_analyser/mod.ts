export type ModType = 'mod' | 'modpack'

export type ModpackFormat = 'mrpack'

export type ModLoader = 'fabric' | 'forge' | 'neoforge' | 'mrpack' | 'quilt'

export type AnalysedMod = {
    type: ModType,
    format?: ModpackFormat,
    loader?: ModLoader,
    name?: string,
    id?: string,
    icon?: string,
    authors?: string[],
    contributors?: string[],
    description?: string,
    links?: Record<string, string>,
    version?: string,
}

export type FileFormat = 'json' | 'toml'

export type ModAnalyser = {
    file: string,
    format: FileFormat,
    parse: (info: object) => AnalysedMod[],
}

export type ModInfo = {
    element: HTMLElement,
    name: string,
    id: string,
    icon: string,
    authors: string[],
    contributors: string[],
    description: string,
    links: Record<string, string>,
    details: Record<string, string>,
    version: string,
    modrinth?: string,
    curseforge?: string,
}

export type InfoState = {
    name: boolean,
    icon: boolean,
    downloads: number
    description: boolean,
}

export type AdditionalInfo = {
    name: string,
    icon?: string,
    downloads: number,
    links: Record<string, string>,
    description: string,
}

export const typeToName: Record<ModType, string> = {
    mod: 'Mod',
    modpack: 'Modpack',
}

export const formatToName: Record<ModpackFormat, string> = {
    mrpack: 'Modrinth'
}

export const loaderToName: Record<ModLoader, string> = {
    fabric: 'Fabric',
    forge: 'Forge',
    neoforge: 'NeoForge',
    mrpack: 'Modrinth Mod Pack',
    quilt: 'Quilt'
}