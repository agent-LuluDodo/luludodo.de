import type {AnalysedMod, ModAnalyser} from './mod.ts';

export default {
    file: 'mcmod.info',
    format: 'json',
    parse(info: any) {
        let results: AnalysedMod[] = [];

        try {

            if (Array.isArray(info) && info.length > 0) {
                for (const mod of info) {
                    const result: AnalysedMod = {
                        type: 'mod',
                        loader: 'forge',
                    }

                    if (typeof mod.name === 'string') {
                        result.name = mod.name
                    }

                    if (typeof mod.modid === 'string') {
                        result.id = mod.modid
                    }

                    if (typeof mod.logoFile === 'string') {
                        result.icon = mod.logoFile
                    }

                    if (Array.isArray(mod.authorList)) {
                        result.authors = []
                        for (const author of mod.authorList) {
                            if (typeof author === 'string') {
                                result.authors.push(author)
                            }
                        }
                    } else if (Array.isArray(mod.authors)) {
                        result.authors = []
                        for (const author of mod.authors) {
                            if (typeof author === 'string') {
                                result.authors.push(author)
                            }
                        }
                    }

                    if (typeof mod.description === 'string') {
                        result.description = mod.description
                    }

                    if (typeof mod.url === 'string') {
                        result.links = {
                            'Homepage': mod.url
                        }
                    }

                    if (typeof mod.version === 'string') {
                        result.version = mod.version
                    }

                    results.push(result)
                }

            } else {
                results.push({
                    type: 'mod',
                    loader: 'forge',
                    name: 'Empty Mod',
                })
            }

        } catch (e) {
            console.error('Error white analysing old Forge Mod', e)
        }

        return results
    }
} satisfies ModAnalyser