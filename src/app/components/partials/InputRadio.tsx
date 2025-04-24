interface InputRadioProps {
  id: string;
  name: string;
  value: number | string;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
  checked: boolean;
  labelText: string;
  labelHtmlFor: string;
}

const InputRadio = (props: InputRadioProps) => {
  const {
      id,
      name,
      value,
      onChange = () => {},
      checked,
      labelText,
      labelHtmlFor
  } = props;

  return (
    <>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e)}
        checked={checked}
      />
      <label htmlFor={labelHtmlFor}>{labelText}</label>
    </>
  )
}

export default InputRadio;
