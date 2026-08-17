// import { useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Modal,
//   Animated,
//   Dimensions,
//   Pressable,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { COLORS } from "../constants/colors";
// import { sidebarStyles } from "../assets/styles/sidebar.styles";
// import { useAuth } from "../contexts/AuthContext";

// const { width } = Dimensions.get("window");
// const SIDEBAR_WIDTH = Math.min(300, width * 0.78);

// const Sidebar = ({ visible, onClose }) => {
//   const router = useRouter();
//   const { user } = useAuth();
//   const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
//   const overlayOpacity = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     if (visible) {
//       Animated.parallel([
//         Animated.timing(translateX, {
//           toValue: 0,
//           duration: 260,
//           useNativeDriver: true,
//         }),
//         Animated.timing(overlayOpacity, {
//           toValue: 1,
//           duration: 260,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     } else {
//       translateX.setValue(-SIDEBAR_WIDTH);
//       overlayOpacity.setValue(0);
//     }
//   }, [visible]);

//   const handleClose = () => {
//     Animated.parallel([
//       Animated.timing(translateX, {
//         toValue: -SIDEBAR_WIDTH,
//         duration: 220,
//         useNativeDriver: true,
//       }),
//       Animated.timing(overlayOpacity, {
//         toValue: 0,
//         duration: 220,
//         useNativeDriver: true,
//       }),
//     ]).start(() => onClose());
//   };

//   const goTo = (path) => {
//     handleClose();
//     setTimeout(() => router.push(path), 200);
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="none"
//       onRequestClose={handleClose}
//       statusBarTranslucent
//     >
//       <View style={sidebarStyles.root}>
//         <Animated.View
//           style={[sidebarStyles.overlay, { opacity: overlayOpacity }]}
//         >
//           <Pressable style={sidebarStyles.overlayPressable} onPress={handleClose} />
//         </Animated.View>

//         <Animated.View
//           style={[
//             sidebarStyles.panel,
//             { width: SIDEBAR_WIDTH, transform: [{ translateX }] },
//           ]}
//         >
//           {/* Profile header */}
//           <View style={sidebarStyles.header}>
//             <View style={sidebarStyles.avatarCircle}>
//               <Ionicons name="person" size={28} color={COLORS.white} />
//             </View>
//             <Text style={sidebarStyles.userName} numberOfLines={1}>
//               {user?.name || "Welcome"}
//             </Text>
//             {user?.email && (
//               <Text style={sidebarStyles.userEmail} numberOfLines={1}>
//                 {user.email}
//               </Text>
//             )}
//           </View>

//           {/* Menu items */}
//           <View style={sidebarStyles.menu}>
//             <TouchableOpacity
//               style={sidebarStyles.menuItem}
//               onPress={() => goTo("/(tabs)")}
//               activeOpacity={0.7}
//             >
//               <Ionicons name="home-outline" size={22} color={COLORS.text} />
//               <Text style={sidebarStyles.menuItemText}>Main Page</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={sidebarStyles.menuItem}
//               onPress={() => goTo("/(tabs)/favorites")}
//               activeOpacity={0.7}
//             >
//               <Ionicons name="heart-outline" size={22} color={COLORS.text} />
//               <Text style={sidebarStyles.menuItemText}>Favorite Recipes</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={sidebarStyles.menuItem}
//               onPress={() => goTo("/profile")}
//               activeOpacity={0.7}
//             >
//               <Ionicons
//                 name="person-circle-outline"
//                 size={22}
//                 color={COLORS.text}
//               />
//               <Text style={sidebarStyles.menuItemText}>Profile</Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </View>
//     </Modal>
//   );
// };

// export default Sidebar;

import { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/colors";
import { sidebarStyles } from "../assets/styles/sidebar.styles";
import { useAuth } from "../contexts/AuthContext";
import { API_URL } from "../constants/api";

const { width } = Dimensions.get("window");
const SIDEBAR_WIDTH = Math.min(300, width * 0.78);

const Sidebar = ({ visible, onClose }) => {
  const router = useRouter();
  const { user } = useAuth();
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      translateX.setValue(-SIDEBAR_WIDTH);
      overlayOpacity.setValue(0);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -SIDEBAR_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  const goTo = (path) => {
    handleClose();
    setTimeout(() => router.push(path), 200);
  };

  // =========================================================
  // UPGRADE TO PREMIUM
  // =========================================================
  const handleUpgradeToPremium = async () => {
    try {
      const userId = user?.id;

      if (!userId) {
        Alert.alert(
          "Authentication Required",
          "Please sign in before upgrading to Premium.",
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: Number(userId),
            amount: 10,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Payment session failed.");
      }

      handleClose();

      setTimeout(async () => {
        const supported = await Linking.canOpenURL(data.url);

        if (supported) {
          await Linking.openURL(data.url);
        } else {
          Alert.alert(
            "Payment Error",
            "Unable to open the Stripe payment gateway.",
          );
        }
      }, 250);
    } catch (error) {
      console.error("Premium upgrade error:", error);

      Alert.alert(
        "Payment Error",
        "Unable to open payment gateway. Please try again.",
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={sidebarStyles.root}>
        <Animated.View
          style={[sidebarStyles.overlay, { opacity: overlayOpacity }]}
        >
          <Pressable
            style={sidebarStyles.overlayPressable}
            onPress={handleClose}
          />
        </Animated.View>

        <Animated.View
          style={[
            sidebarStyles.panel,
            { width: SIDEBAR_WIDTH, transform: [{ translateX }] },
          ]}
        >
          {/* Profile header */}
          <View style={sidebarStyles.header}>
            <View style={sidebarStyles.avatarCircle}>
              <Ionicons name="person" size={28} color={COLORS.white} />
            </View>

            <Text style={sidebarStyles.userName} numberOfLines={1}>
              {user?.name || "Welcome"}
            </Text>

            {user?.email && (
              <Text style={sidebarStyles.userEmail} numberOfLines={1}>
                {user.email}
              </Text>
            )}
          </View>

          {/* Menu items */}
          <View style={sidebarStyles.menu}>
            {/* Main Page */}
            <TouchableOpacity
              style={sidebarStyles.menuItem}
              onPress={() => goTo("/(tabs)")}
              activeOpacity={0.7}
            >
              <Ionicons name="home-outline" size={22} color={COLORS.text} />

              <Text style={sidebarStyles.menuItemText}>Main Page</Text>
            </TouchableOpacity>

            {/* Favorite Recipes */}
            <TouchableOpacity
              style={sidebarStyles.menuItem}
              onPress={() => goTo("/(tabs)/favorites")}
              activeOpacity={0.7}
            >
              <Ionicons name="heart-outline" size={22} color={COLORS.text} />

              <Text style={sidebarStyles.menuItemText}>Favorite Recipes</Text>
            </TouchableOpacity>

            {/* Upgrade to Premium */}
            <TouchableOpacity
              style={sidebarStyles.menuItem}
              onPress={handleUpgradeToPremium}
              activeOpacity={0.7}
            >
              <Ionicons
                name="diamond-outline"
                size={22}
                color={COLORS.primary}
              />

              <Text
                style={[
                  sidebarStyles.menuItemText,
                  {
                    color: COLORS.primary,
                    fontWeight: "700",
                  },
                ]}
              >
                Upgrade to Premium
              </Text>
            </TouchableOpacity>

            {/* Profile */}
            <TouchableOpacity
              style={sidebarStyles.menuItem}
              onPress={() => goTo("/profile")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="person-circle-outline"
                size={22}
                color={COLORS.text}
              />

              <Text style={sidebarStyles.menuItemText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default Sidebar;
