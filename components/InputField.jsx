import React from "react";
import { TextInput, View, Text } from "react-native";

export default function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  style = {},
  className = "", // Tailwind CSS class names
  error = "",
}) {
  return (
    <View className={`mb-4 w-full ${className}`}>
      {label && <Text className="mb-1 font-semibold">{label}</Text>}
      <TextInput
        className=" px-3 py-2  text-black"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={style}
        placeholderTextColor="#999"
      />
      {error ? <Text className="text-red-600 mt-1">{error}</Text> : null}
    </View>
  );
}
