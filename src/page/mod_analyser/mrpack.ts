import type {AnalysedMod, ModAnalyser} from './mod.ts';

const whitelist = ['github.com', 'raw.githubusercontent.com', 'gitlab.com']

export default {
    file: 'modrinth.index.json',
    format: 'json',
    parse(info: any): AnalysedMod[] {
        let result: AnalysedMod = {
            type: 'modpack',
            format: 'mrpack',
        }
        let mods: AnalysedMod[] = []

        try {
            if (typeof info.formatVersion !== 'number' || info.formatVersion !== 1) {
                console.warn('Unsupported .mrpack version:', info.formatVersion)
            }

            if (typeof info.name === 'string') {
                result.name = info.name
            }

            result.id = ''

            if (typeof info.summary === 'string') {
                result.description = info.summary
            }

            if (typeof info.versionId === 'string') {
                result.version = info.versionId
            }

            if (Array.isArray(info.files)) {
                for (const file of info.files) {
                    const result: AnalysedMod = {
                        type: 'mod',
                        links: {}
                    }

                    if (typeof file.hashes.sha512 === 'string') {
                        result.sha512 = file.hashes.sha512
                    }

                    if (Array.isArray(file.downloads)) {
                        let link: string | undefined = undefined
                        for (const download of file.downloads) {
                            const url = new URL(download)
                            if (url.protocol !== 'https:') {
                                continue;
                            }
                            if (url.host === 'cdn.modrinth.com') {
                                link = download
                                break;
                            }
                            if (link === undefined && whitelist.includes(url.host)) {
                                link = download
                            }
                        }

                        if (link !== undefined) {
                            result.links!['Download'] = link
                        }
                    }

                    mods.push(result)
                }
            }

            result.mods = mods.length

        } catch (e) {
            console.error('Error while analysing Fabric Mod', e)
        }

        return [result, ...mods]
    }
} satisfies ModAnalyser