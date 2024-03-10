import { CrudApiService } from "../controllers/crudApiController";
import { IDbHelper } from "../helpers/IDbHelper";

import { Podcast, PodcastDoc } from "../models/Podcast";
import { SearchParams } from "../models/SearchParams";


export class PodcastService implements CrudApiService<Podcast> {

	constructor(private dbHelper: IDbHelper<PodcastDoc> | IDbHelper<Podcast>) {
	}

	async get_all(queryString: SearchParams): Promise<Podcast[] | null> {
		if (queryString && !queryString.UserID) {
			return null;
		}
		const fields = ["Title", "Description"];

		const items = await this.dbHelper.get_list<Podcast>(queryString, fields);
		return items;
	}

	async get(id: string): Promise<Podcast | null> {
		const item = await this.dbHelper.get<Podcast>(id);
		return item || null;
	}

	async create(item: Podcast): Promise<Podcast> {
		item.Created = new Date().toISOString();
		const response = await this.dbHelper.create<Podcast>(item);
		return response;
	}

	async update(id: string, updated: Podcast): Promise<Podcast | null> {
		const item = await this.dbHelper.update<Podcast>(id, updated);
		return item || null;
	}

	async delete(id: string): Promise<void> {
		await this.dbHelper.delete<Podcast>(id);
	}
}
