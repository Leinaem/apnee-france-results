export interface GenericStringIndex {
  [k: string]: string | null | number | boolean | [];
}

export type CategoryMappingIdType = {
  [k: string]: GenericStringIndex[];
};
