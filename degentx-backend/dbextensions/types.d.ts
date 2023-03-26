export type ModelWithTimestamps<T> = T & {
  createdAt: Date
  updatedAt: Date
}


export interface IPagination {
  limit?: number
  offset?: number
}

export interface MongoRecord {
  _id?: string
}
