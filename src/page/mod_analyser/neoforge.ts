import type {AnalysedMod, ModAnalyser} from './mod.ts';

export function parser(info: any, neoforge: boolean) {
    const results: AnalysedMod[] = []

    try {
        if (Array.isArray(info.mods) && info.mods.length > 0) {
            for (const mod of info.mods) {
                const result: AnalysedMod = {
                    type: 'mod',
                    loader: neoforge ? 'neoforge' : 'forge',
                    links: {},
                }

                if (typeof info.issueTrackerURL === 'string') {
                    result.links!['Issues'] = info.issueTrackerURL
                }

                if (typeof mod.displayName === 'string') {
                    result.name = mod.displayName
                }

                if (typeof mod.modId === 'string') {
                    result.id = mod.modId
                }

                if (typeof mod.logoFile === 'string') {
                    result.icon = mod.logoFile
                }

                if (typeof mod.authors === 'string') {
                    result.authors = [mod.authors]
                }

                if (typeof mod.description === 'string') {
                    result.description = mod.description
                }

                if (typeof mod.displayURL === 'string') {
                    result.links!['Homepage'] = mod.displayURL
                }

                if (typeof mod.version === 'string') {
                    result.version = mod.version
                }

                results.push(result)
            }
        } else {
            results.push({
                type: 'mod',
                loader: neoforge ? 'neoforge' : 'forge',
                name: 'Empty Mod',
            })

            if (typeof info.issueTrackerURL === 'string') {
                results[0].links!['Issues'] = info.issueTrackerURL
            }
        }
    } catch (e) {
        console.error('Error while analysing ' + (neoforge ? 'NeoForge' : 'Forge') + ' Mod', e)
    }

    return results
}

export default {
    file: 'META-INF/neoforge.mods.toml',
    format: 'toml',
    parse(info: any) {
        return parser(info, true)
    }
} satisfies ModAnalyser