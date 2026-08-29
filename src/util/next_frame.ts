export default async function next_frame(): Promise<void> {
    return new Promise((resolve, _) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                resolve()
            })
        })
    })
}