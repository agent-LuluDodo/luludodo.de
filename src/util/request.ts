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
    request.open(method, url)
    request.send(JSON.stringify(body))
}