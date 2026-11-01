import request from '../util/request.ts';

type RealProjectResponse = {
    data: ProjectResponse[],
    pagination: {
        index: number,
        pageSize: number,
        resultCount: number,
        totalCount: number,
    }
}

type ProjectResponse = {
    id: number,
    gameId: number,
    name: string,
    slug: string,
    links: {
        websiteUrl?: string,
        wikiUrl?: string,
        issuesUrl?: string,
        sourceUrl?: string,
    },
    summary: string,
    status: number,
    downloadCount: number,
    isFeatures: boolean,
    primaryCategoryId: number,
    categories: Category[],
    classId: number,
    authors: Author[],
    logo: {
        id: number,
        modId: number,
        title: string,
        description: string,
        thumbnailUrl: string,
        url: string,
    },
    screenshots: {
        id: number,
        modId: number,
        title: string,
        description: string,
        thumbnailUrl: string,
        url: string,
    }[],
    mainFileId: number,
    latestFiles: File[],
    latestFilesIndexes: {
        gameVersion: string,
        fileId: number,
        filename: string,
        releaseType: number,
        gameVersionTypeId: number,
        modLoader: number,
    }[],
    latestEarlyAccessFilesIndexes: {
        gameVersion: string,
        fileId: number,
        filename: string,
        releaseType: number,
        gameVersionTypeId: number,
        modLoader: number,
    }[],
    dateCreated: string,
    dateModified: string,
    dateReleased: string,
    allowModDistribution: boolean,
    gamePopularityRank: number,
    isAvailable: boolean,
    thumbsUpCount: number,
    rating: number,
}

type File = {
    id: number,
    gameId: number,
    modId: number,
    isAvailable: boolean,
    displayName: string,
    fileName: string,
    releaseType: number,
    fileStatus: number,
    hashes: {
        value: string,
        algo: number,
    }[],
    fileDate: string,
    fileLength: number,
    downloadCount: number,
    fileSizeOnDisk: number,
    downloadUrl: string,
    gameVersions: string[],
    sortableGameVersions: {
        gameVersionName: string,
        gameVersionPadded: string,
        gameVersion: string,
        gameVersionReleaseDate: string,
        gameVersionTypeId: number,
    }[],
    dependencies: {
        modId: number,
        relationType: number,
    }[],
    exposeAsAlternative: boolean,
    parentProjectFileId: number,
    alternateFileId: number,
    isServerPack: boolean,
    serverPackFileId: number,
    isEarlyAccessContent: boolean,
    earlyAccessEndDate: string,
    fileFingerprint: number,
    modules: {
        name: string,
        fingerprint: number,
    }[],
}

type Category = {
    id: number,
    gameId: number,
    name: string,
    slug: string,
    url: string,
    iconUrl: string,
    dateModified: string,
    isClass: boolean,
    classId: number,
    parentCategoryId: number,
    displayIndex: number
}

type Author = {
    id: number,
    name: string,
    url: string,
}

const API_KEY = '$2a$10$bL4bIL5pUWqfcO7KQtnMReakwtfHbNKh6v1uTpKlzhwoueEJQnPnm'

export function getProject(id: string, onsuccess: (response: ProjectResponse) => unknown, onerror?: () => unknown) {
    request({
        method: 'GET',
        url: 'https://api.curseforge.com/v1/mods/search',
        query: {
            gameId: 432,
            slug: id,
        },
        headers: {
            'x-api-key': API_KEY
        },
        onsuccess: (response: RealProjectResponse) => onsuccess(response.data[0]),
        onerror,
    })
}

type RealFingerprintResponse = {
    data: {
        isCacheBuilt: boolean,
        exactMatches: FingerprintResponse[],
        // and more stuff (https://docs.curseforge.com/rest-api/#get-fingerprints-matches-by-game-id)
    }
}

type FingerprintResponse = {
    id: number,
    file: File,
    latestFiles: File[],
}

export function matchFingerprint(fingerprint: number, onsuccess: (response: FingerprintResponse) => unknown, onerror?: () => unknown) {
    request({
        method: 'POST',
        url: `https://api.curseforge.com/v1/fingerprints/432`,
        body: {
            fingerprints: [
                fingerprint
            ]
        },
        headers: {
            'x-api-key': API_KEY
        },
        relay: true,
        onsuccess: (response: RealFingerprintResponse) => {
            if (response.data.exactMatches.length >= 1) {
                onsuccess(response.data.exactMatches[0])
            }
        },
        onerror,
    })
}

type RealModResponse = {
    data: ModResponse,
}

type ModResponse = ProjectResponse

export function getMod(id: number, onsuccess: (reponse: ModResponse) => unknown, onerror?: () => unknown) {
    request({
        method: 'GET',
        url: `https://api.curseforge.com/v1/mods/${id}`,
        headers: {
            'x-api-key': API_KEY
        },
        onsuccess: (response: RealModResponse)=> onsuccess(response.data),
        onerror
    })
}