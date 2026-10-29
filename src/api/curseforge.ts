import request from '../util/request.ts';

type Response = {
    data: Project[],
    pagination: {
        index: number,
        pageSize: number,
        resultCount: number,
        totalCount: number,
    }
}

type Project = {
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
    latestFiles: {
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
            algo: number
        }[],
        fileData: string,
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
        },
        dependencies: {
            modId: number,
            relationType: number,
        },
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
    }[],
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

export function getProject(id: string, onsuccess: (response: Project) => unknown) {
    request('GET', `https://api.curseforge.com/v1/mods/search?gameId=432&slug=${id}`, null, {
        'x-api-key': '$2a$10$bL4bIL5pUWqfcO7KQtnMReakwtfHbNKh6v1uTpKlzhwoueEJQnPnm'
    }, (response: Response) => onsuccess(response.data[0]))
}