import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) return null;
  if (isSignedIn) return <Redirect href={"/"} />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
