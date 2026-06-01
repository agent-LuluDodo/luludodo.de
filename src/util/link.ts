export default function rel(link: string, prefix?: string) {
    if (prefix === undefined) return link;

    const slash = window.location.href.lastIndexOf('/')
    const start = window.location.href.substring(0, slash)
    if (link === start) {
        return prefix
    } else if (link.startsWith(start)) {
        const suffix = link.substring(start.length + 1)
        if (prefix.endsWith('/')) {
            return prefix + suffix;
        } else {
            return prefix + '/' + suffix;
        }
    }
    return link;
}

export function getLink() {
    return window.location.protocol + '//' + window.location.host + window.location.pathname
}