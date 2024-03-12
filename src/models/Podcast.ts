import { Document } from "mongoose";
import MongoDbHelper from "../helpers/mongoHelper";

export interface IPodcast {
	Created?: string;
	UserID: string;
	Title: string;
	Description: string;
	IsVisible?: boolean;
	PosterName: string;
}
export class Podcast implements IPodcast {
	Created?: string = "";
	UserID: string = "";
	Title: string = "";
	Description: string = "";
	IsVisible: boolean = false;
	PosterName: string = "";

	constructor(data?: Podcast | string) {
		if (data) {
			if (typeof data !== "object") data = JSON.parse(data);
			Object.assign(this, data);
		} else {
		}
	}
}

export const PodcastSchema = MongoDbHelper.generateSchemaFromInterface(new Podcast());

export interface PodcastDoc extends IPodcast, Document {}
