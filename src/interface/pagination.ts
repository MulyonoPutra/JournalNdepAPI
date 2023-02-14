export interface Pagination<T> {
  total: number;
  page: number;
  pageSize: number;
  data: T[];
}