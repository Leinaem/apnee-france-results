import { GenericStringIndex } from "./generic";

export type AttributesType = {
  name: string;
  label: string;
  displayResult: Boolean;
  displayRanking: Boolean;
}

export type DatabaseAttributesType = {
  competitions: AttributesType[];
  results: AttributesType[];
}

export type TableListResultsType = {
  [k: string]: GenericStringIndex[];
}