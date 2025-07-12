interface InputCheckBoxProps {
  id: string;
  name: string;
  checked: boolean;
  readOnly: boolean;
  labelText: string;
  labelOnClick(e: React.MouseEvent<HTMLLabelElement, MouseEvent>): void;
}

const InputCheckBox = (props: InputCheckBoxProps) => {
  const {
    id,
    name,
    checked,
    readOnly = false,
    labelText,
    labelOnClick = () => {},
  } = props;

  return (
    <>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        readOnly={readOnly}
      />
      <label onClick={(value) => labelOnClick(value)}>{labelText}</label>
    </>
  );
};

export default InputCheckBox;
