import type {ModInfo} from "./mod.ts";

export default function placeholderInfo(name: string, description: string): ModInfo {
    return {
        element: document.createElement('div'),
        name,
        id: 'unknown',
        icon: '/icon/mod-not-supported.png',
        authors: [],
        contributors: [],
        description,
        links: {},
        details: {},
        version: 'unknown',
    }
}