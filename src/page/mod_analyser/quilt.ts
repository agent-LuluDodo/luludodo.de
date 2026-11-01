import type {AnalysedMod, ModAnalyser} from './mod.ts';
import satan from './satan.ts';

export default {
    file: 'quilt.mod.json',
    format: 'json',
    parse(info: any): AnalysedMod[] {
        let result: AnalysedMod = {
            type: 'mod',
            loader: 'quilt',
        }

        try {

            if (typeof info.quilt_loader.metadata.name === 'string') {
                result.name = info.quilt_loader.metadata.name
            }

            if (typeof info.quilt_loader.id === 'string') {
                result.id = info.quilt_loader.id
            }

            if (typeof info.quilt_loader.metadata.icon === 'string') {
                result.icon = info.quilt_loader.metadata.icon
            }

            if (typeof info.quilt_loader.metadata.contributors === 'object' && info.quilt_loader.metadata.contributors !== null) {
                result.authors = []
                result.contributors = []
                for (const [name, role] of Object.entries(info.quilt_loader.metadata.contributors)) {
                    if (
                        role === 'Owner' || role === 'owner' ||
                        (Array.isArray(role) && (role.includes('Owner') || role.includes('owner')))
                    ) {
                        result.authors.push(name)
                    } else {
                        result.contributors.push(name)
                    }
                }
            }

            if (typeof info.quilt_loader.metadata.description === 'string') {
                result.description = info.quilt_loader.metadata.description
            }

            if (typeof info.quilt_loader.metadata.contact === 'object' && info.quilt_loader.metadata.contact !== null) {
                result.links = {}
                for (const [key, value] of Object.entries(info.quilt_loader.metadata.contact)) {
                    result.links[satan(key)] = value as string
                }
            }

            if (typeof info.quilt_loader.version === 'string') {
                result.version = info.quilt_loader.version
            }

        } catch (e) {
            console.error('Error while analysing Quilt Mod', e)
        }

        return [result]
    }
} satisfies ModAnalyser