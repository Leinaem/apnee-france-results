type ConditionalWrapperType = {
  condition: Boolean;
  wrapper: any;
  children: any;
}

const ConditionalWrapper = (props: ConditionalWrapperType) => {
    const { condition, wrapper, children } = props;
    return condition ? wrapper(children) : children;
};

export default ConditionalWrapper;
