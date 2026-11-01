import type {ModAnalyser} from './mod.ts';
import {parser} from './neoforge.ts';

export default {
    file: 'META-INF/mods.toml',
    format: 'toml',
    parse(info: any) {
        return parser(info, false)
    }
} satisfies ModAnalyser