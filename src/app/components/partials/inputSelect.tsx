import { GenericStringIndex } from "@/app/type/generic";

interface InputSelectProps {
  id: string;
  onChange(e: React.ChangeEvent<HTMLSelectElement>): void;
  value: number | string;
  defaultText: string;
  options: GenericStringIndex[] | string[];
  schema?: string;
}

const InputSelect = (props: InputSelectProps) => {
  const { id, onChange, value, defaultText, options, schema } = props;

  const getTextOption = (data: GenericStringIndex): string => {
    if (schema === "competition-name") {
      return `${data.id} - ${data.name} - ${data.city}`;
    }

    return "";
  };

  return (
    <select
      id={id}
      onChange={(e) => {
        onChange(e);
      }}
      value={value}
    >
      {defaultText && <option value="">{defaultText}</option>}
      {options.map((option, i) => {
        if (typeof option === "string") {
          return (
            <option key={i} value={option}>
              {option}
            </option>
          );
        }

        return (
          <option key={i} value={option.id as number}>
            {getTextOption(option)}
          </option>
        );
      })}
    </select>
  );
};

export default InputSelect;
