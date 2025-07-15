export interface GenericStringIndex {
  [k: string]: string | null | number | boolean | [];
}
export interface GenericStringIndexWithDate {
  [key: string]: string | null | number | boolean | [] | Date;
}

export type CategoryMappingIdType = {
  [k: string]: GenericStringIndex[];
};
