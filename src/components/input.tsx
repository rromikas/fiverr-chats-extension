import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

const Input: FunctionComponent<InputProps> = ({ className, ...rest }) => {
  return (
    <input
      className={classNames(
        className,
        'h-[31px] flex items-center px-[15px] text-sm border-[#EBEBEB] border rounded-[4px]',
        {}
      )}
      {...rest}
    ></input>
  );
};

export default Input;
