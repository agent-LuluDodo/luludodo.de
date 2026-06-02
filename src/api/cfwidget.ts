type File = {
    id: number,
    url: string,
    display: string,
    name: string,
    type: string,
    version: string,
    filesize: number,
    versions: string[],
    downloads: number,
    uploaded_at: string,
}

type Project = {
    id: number,
    title: string,
    summary: string,
    description: string,
    game: string,
    type: string,
    urls: {
        curseforge: string,
        project: string,
    },
    thumbnail: string,
    created_at: string,
    downloads: {
        //monthly: number, always 0
        total: number,
    },
    //license: '', always empty string
    //donate: '', always empty string
    categories: string[],
    members: {
        title: string,
        username: string,
        id: number,
    }[],
    //links: [], always empty array
    files: File[],
    versions: Record<string, File[]>,
    download: File,
}

export function getProject(id: string, onsuccess: (response: Project) => unknown) {
    request('GET', `minecraft/mc-mods/${id}`, null, onsuccess)
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
    request.open(method, 'https://api.cfwidget.com/' + url)
    request.send(JSON.stringify(body))
}