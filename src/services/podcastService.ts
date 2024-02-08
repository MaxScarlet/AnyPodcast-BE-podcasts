import { CrudApiService } from "../controllers/crudApiController";
import { IDbHelper } from "../helpers/IDbHelper";

import { Podcast, PodcastDoc } from "../models/Podcast";
import { SearchParams } from "../models/SearchParams";

// import MongoDbHelper from '../helpers/mongoHelper';
// import { DynamoDbHelper } from '../helpers/dynamoDbHelper';

export class PodcastService implements CrudApiService<Podcast> {
	// private readonly dbHelper: MongoDbHelper<DistributorDoc> | DynamoDbHelper<Distributor>;

	constructor(private dbHelper: IDbHelper<PodcastDoc> | IDbHelper<Podcast>) {
		// this.dbHelper = new MongoDbHelper<DistributorDoc>('Distributor', DistributorSchema, tableName);
		// this.dbHelper = new DynamoDbHelper<Distributor>(tableName);
	}

	async get_all(queryString: SearchParams): Promise<Podcast[] | null> {
		// check mandatory field - PodcastID
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
