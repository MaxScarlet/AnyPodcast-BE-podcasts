export class SearchParams {
  UserID!: string;
  SearchValue?: string;
  constructor(data?: SearchParams | string) {
    if (data) {
      if (typeof data !== "object") data = JSON.parse(data);
      Object.assign(this, data);
    } else {
    }
  }
}
