import React from "react";

interface IButton extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  disabled?: boolean;
  clicked?: (event?: any) => void;
}

const Button = (props: IButton) => {
  return <button {...props} onClick={props.clicked}>{props.children}</button>
}

export default Button;