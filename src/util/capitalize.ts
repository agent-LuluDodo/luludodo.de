export default function capitalize(text: string) {
    const sections = text.split(' ')
    let result = ''
    let first = true
    for (const section of sections) {
        if (section.length > 0) {
            if (first) {
                first = false
            } else {
                result += ' '
            }
            result += section.substring(0, 1).toUpperCase()
            result += section.substring(1).toLowerCase()
        }
    }
    return result
}