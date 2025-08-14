interface InputTextProps {
  id?: string;
  name?: string;
  value: number | string;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
  onFocus(e: React.ChangeEvent<HTMLInputElement>): void;
  onBlur(e: React.ChangeEvent<HTMLInputElement>): void;
  labelText?: string;
  labelHtmlFor?: string;
  placeholder?: string;
  icon?: string;
}

const InputText = (props: InputTextProps) => {
  const {
    id,
    name,
    value,
    onChange = () => {},
    labelText = "",
    labelHtmlFor = "",
    placeholder,
    icon,
    onFocus = () => {},
    onBlur = () => {},
  } = props;

  return (
    <div className="input-container">
      <input
        className="input-text"
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e)}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {icon && (
        <svg className={`icon icon-${icon}`}>
          <use xlinkHref="/svg-sprite.svg#svg-search"></use>
        </svg>
      )}
      {labelText && <label htmlFor={labelHtmlFor}>{labelText}</label>}
    </div>
  );
};

export default InputText;
