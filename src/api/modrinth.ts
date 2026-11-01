import request from '../util/request.ts';

type SearchResponse = {
    hits: SearchResult[],
    offset: number,
    limit: number,
    total_hits: number,
}

type SearchResult = {
    project_id: string,
    project_type: string,
    all_project_types: string[],
    title: string,
    description: string,
    author: string,
    categories: string[],
    display_categories: string[],
    versions: string[],
    downloads: number,
    follows: number,
    icon_url: string,
    date_created: string,
    date_modified: string,
    latest_version: string,
    license: string,
    environment: string[],
    disclosure_types: string[],
    gallery: string[],
    slug?: string,
    author_id?: string,
    organization?: string,
    organization_id?: string,
    featured_gallery?: string,
    color?: number,
    client_side: string,
    server_side: string,
}

type ProjectResponse = Project

type Project = {
    id: string,
    team: string,
    title: string,
    description: string,
    body: string,
    status: string,
    project_type: string,
    categories: string[],
    additional_categories: string[],
    environment: string[],
    game_versions: string[],
    loaders: string[],
    versions: string[],
    license: License,
    published: string,
    updated: string,
    downloads: number,
    followers: number,
    gallery: GalleryImage[],
    thread_id: string,
    monetization_status: string,
    slug?: string,
    organization?: string,
    requested_status?: string,
    approved?: string,
    queued?: string,
    icon_url?: string,
    raw_icon_url?: string,
    color?: number,
    issues_url?: string,
    source_url?: string,
    wiki_url?: string,
    discord_url?: string,
    donation_urls?: DonationUrl[],
    client_side: string,
    server_side: string,
}

type License = {
    id: string,
    name: string,
    url?: string,
}

type GalleryImage = {
    url: string,
    featured: string,
    title?: string,
    description?: string,
    created: string,
    ordering: number,
}

type DonationUrl = {
    id: string,
    platform: string,
    url: string,
}

type HashResponse = {
    name: string,
    version_number: string,
    changelog?: string,
    dependencies: Dependency[],
    game_versions: string[],
    version_type: string,
    loaders: string[],
    featured: boolean
    status: string,
    requested_status: string,
    id: string,
    project_id: string,
    author_id: string,
    date_published: string,
    downloads: number,
    changelog_url?: string,
    environment: string,
    files: File[],
}

type Dependency = {
    version_id?: string,
    project_id?: string,
    file_name?: string,
    dependency_type: string,
}

type File = {
    hashes: {
        sha256: string,
        sha1: string,
    },
    url: string,
    filename: string,
    primary: string,
    size: number,
    file_type?: string,
}

export function getProject(id: string, onsuccess: (response: ProjectResponse) => unknown, onerror?: () => unknown) {
    request({
        method: 'GET',
        url: `https://api.modrinth.com/v2/project/${encodeURI(id)}`,
        onsuccess,
        onerror,
    })
}

type SearchRequest = {
    query?: string,
    facets?: string,
    index?: SearchIndex,
    offset?: number,
    limit?: number,
}

type SearchIndex = 'relevance' | 'downloads' | 'follows' | 'newest' | 'updated'

export function searchProject(settings: SearchRequest, onsuccess: (response: SearchResponse) => unknown, onerror?: () => unknown) {
    request({
        method: 'GET',
        url: 'https://api.modrinth.com/v2/search',
        query: settings,
        onsuccess,
        onerror,
    })
}

type HashRequest = {
    hash: string,
    algorithm: string,
    multiple: boolean,
}

export function versionFromHash(settings: HashRequest, onsuccess: (response: HashResponse) => unknown, onerror?: () => unknown) {
    request({
        method: 'GET',
        url: `https://api.modrinth.com/v2/version_file/${encodeURI(settings.hash)}`,
        query: {
            algorithm: settings.algorithm,
            multiple: settings.multiple,
        },
        onsuccess,
        onerror,
    })
}