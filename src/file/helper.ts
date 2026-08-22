export function showDialog(callback: (file: File) => any) {
    let input = document.createElement('input')
    input.type = 'file'
    input.multiple = false
    input.onchange = _ => {
        callback(input.files!.item(0)!)
    }
    input.click()
}