import React from "react";
import { StyleSheet, Text } from "react-native";

interface Props {
  value: string;
  color?: string;
}

export const _DataCell = ({ value, color }: Props) => (
  <Text style={[styles.dataCell, color ? { color: color } : {}]}>{value}</Text>
);

const styles = StyleSheet.create({
  dataCell: {
    width: "33.3%",
    textAlign: "right",
    color: "#FFF",
  },
});

export const DataCell = React.memo(_DataCell);
