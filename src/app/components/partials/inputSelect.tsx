import { GenericStringIndex } from "@/app/type/generic";

interface InputSelectProps {
  id: string;
  onChange: Function;
  value: number | string;
  defaultText: string;
  options: GenericStringIndex[] | string[];
  schema: string;  
}

const InputSelect = (props: InputSelectProps) => {
  const {id, onChange, value, defaultText, options, schema} = props;

  const getTextOption = (data: GenericStringIndex): string => {
    if (schema === 'competition-name') {
      return `${data.id} - ${data.name} - ${data.city}`
    } else if (schema === 'import-type') {
      return data.label as string;
    } else if (schema === 'category-name') {
      return data.name as string;
    }

    return '';
  }

  return (
    <select
      id={id}
      onChange={(e) => {
        onChange(e)
      }}
      value={value}
    >
      {defaultText && (
        <option value={0}>{defaultText}</option>
      )}
      {
        options.map((option, i) => {
         if (typeof option === 'string' ) {
          return <option key={i} value={option}>{option}</option>
         }

          return <option key={i} value={option.id as number}>{getTextOption(option)}</option>
        })
      }
    </select>
  )
}

export default InputSelect;
