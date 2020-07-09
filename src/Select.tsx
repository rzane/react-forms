import * as React from "react";
import { useField } from "./useField";
import { applyTheme } from "./applyTheme";
import { SelectProps, OptionProps, Element, Theme } from "./types";

const coerce = (option: OptionProps | string): OptionProps => {
  return typeof option === "string"
    ? { label: option, value: option, key: option }
    : option;
};

export function createSelect<ThemeProps>(
  theme: Theme<ThemeProps, SelectProps>
) {
  return function Select(props: SelectProps & ThemeProps): Element {
    const {
      value,
      onChange,
      placeholder,
      options,
      append,
      prepend,
      children,
      ...otherProps
    } = applyTheme(props, theme);

    const field = useField(otherProps);
    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange && onChange(event.target.value);
      },
      [onChange]
    );

    const renderOption = (option: OptionProps | string) => {
      const { value, label = value, key = value, ...props } = coerce(option);

      return (
        <option key={key} value={value} {...props}>
          {label}
        </option>
      );
    };

    return (
      <div {...field.getFieldProps()}>
        {field.label && (
          <label {...field.getLabelProps()}>
            {field.label}
            {field.help && <span {...field.getHelpProps()}>{field.help}</span>}
          </label>
        )}
        {prepend}
        <select
          value={value}
          onChange={handleChange}
          {...field.getInputProps()}
        >
          {placeholder && (
            <option disabled value="" key="placeholder">
              {placeholder}
            </option>
          )}

          {options?.map(renderOption)}
          {children}
        </select>
        {append}
        {field.error && <span {...field.getErrorProps()}>{field.error}</span>}
      </div>
    );
  };
}

export const Select = createSelect({});
