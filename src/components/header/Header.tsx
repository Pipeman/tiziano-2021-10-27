import React, { useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
//@ts-ignore
import { Chevron } from "react-native-shapes";
import {
  BTCGroups,
  ETHGroups,
  Groups,
  ProductId,
} from "../../@types/orderbook/Orderbook";

interface Props {
  selectedGrouping: number;
  selectedProduct: ProductId;
  handleValueChange: (value: Groups) => void;
}

const btcGroups: BTCGroups[] = [0.5, 1, 2.5];
const ethGroups: ETHGroups[] = [0.05, 0.1, 0.25];

export const _Header = ({
  selectedGrouping,
  selectedProduct,
  handleValueChange,
}: Props) => {
  const selectedGroup = useMemo(
    () => (selectedProduct === "PI_XBTUSD" ? btcGroups : ethGroups),
    [selectedProduct]
  );
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Order Book</Text>
      <RNPickerSelect
        onValueChange={(itemValue: Groups) => handleValueChange(itemValue)}
        items={selectedGroup.map((group) => ({
          label: `Grouping ${group}`,
          value: group,
        }))}
        placeholder={{}}
        value={selectedGrouping}
        style={pickerSelectStyles}
        Icon={() =>
          Platform.OS === "ios" ? <Chevron color="#999" size={1.5} /> : null
        }
      />
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 6,
    color: "#999",
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: "rgb(55, 65, 82)",
  },
  inputAndroid: {
    paddingHorizontal: 10,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 6,
    color: "#999",
    backgroundColor: "rgb(55, 65, 82)",
    minWidth: 200,
  },
  iconContainer: {
    display: "flex",
    top: 12,
    right: 15,
  },
});

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderColor: "#333",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 6,
  },
  headerText: {
    color: "#999",
  },
  pickerTrigger: {
    backgroundColor: "rgb(55, 65, 82)",
    borderRadius: 6,
    minHeight: 18,
    minWidth: 100,
    alignItems: "center",
  },
  pickerText: {
    color: "#999",
  },
});

export const Header = React.memo(
  _Header,
  (prevProps, newProps) =>
    prevProps.selectedGrouping === newProps.selectedGrouping &&
    prevProps.selectedProduct === newProps.selectedProduct
);
