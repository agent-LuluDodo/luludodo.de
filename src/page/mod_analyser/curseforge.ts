import {getMod, matchFingerprint} from '../../api/curseforge.ts';
import hash from '../../util/hash.ts';
import type {AdditionalInfo} from './mod.ts';

export default async function findOnCurseforge(file: Blob, linkCallback: (href: string) => Promise<void>, callback: (addition: AdditionalInfo) => Promise<void>) {
    const fingerprint = await hash('curseforge', file)

    matchFingerprint(
        fingerprint,
        async fingerprintResponse => {
            getMod(
                fingerprintResponse.file.modId,
                async modResponse => {
                    await linkCallback(`https://www.curseforge.com/minecraft/mc-mods/${modResponse.slug}/files/${fingerprintResponse.file.id}`)

                    const links: Record<string, string> = {}
                    if (modResponse.links.wikiUrl) {
                        links['Wiki'] = modResponse.links.wikiUrl
                    }
                    if (modResponse.links.issuesUrl) {
                        links['Issues'] = modResponse.links.issuesUrl
                    }
                    if (modResponse.links.sourceUrl) {
                        links['Source'] = modResponse.links.sourceUrl
                    }

                    await callback({
                        name: modResponse.name,
                        icon: modResponse.logo.url,
                        downloads: fingerprintResponse.file.downloadCount,
                        links,
                        description: modResponse.summary,
                    })
                }
            )
        })
}