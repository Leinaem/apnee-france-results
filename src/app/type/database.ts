import { GenericStringIndex } from "./generic";

export type AttributesType = {
  name: string;
  label: string;
  displayResult: boolean;
  displayRanking: boolean;
  displayCompetitionsTable?: boolean;
}

export type DatabaseAttributesType = {
  competitions: AttributesType[];
  results: AttributesType[];
}

export type TableListResultsType = {
  [k: string]: GenericStringIndex[];
}