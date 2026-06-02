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
    request('GET', `v2/project/${id}`, null, onsuccess)
}

export default function request(method: 'GET', url: string, body: object | null, onsuccess: (response: any) => unknown) {
    const request = new XMLHttpRequest()
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            if (request.status === 200) {
                onsuccess(JSON.parse(request.responseText))
            } else {
                console.error(`Request for '${url}' failed: ${request.status} ${request.statusText}`)
            }
        }
    }
    request.open(method, 'https://api.modrinth.com/' + url)
    request.send(JSON.stringify(body))
}