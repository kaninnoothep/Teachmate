import { TextInput } from "@/components/TextInput/TextInput";
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";

export const FormTextInput = ({
  control,
  name,
  placeholder,
  error: hasError,
  helperText,
  hideHelperTextSpace = false,
  fullWidth,
  ...props
}) => {
  return (
    <Controller
      {...{ name, control }}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { invalid, error },
      }) => (
        <TextInput
          {...{ ...props, onBlur, placeholder, hideHelperTextSpace, fullWidth }}
          onChangeText={onChange}
          value={value || ""}
          error={invalid || hasError}
          helperText={helperText || error?.message}
        />
      )}
    />
  );
};

FormTextInput.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  hideHelperTextSpace: PropTypes.bool,
  fullWidth: PropTypes.bool,
};
