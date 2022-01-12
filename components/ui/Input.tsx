import React, { useReducer, useEffect } from 'react';
import { Text, TextInputProps, View, TextInput } from 'react-native';
import { useTheme } from '../../theme';

type State = {
  /** Value of the text field */
  value: string;
  /** Has all validation for the field been met? */
  isValid: boolean;
  /** Has field been touched? */
  touched: boolean;
};

type Action =
  | {
      type: 'INPUT_CHANGE';
      /** Value of the text field */
      value: string;
      /** Has all validation for the field been met? */
      isValid: boolean;
    }
  | {
      type: 'INPUT_BLUR';
      /** Has field been touched? */
      touched: boolean;
    };

const inputReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case 'INPUT_BLUR':
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};

type UserProps = {
  /** Unique id for text input field */
  id: string;
  /** Text Input label */
  label: string;
  /** Error text displayed when field isn't valid */
  errorMessage: string;
  /** Initial Value of the input field */
  initialValue: string;
  /** Is field required? */
  required?: boolean;
  initiallyValid: boolean;
  email?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  onInputChange: (id: string, value: string, isValid: boolean) => void;
};

type Props = TextInputProps & UserProps;

const Input = (props: Props) => {
  const { t } = useTheme();

  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : '',
    isValid: props.initiallyValid,
    touched: false,
  });

  const { onInputChange, id } = props;

  useEffect(() => {
    if (inputState.touched) {
      onInputChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, onInputChange, id]);

  const textChangeHandler = (text: string) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }
    if (
      props.id === 'price' &&
      !text.match(/^([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(.[0-9][0-9])?$/g)
    ) {
      isValid = false;
    }
    dispatch({ type: 'INPUT_CHANGE', value: text, isValid: isValid });
  };

  const lostFocusHandler = () => {
    dispatch({ type: 'INPUT_BLUR', touched: true });
  };

  return (
    <View style={[t.wFull]}>
      <Text style={[t.fontSansBold, t.mY2]}>{props.label}</Text>
      <TextInput
        {...props}
        style={[t.pX0, t.pY1, t.borderGray400, t.borderB0_5]}
        value={inputState.value}
        onChangeText={textChangeHandler}
        onBlur={lostFocusHandler}
      />
      {!inputState.isValid && inputState.touched && (
        <View style={[t.mY2]}>
          <Text style={[t.fontSans, t.textError, t.textXs]}>
            {props.errorMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Input;
