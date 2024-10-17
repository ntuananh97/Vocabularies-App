export type TQueryParams = {
  filter?: string;
  sort?: string;
  limit?: number;
  page?: number;
  attributes?: string;
}

export type TGetListApiResponse<T> = {
  list: T[];
  total: number;
}

export type TApiResponse<T = any> = {
  data: T;
  message: string;
}
