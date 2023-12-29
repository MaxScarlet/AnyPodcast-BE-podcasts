import { config, DynamoDB } from "aws-sdk";
import { IDbHelper } from "./IDbHelper";
// TODO migrate to V3

export class DynamoDbHelper<T> implements IDbHelper<T> {
  private db: DynamoDB.DocumentClient;

  constructor(private tableName: string) {
    config.update({ region: process.env.REGION });
    this.db = new DynamoDB.DocumentClient();
  }
  public async connect(): Promise<void> {
    return Promise.resolve(); // stub
  }

  public async get_list<T>(): Promise<T[]> {
    const params = {
      TableName: this.tableName,
    };
    const result = await this.db.scan(params).promise();
    return <T[]>result.Items;
  }

  public async get<T>(id: string, keyName = "id"): Promise<T> {
    const params = {
      TableName: this.tableName,
      Key: { [keyName]: id },
    };
    const result = await this.db.get(params).promise();
    return <T>result.Item;
  }
  public async create<T>(data: T): Promise<T> {
    const item = await this.put({
      TableName: this.tableName,
      Item: data,
    });
    return <T>item;
  }
  public async update<T>(id: string, updated: T, keyName = "id"): Promise<T> {
    // TODO: implement convertion
    const updateExpression = "SET name = :value1, email = :value2";
    const expressionAttributeValues = {
      // ':value1': updated.name,
      // ':value2': updated.email,
    };
    const params = {
      TableName: this.tableName,
      Key: { [keyName]: id },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "UPDATED_NEW",
    };
    const result = await this.db.update(params).promise();
    return <T>result.Attributes;
  }

  public async delete<T>(id: string, keyName = "id"): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { [keyName]: id },
    };
    await this.db.delete(params).promise();
  }

  public async search<T>(args: any): Promise<T[]> {
    const params = this.convertAttrsForScan(args);
    return await this.scan<T>(params);
  }

  private async scan<T>(
    params: DynamoDB.DocumentClient.ScanInput
  ): Promise<T[]> {
    params.TableName = this.tableName;
    const result = await this.db.scan(params).promise();
    return <T[]>result.Items;
  }

  private async put(
    item: DynamoDB.DocumentClient.PutItemInputAttributeMap
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: item,
    };
    await this.db.put(params).promise();
  }

  private convertAttrsForScan(obj: any): DynamoDB.DocumentClient.ScanInput {
    const params = {
      TableName: "",
      FilterExpression: "",
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
    };
    let i = 1;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        params.FilterExpression +=
          (params.FilterExpression ? " AND " : "") + `#field${i}=:value${i}`;
        params.ExpressionAttributeNames[`#field${i}`] = key;
        params.ExpressionAttributeValues[`:value${i}`] = value;
        i++;
      }
    }
    return params;
  }
}
