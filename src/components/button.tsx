import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  variant: 'outlined' | 'standard' | 'secondary' | 'custom';
}

const Button: FunctionComponent<ButtonProps> = ({
  className,
  variant,
  ...rest
}) => {
  return (
    <div
      className={classNames(
        className,
        'h-[31px] rounded-[4px] flex justify-center whitespace-nowrap items-center px-[15px] text-sm cursor-pointer select-none',
        {
          'bg-primary text-white hover:bg-[#10874F]': variant === 'standard',
          'bg-white text-primary border-primary border-solid hover:text-[#10874F] hover:border-[#10874F] border':
            variant === 'outlined',
          'bg-primary/10 text-primary hover:bg-primary/20 active:bg-primary/30':
            variant === 'secondary',
        }
      )}
      {...rest}
    ></div>
  );
};

export default Button;
