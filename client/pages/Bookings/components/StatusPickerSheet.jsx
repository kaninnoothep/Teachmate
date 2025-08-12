/**
 * Import Modules
 */
import { Button } from "@/components/Button/Button";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Status options available for selection, each with a label and corresponding value
export const STATUS = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Rejected", value: "rejected" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Finished", value: "finished" },
  { label: "Expired", value: "expired" },
];

/**
 * StatusPickerSheet - A bottom sheet modal for selecting a status.
 *
 * @param {*} props
 * @param {*} ref - Ref forwarded to control opening/closing the sheet externally
 * @returns JSX Element for the filter sheet
 */
export const StatusPickerSheet = forwardRef(
  ({ initialStatus = STATUS[0], onSelect }, ref) => {
    const sheetRef = useRef(null);
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);
    const theme = useTheme();
    const styles = useStyles(theme);
    const insets = useSafeAreaInsets();

    // Define snap points for BottomSheet
    const snapPoints = useMemo(() => ["44%"], []);

    // Expose methods to open and close the BottomSheet
    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.snapToIndex(0),
      close: () => sheetRef.current?.close(),
    }));

    // Render backdrop behind BottomSheet
    const renderBackdrop = useCallback(
      (props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
        />
      ),
      []
    );

    // Convert a status value into an object with label and value
    const createSelection = (status) => {
      if (status) {
        const statusLabel = STATUS.find((s) => s.value === status)?.label;
        return {
          label: statusLabel,
          value: status,
        };
      }

      return null;
    };

    // Handler for when user changes status selection in the Picker
    const handleStatusChange = (value) => {
      setSelectedStatus(value);
      onSelect(createSelection(value));
    };

    return (
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: theme.colors.background }}
        containerStyle={{ marginTop: insets.top }}
        onAnimate={() => Keyboard.dismiss()}
        handleComponent={null}
      >
        <View style={styles.container}>
          {/* Title */}
          <Text style={styles.title}>Select Status</Text>

          {/* Picker to select status */}
          <Picker
            selectedValue={selectedStatus}
            onValueChange={handleStatusChange}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            {STATUS.map(({ label, value }) => (
              <Picker.Item key={value} label={label} value={value} />
            ))}
          </Picker>

          {/* Done button to close the sheet */}
          <Button
            onPress={() => sheetRef.current?.close()}
            style={styles.button}
          >
            Done
          </Button>
        </View>
      </BottomSheet>
    );
  }
);

// Set display name
StatusPickerSheet.displayName = "StatusPickerSheet";

/**
 * useStyles - Specify styles to use
 *
 * @param {*} theme
 * @returns StyleSheet object
 */
const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingBottom: 60,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      textAlign: "center",
      marginTop: 20,
      marginBottom: 12,
    },
    picker: {
      height: 240,
      color: theme.colors.text,
    },
    pickerItem: {
      color: theme.colors.text,
      fontSize: 16,
    },
  });
