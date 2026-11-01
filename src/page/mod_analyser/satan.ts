import capitalize from '../../util/capitalize.ts';

export default function satan(name: string) {
    switch (name.toLowerCase()) {
        case 'issue':
        case 'issues':
            return 'Issues'
        case 'wiki':
            return 'Wiki'
        case 'homepage':
        case 'website':
        case 'url':
            return 'Homepage'
        case 'source':
        case 'sources':
        case 'code':
            return 'Source'
        case 'discord':
            return 'Discord'
        default:
            return capitalize(name)
    }
}