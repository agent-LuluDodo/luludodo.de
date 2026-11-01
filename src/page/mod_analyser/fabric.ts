import type {AnalysedMod, ModAnalyser} from './mod.ts';
import satan from './satan.ts';

export default {
    file: 'fabric.mod.json',
    format: 'json',
    parse(info: any): AnalysedMod[] {
        let result: AnalysedMod = {
            type: 'mod',
            loader: 'fabric',
        }

        try {
            if (typeof info.name === 'string') {
                result.name = info.name
            }

            if (typeof info.id === 'string') {
                result.id = info.id
            }

            if (typeof info.icon === 'string') {
                result.icon = info.icon
            }

            if (Array.isArray(info.authors)) {
                result.authors = []
                for (const author of info.authors) {
                    if (typeof author === 'string') {
                        result.authors.push(author)
                    } else if (typeof author.name === 'string') {
                        result.authors.push(author.name)
                    }
                }
            }

            if (Array.isArray(info.contributors)) {
                result.contributors = []
                for (const contributor of info.contributors) {
                    if (typeof contributor === 'string') {
                        result.contributors.push(contributor)
                    } else if (typeof contributor.name === 'string') {
                        result.contributors.push(contributor.name)
                    }
                }
            }

            if (typeof info.description === 'string') {
                result.description = info.description
            }

            if (info.contact && typeof info.contact === 'object') {
                result.links = {}
                for (const [key, value] of Object.entries(info.contact)) {
                    result.links[satan(key)] = value as string
                }
            }

            if (typeof info.version === 'string') {
                result.version = info.version
            }

        } catch (e) {
            console.error('Error while analysing Fabric Mod', e)
        }

        return [result]
    }
} satisfies ModAnalyser