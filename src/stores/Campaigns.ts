import type { Campaign } from '../types';
import { CampaignType } from '../types';

const getCampaign = async () => {
    const id = Math.round(Math.random() * (2 - 1) + 1);
    const res: any = await (await fetch(`campaign${id}.html`)).text();

    const newCampaign: Campaign = {
        subject: `Random campaign subject ${id}`,
        type: CampaignType.html,
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

export const CampaignStore = createCampaignStore();