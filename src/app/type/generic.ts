export interface GenericStringIndex {
  [k: string]: string | null | number;
}

export type CategoryMappingIdType = {
  [k: string]: GenericStringIndex[];
}