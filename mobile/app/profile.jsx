import { View, Text, TouchableOpacity, Alert, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { profileStyles } from "../assets/styles/profile.styles";
import { useAuth } from "../contexts/AuthContext";

const ProfileScreen = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const performLogout = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  const handleSignOut = () => {
    // Alert.alert's multi-button API isn't implemented on Expo Web, so
    // tapping Logout there would otherwise do nothing. Use window.confirm
    // on web and the native Alert everywhere else.
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.confirm("Are you sure you want to logout?")) {
        performLogout();
      }
      return;
    }

    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: performLogout,
      },
    ]);
  };

  return (
    <View style={profileStyles.container}>
      <View style={profileStyles.header}>
        <TouchableOpacity onPress={() => router.back()} style={profileStyles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={profileStyles.headerTitle}>Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={profileStyles.content}>
        <View style={profileStyles.avatarCircle}>
          <Ionicons name="person" size={48} color={COLORS.white} />
        </View>

        <Text style={profileStyles.name}>{user?.name || "User"}</Text>
        {user?.email && <Text style={profileStyles.email}>{user.email}</Text>}

        <View style={profileStyles.infoCard}>
          <View style={profileStyles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.textLight} />
            <Text style={profileStyles.infoText}>
              Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={profileStyles.logoutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
          <Text style={profileStyles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;