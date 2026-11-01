import type {AdditionalInfo} from './mod.ts';
import hash from '../../util/hash.ts';
import {getProject, versionFromHash} from '../../api/modrinth.ts';

export default async function findOnModrinth(file: Blob, linkCallback: (href: string) => Promise<void>, callback: (addition: AdditionalInfo) => Promise<void>) {
    const sha512 = await hash('sha-512', file)

    versionFromHash({
        hash: sha512,
        algorithm: 'sha512',
        multiple: false
    }, async versionResponse => {
        await linkCallback(`https://modrinth.com/mod/${versionResponse.project_id}/version/${versionResponse.id}`)
        getProject(versionResponse.project_id, async projectResponse => {
            const links: Record<string, string> = {}
            if (projectResponse.discord_url) {
                links['Discord'] = projectResponse.discord_url
            }
            if (projectResponse.wiki_url) {
                links['Wiki'] = projectResponse.wiki_url
            }
            if (projectResponse.issues_url) {
                links['Issues'] = projectResponse.issues_url
            }
            if (projectResponse.source_url) {
                links['Source'] = projectResponse.source_url
            }
            if (projectResponse.donation_urls) {
                for (const donation_url of projectResponse.donation_urls) {
                    links[donation_url.platform] = donation_url.url
                }
            }

            await callback({
                name: projectResponse.title,
                icon: projectResponse.raw_icon_url,
                downloads: versionResponse.downloads,
                links,
                description: projectResponse.description,
            })
        })
    })
}