import React from "react";
import { Stack } from "expo-router";

const AuthLayout: React.FC = () => {
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AuthLayout;
