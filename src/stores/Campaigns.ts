import type { Campaign } from '../types';
import { CampaignType } from '../types';

const getCampaign = async () => {
    const id = Math.round(Math.random() * (2 - 1) + 1);
    const res: any = await (await fetch(`campaign${id}.html`)).text();

    const newCampaign: Campaign = {
        subject: `Random campaign subject ${id}`,
        type: CampaignType.html,
        links: linkFinder(res),
        content: res
    }
    return newCampaign;
}

function createCampaignStore() {
    return {
        getCampaign: async (): Promise<Campaign | null> => {
            try {
                return await getCampaign();
            } catch (e) {
                console.log(e.message);
            }
        }
    };
}

function linkFinder(html) {
    const regex = /\/\/([0-9a-z]*\.[\.0-9a-z]*)[\/\"\']/gi;

    let match;
    const matches = [];

    while ((match = regex.exec(html)) !== null) {
        if (match.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        matches.push(match[1]);
    }

    return [...new Set(matches)];
}

export const CampaignStore = createCampaignStore();