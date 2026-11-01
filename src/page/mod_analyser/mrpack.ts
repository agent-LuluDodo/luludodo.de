import type {AnalysedMod, ModAnalyser} from './mod.ts';

// TODO: return mods from modpack
//       fetch author from modrinth and display

export default {
    file: 'modrinth.index.json',
    format: 'json',
    parse(info: any): AnalysedMod[] {
        let result: AnalysedMod = {
            type: 'modpack',
            format: 'mrpack',
        }

        try {
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

        } catch (e) {
            console.error('Error while analysing Fabric Mod', e)
        }

        return [result]
    }
} satisfies ModAnalyser