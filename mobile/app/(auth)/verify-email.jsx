import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { authStyles } from "../../assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";
import { AuthAPI } from "../../services/authAPI";
import { useAuth } from "../../contexts/AuthContext";

const VerifyEmail = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const { signIn } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    if (!email || !code) {
      Alert.alert("Error", "Email and code are required.");
      return;
    }

    setLoading(true);
    try {
      const result = await AuthAPI.verifyEmail({ email, code });
      await signIn({
        token: result.token,
        user: result.user || { id: "", name: "", email },
      });
      router.replace("/(tabs)");
    } catch (err) {
      Alert.alert("Error", err.message || "Verification failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={authStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Container */}
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i3.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          {/* Title */}
          <Text style={authStyles.title}>Verify Your Email</Text>
          <Text style={authStyles.subtitle}>We&apos;ve sent a verification code to {email}</Text>

          <View style={authStyles.formContainer}>
            {/* Verification Code Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter verification code"
                placeholderTextColor={COLORS.textLight}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
              onPress={handleVerification}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>{loading ? "Verifying..." : "Verify Email"}</Text>
            </TouchableOpacity>

            {/* Back to Sign Up */}
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={() => router.push("/(auth)/sign-up")}
            >
              <Text style={authStyles.linkText}>
                <Text style={authStyles.link}>Back to Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
export default VerifyEmail;
