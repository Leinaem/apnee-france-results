export type AttributesType = {
  name: string;
  label: string;
  displayResult: Boolean;
}

export type DatabaseAttributesType = {
  competitions: AttributesType[];
  results: AttributesType[];
}