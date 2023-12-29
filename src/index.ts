import { APIGatewayProxyEvent } from "aws-lambda";
import { PodcastService as Service } from "./services/podcastService";
import { CrudApiController } from "./controllers/crudApiController";
import MongoDbHelper from "./helpers/mongoHelper";
import { Podcast, PodcastDoc, PodcastSchema } from "./models/Podcast";
// import { DynamoDbHelper } from './helpers/dynamoDbHelper';

const tableName = process.env.DB_TABLE!;

const dbHelper = new MongoDbHelper<PodcastDoc>(
  "Podcast",
  PodcastSchema,
  tableName
);
// const dbHelper = new DynamoDbHelper<Distributor>(tableName);
const crudService = new Service(dbHelper);
const crudController = new CrudApiController(crudService);

export const handler = async (event: APIGatewayProxyEvent) => {
  //   console.log(`Event: ${JSON.stringify(event)}`);
  await dbHelper.connect();
  return crudController.handleRequest(event);
};
