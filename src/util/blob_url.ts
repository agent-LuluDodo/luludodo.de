let map: Record<string, string> = {}

let multiMap: Record<string, string[]> = {}

export function resetUrls() {
    for (const url of Object.values(map)) {
        URL.revokeObjectURL(url)
    }
    for (const urls of Object.values(multiMap)) {
        for (const url of urls) {
            URL.revokeObjectURL(url)
        }
    }
    map = {}
    multiMap = {}
}

export function addBlobUrl(id: string, blob: Blob | null | undefined, fallback: string): string
export function addBlobUrl(id: string, blob: Blob): string
export function addBlobUrl(id: string, blob: Blob | null | undefined, fallback?: string): string {
    if (blob === null || blob === undefined) {
        return fallback!
    }

    const url = URL.createObjectURL(blob)
    if (multiMap.hasOwnProperty(id)) {
        multiMap[id].push(url)
    } else {
        multiMap[id] = [url]
    }
    return url
}

export function clearBlobUrl(id: string) {
    if (multiMap.hasOwnProperty(id)) {
        for (const url of multiMap[id]) {
            URL.revokeObjectURL(url)
        }
        delete multiMap[id]
    }
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