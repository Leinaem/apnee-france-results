import { GenericStringIndex } from "@/app/type/generic";

interface InputSelectProps {
  id: string;
  onChange: Function;
  value: string;
  defaultText: string;
  options: GenericStringIndex[];
  schema: string;  
}

const InputSelect = (props: InputSelectProps) => {
  const {id, onChange, value, defaultText, options, schema} = props;

  const getTextOption = (data: GenericStringIndex): string => {
    if (schema === 'competition-name') {
      return `${data.name} - ${data.city}`
    } else if (schema === 'import-type') {
      return data.label;
    }

    return '';
  }

  return (
    <select
      id={id}
      onChange={(e) => onChange(e)}
      value={value}
    >
      {defaultText && (
        <option value=''>{defaultText}</option>
      )}
      {
        options.map((option, i) => {
          return <option key={i} value={option.id}>{getTextOption(option)}</option>
        })
      }
    </select>
  )
}

export default InputSelect;
