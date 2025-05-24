import { GenericStringIndex } from "./generic";
import { UpdateCommandInput } from '@aws-sdk/lib-dynamodb';

export type AttributesType = {
  name: string;
  label: string;
  displayResult?: boolean;
  displayRanking?: boolean;
  displaySearch?: GenericStringIndex;
  displayCompetitionsTable?: boolean;
}

export type DatabaseAttributesType = {
  competitions: AttributesType[];
  results: AttributesType[];
}

export type TableListResultsType = {
  [k: string]: GenericStringIndex[];
}

export type MyExtendedUpdateCommandInput = UpdateCommandInput & {
  ExpressionAttributeNames?: GenericStringIndex;
};