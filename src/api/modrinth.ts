import request from '../util/request.ts';

type Project = {
    slug: string,
    title: string,
    description: string,
    categories: string[],
    client_side: string,
    server_side: string,
    body: string,
    status: string,
    requested_status?: string,
    issues_url?: string,
    source_url?: string,
    wiki_url?: string,
    discord_url?: string,
    donations_urls: {
        id: string,
        platform: string,
        url: string,
    }[],
    project_type: string,
    downloads: number,
    icon_url?: string,
    color?: string,
    thread_id: string,
    monetization_status?: string,
    id: string,
    team: string,
    moderator_message: {
        message: string,
        body?: string,
    },
    published: string,
    updated: string,
    approved: string,
    queued: string,
    followers: number,
    license: {
        id: string,
        name: string,
        url?: string,
    },
    versions: string[],
    game_versions: string[],
    loaders: string[],
    gallery: {
        url: string,
        featured: boolean,
        title?: string,
        description?: string,
        created: string,
        ordering: number,
    }[],
}

export function getProject(id: string, onsuccess: (response: Project) => unknown) {
    request('GET', `https://api.modrinth.com/v2/project/${id}`, null, onsuccess)
}