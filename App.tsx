import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Orderbook } from "./src/features/orderbook/Orderbook";

export default function App() {
  return (
    <View style={styles.container}>
      <Orderbook></Orderbook>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(16, 24, 40)",
    alignItems: "center",
    justifyContent: "center",
  },
});
