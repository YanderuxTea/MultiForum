import React from "react";

interface IProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
  id?: string;
  autoComplete?: string;
  readonly?: boolean;
  defaultValue?: string;
  name?: string;
  pattern?: string;
}
export default function InputAny({
  value,
  onChange,
  placeholder,
  type,
  id,
  autoComplete,
  readonly,
  defaultValue,
  name,
  pattern,
}: IProps) {
  return (
    <input
      disabled={readonly ? readonly : undefined}
      name={name ? name : undefined}
      readOnly={readonly ? readonly : undefined}
      autoComplete={autoComplete ? autoComplete : undefined}
      defaultValue={defaultValue ? defaultValue : undefined}
      id={id}
      pattern={pattern}
      value={value !== null ? value : undefined}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      type={`${type ? type : undefined}`}
      placeholder={`${placeholder ? placeholder : ""}`}
      className="border px-2.5 py-1 w-full rounded-md outline-none border-neutral-300 focus:border-neutral-400 transition-colors duration-300 ease-in-out dark:border-neutral-700 dark:focus:border-neutral-600"
    />
  );
}
