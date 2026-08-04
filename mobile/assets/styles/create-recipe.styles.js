import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const createRecipeStyles = StyleSheet.create({
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  imagePickerBox: {
    height: 160,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 16,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  imagePickerText: {
    marginTop: 8,
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 6,
  },
  difficultyRow: {
    flexDirection: "row",
    gap: 10,
  },
  difficultyChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    alignItems: "center",
  },
  difficultyChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  difficultyChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
  },
  difficultyChipTextSelected: {
    color: COLORS.white,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
