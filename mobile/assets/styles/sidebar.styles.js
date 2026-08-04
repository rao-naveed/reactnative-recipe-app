import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const sidebarStyles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  overlayPressable: {
    flex: 1,
  },
  panel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: COLORS.white,
    paddingTop: 60,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 12,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  menu: {
    paddingHorizontal: 8,
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  footer: {
    paddingHorizontal: 8,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E23744",
  },
});
