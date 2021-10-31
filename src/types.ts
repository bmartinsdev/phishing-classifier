export interface Result {
	opacity: Number;
	message: string;
	class: string
};
export interface Campaign {
	subject?: string,
	type: CampaignType,
	content: string
}

export enum CampaignType {
	html,
	plain
}