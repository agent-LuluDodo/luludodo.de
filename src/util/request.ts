export default function request(method: 'GET', url: string, body: object | null, headers: Record<string, string> | null, onsuccess: (response: any) => unknown) {
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
    request.open(method, url)
    request.setRequestHeader('Accept', 'application/json')
    if (headers !== null) {
        for (const [key, value] of Object.entries(headers)) {
            request.setRequestHeader(key, value)
        }
    }
    request.send(body === null ? null : JSON.stringify(body))
}