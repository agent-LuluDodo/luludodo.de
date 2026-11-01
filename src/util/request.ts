type RequestSettings = {
    method: 'GET' | 'POST',
    url: string,
    body?: object,
    query?: Record<string, string | number | boolean | undefined>,
    headers?: Record<string, string>,
    relay?: true,
    onsuccess: (response: any) => unknown,
    onerror?: () => unknown
}

export default function request(settings: RequestSettings) {
    const request = new XMLHttpRequest()
    request.onreadystatechange = e => {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                settings.onsuccess(JSON.parse(request.responseText))
            } else {
                console.error(`Request for '${settings.url}' failed: ${request.status} ${request.statusText}`)
                if (settings.onerror) settings.onerror()
            }
            e.preventDefault()
        }
    }

    let url = settings.url
    if (settings.query !== undefined) {
        let first = true
        for (const [key, value] of Object.entries(settings.query)) {
            if (value !== undefined) {
                if (first) {
                    url += '?'
                    first = false
                } else {
                    url += '&'
                }
                url += `${key}=${encodeURIComponent(value)}`
            }
        }
    }

    if (settings.relay) {
        request.open(settings.method, `https://cors-relay.luludodo.de?api=${encodeURIComponent(url)}`)
    } else {
        request.open(settings.method, url)
    }

    request.setRequestHeader('User-Agent', 'agent-LuluDodo/luludodo.de (contact@luludodo.de)')
    request.setRequestHeader('Accept', 'application/json')
    if (settings.headers !== undefined) {
        for (const [key, value] of Object.entries(settings.headers)) {
            request.setRequestHeader(key, value)
        }
    }

    if (settings.body === undefined || settings.body === null) {
        request.send(null)
    } else {
        request.setRequestHeader('Content-Type', 'application/json')
        request.send(JSON.stringify(settings.body))
    }
}