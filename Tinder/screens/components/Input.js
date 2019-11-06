import React from "react";
import { TextInput } from "react-native";

const Input = ({
  value,
  onChangeText,
  placeHolder,
  secureTextEntry,
  keyboardType,
  multiline,
  numberOfLines,
  blurOnSubmit
}) => {
  const { inputStyle, labelStyle, containerStyle } = styles;
  return (
    <TextInput
      secureTextEntry={secureTextEntry}
      placeholder={placeHolder}
      autoCorrect={false}
      style={inputStyle}
      value={value}
      multiline={multiline}
      numberOfLines={numberOfLines}
      blurOnSubmit={blurOnSubmit}
      keyboardType={keyboardType}
      onChangeText={onChangeText}
      autoCapitalize="none"
    />
  );
};

const styles = {
  inputStyle: {
    marginVertical: 10,
    color: "#000",
    fontSize: 18,
    lineHeight: 23,
    height: 40,
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1
  }
};

export { Input };
