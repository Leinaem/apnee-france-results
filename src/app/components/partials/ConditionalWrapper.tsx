import { ReactNode } from 'react'

type ConditionalWrapperType = {
  condition: boolean;
  wrapper(arg0: ReactNode): ReactNode;
  children: ReactNode;
}

const ConditionalWrapper = (props: ConditionalWrapperType) => {
    const { condition, wrapper, children } = props;
    return condition ? wrapper(children) : children;
};

export default ConditionalWrapper;
