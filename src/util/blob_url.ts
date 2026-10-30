let map: Record<string, string> = {}

export function resetUrls() {
    for (const url of Object.values(map)) {
        URL.revokeObjectURL(url)
    }
    map = {}
}

export default function blobUrl(id: string, blob: Blob | null | undefined, fallback: string): string
export default function blobUrl(id: string, blob: Blob): string
export default function blobUrl(id: string, blob: Blob | null | undefined, fallback?: string): string {
    const old = map[id]
    if (old !== undefined) {
        URL.revokeObjectURL(old)
    }
    if (blob === null || blob === undefined) {
        delete map[id]
        return fallback!
    }
    const url = URL.createObjectURL(blob)
    map[id] = url
    return url
}