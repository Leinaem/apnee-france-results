interface InputTextProps {
  id?: string;
  name?: string;
  value: number | string;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
  labelText?: string;
  labelHtmlFor?: string;
  placeholder?: string;
}
  
const InputText = (props: InputTextProps) => {
  const {
    id,
    name,
    value,
    onChange = () => {},
    labelText = '',
    labelHtmlFor = '',
    placeholder,
  } = props;

  return (
    <>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e)}
        placeholder={placeholder}
      />
      {labelText && <label htmlFor={labelHtmlFor}>{labelText}</label>}
    </>
  )
}

export default InputText;