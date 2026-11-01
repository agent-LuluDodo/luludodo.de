import {cf_fingerprint} from 'cf-fingerprint';

type Algorithm = 'sha-512' | 'curseforge'

export default async function hash(algorithm: 'sha-512', data: Blob): Promise<string>
export default async function hash(algorithm: 'curseforge', data: Blob): Promise<number>
export default async function hash(algorithm: Algorithm, data: Blob) {
    const buffer = await doHash(algorithm, await data.arrayBuffer())
    if (typeof buffer === 'number') {
        return buffer
    }

    const view = new DataView(buffer)
    let hash = ''
    for (let byte = 0; byte < view.byteLength; byte += 4) {
        const hex = '00000000' + view.getUint32(byte).toString(16)
        hash += hex.substring(hex.length - 8)
    }
    return hash
}

async function doHash(algorithm: Algorithm, data: ArrayBuffer) {
    if (algorithm === 'curseforge') {
        return cf_fingerprint(new Uint8Array(data))
    } else {
        return await crypto.subtle.digest(algorithm, data)
    }
}