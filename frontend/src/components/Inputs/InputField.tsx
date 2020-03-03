import React from "react";
import { FieldProps, FormikErrors } from "formik";

interface InputFieldProps {
  label: string;
  modifier: string | string[];
  icon: any;
  errorMessageModifier: string | string[];
}

const InputField: React.SFC<FieldProps<any> & Partial<InputFieldProps>> = ({
  field,
  form: { touched, errors},
  ...props
}) => {
  const errorMsg = touched[field.name] && errors[field.name];

  return (
    <div className="input">
      <div className="p--relative">
        {props.label ? 
          <h6 className="input__label">{props.label}</h6>
        : null}

        <input 
          {...field}
          {...props} 
          className={`input__field ${props.modifier ? props.modifier : ''} ${errorMsg ? 'input__field--error' : ''}`} 
        />

        {props.icon ? <span className="input__icon">{props.icon}</span> : null}
      </div>

      {/* {errorMsg ? <ExclamationIcon /> : null} */}
      {errorMsg ? 
        <span className={`input__error-msg ${props.errorMessageModifier ? props.errorMessageModifier : ''}`}>
          {errorMsg}
        </span> 
      : null}

      {/* If successfull */}
      {/* {props.validationCheckmark ? 
        props.check ? <CheckIcon className="validation-check" /> 
        : <ExclamationIcon className="validation-check" />
      : null} */}
    </div>
  )
}

export default InputField;
