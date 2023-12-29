import mongoose, {
  Connection,
  Schema,
  Document,
  Model,
  SchemaDefinition,
} from "mongoose";
import { IDbHelper } from "./IDbHelper";

export default class MongoDbHelper<T extends Document> implements IDbHelper<T> {
  private model!: Model<T>;
  private mongoConfig: MongoConfig;
  constructor(
    private modelName: string,
    private schema: Schema,
    private collection: string
  ) {
    this.mongoConfig = new MongoConfig("elementx.wg7wcp4.mongodb.net");
  }

  public async connect() {
    await this.mongoConfig.connect();
    this.model = mongoose.model<T>(
      this.modelName,
      this.schema,
      this.collection
    );
  }

  async get_list<T>(qsObject?: any, fields?: string[]): Promise<T[]> {
    console.log("qsObject stringify", JSON.stringify(qsObject));
    const searchParams: Record<string, any> | undefined = this.convertToArgs(
      qsObject,
      fields!
    );
    return await this.model.find(searchParams!);
  }

  async get<T>(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async create<T>(data: T): Promise<T> {
    const itemCreated = await this.model.create(data);
    return <T>itemCreated;
  }

  async update<T>(id: string, updated: T): Promise<any> {
    const found = await this.model.findById(id).exec();
    if (!found) {
      throw new Error(`Document with ID ${id} not found.`);
    }
    const updatedDocument = Object.assign(found, updated);
    return updatedDocument.save();
  }

  async delete<T>(id: string): Promise<void> {
    console.log("monogoHelper.delete", id);
    await this.model.findByIdAndRemove(id);
  }

  // async search<T>(args: SearchParams): Promise<T[]> {
  //   const criteria: Record<string, any> = this.convertToArgs(args);
  //   const lst = await this.model.find(criteria);
  //   return <T[]>lst;
  // }

  static generateSchemaFromInterface = (interfaceObj: any): Schema => {
    const schemaFields: SchemaDefinition = {};
    // const fieldNames = Reflect.ownKeys(interfaceObj.prototype);
    for (const key in interfaceObj) {
      const fieldType = typeof interfaceObj[key];

      // Map the field types to Mongoose schema types
      switch (fieldType) {
        case "number":
          schemaFields[key] = { type: Number };
          break;
        case "boolean":
          schemaFields[key] = { type: Boolean };
          break;
        case "string":
          schemaFields[key] = { type: String };
          break;
        case "object":
          schemaFields[key] = { type: Object };
          break;
        default:
          schemaFields[key] = { type: fieldType };
      }
    }

    return new Schema(schemaFields);
  };

  private convertToArgs(args: any, fields: string[]) {
    const { SearchValue, Fields, ...searchCriteria } = args;
    const criteria: Record<string, any> = {
      ...searchCriteria,
    };
    if (SearchValue) {
      const searchValueRegex = new RegExp(SearchValue, "i");

      criteria.$or = fields.map((key) => ({
        [key]: { $regex: searchValueRegex },
      }));
    }
    return criteria;
  }
}

class MongoConfig {
  constructor(private clusterName: string) {}
  public user = "dbOwner";
  public pass = "WQdmUA82JK2qO5Vq";
  public dbName = "AnyPodcast";

  public get connectionString(): string {
    return `mongodb+srv://${this.user}:${this.pass}@${this.clusterName}/?retryWrites=true&w=majority`;
  }

  public async connect(): Promise<mongoose.Connection> {
    await mongoose.connect(this.connectionString, {
      dbName: this.dbName,
    });

    const db = mongoose.connection;

    db.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    db.once("open", () => {
      console.log(
        `Connected to MongoDB [${this.clusterName}], DB: [${this.dbName}]`
      );
    });
    return db;
  }
}
