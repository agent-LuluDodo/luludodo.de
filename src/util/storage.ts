import markdown from './markdown.ts';
import {textButton} from './button.ts';
import deco from './deco.ts';

let consent: boolean | null | undefined = undefined
function loadConsent(): boolean | null {
    if (consent === undefined) {
        const consent_str = localStorage.getItem('local-storage-consent')
        if (consent_str === 'true') {
            consent = true
        } else if (consent_str === 'false') {
            consent = false
        } else {
            consent = null
        }
    }

    return consent
}

function setConsent(value: boolean | null) {
    consent = value
    localStorage.setItem('local-storage-consent', JSON.stringify(value))
}

export function getConsent(): Promise<boolean> {
    return new Promise(async (resolve, _) => {
        const consent = loadConsent();

        if (consent === null) {
            await showPopup(new_consent => {
                resolve(new_consent);
            })
        } else {
            resolve(consent)
        }
    })
}

export function hasConsent(): boolean {
    return loadConsent() ?? false;
}

export async function showPopup(callback?: (consent: boolean) => void) {
    setConsent(null);

    const popup = document.getElementById('local-storage-popup')
    if (popup) return;

    const container = document.createElement('div');
    container.id = 'local-storage-popup';
    const content = document.createElement('div');
    const text = await markdown('local-storage', 'info', undefined, 40)
    content.appendChild(text)
    const buttons = document.createElement('div')
    buttons.classList.add('buttons')
    buttons.appendChild(await textButton('No', () => {
        hidePopup()
        setConsent(false)
        if (callback !== undefined) callback(false)
    }))
    buttons.appendChild(await textButton('Yes', () => {
        hidePopup()
        setConsent(true)
        if (callback !== undefined) callback(true)
    }))
    content.appendChild(buttons)
    container.appendChild(deco(content, 'popup'));

    document.body.appendChild(container)
}

export async function hidePopup() {
    const popup = document.getElementById('local-storage-popup')
    if (popup) popup.remove()
}

export function store(key: string, value: any) {
    getConsent().then(consent => {
        if (consent) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    })
}

export function load(key: string, fallback?: any): any {
    if (hasConsent()) {
        const value = localStorage.getItem(key)
        if (value === null) {
            return fallback
        } else {
            return JSON.parse(value)
        }
    } else {
        return fallback
    }
}