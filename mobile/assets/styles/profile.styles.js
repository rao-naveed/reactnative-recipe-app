import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  content: {
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
  },
  email: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  infoCard: {
    width: "100%",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginTop: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#E23744",
    borderRadius: 14,
    paddingVertical: 14,
    width: "100%",
    marginTop: 32,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
