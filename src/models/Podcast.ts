import { Document } from "mongoose";
import MongoDbHelper from "../helpers/mongoHelper";

export interface IPodcast {
  Created?: string;
  UserID: string;
  Title: string;
  Description: string;
  IsVisible?: boolean;
}
export class Podcast implements IPodcast {
  Created: string = "";
  UserID: string = "";
  Title: string = "";
  Description: string = "";
  IsVisible: boolean = false;

  constructor(data?: Podcast | string) {
    if (data) {
      if (typeof data !== "object") data = JSON.parse(data);
      Object.assign(this, data);
    } else {
    }
  }

  forList() {
    const { ...objFiltered } = this;
    return objFiltered;
  }
  processMediaSources() {
    // some code
  }
}

export const PodcastSchema = MongoDbHelper.generateSchemaFromInterface(
  new Podcast()
);

export interface PodcastDoc extends IPodcast, Document {}
