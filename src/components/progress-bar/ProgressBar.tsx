import React from "react";
import { StyleSheet, View } from "react-native";
import { OrderType } from "../../@types/orderbook/Orderbook";

interface Props {
  orderType: OrderType;
  length: number;
}

export const _ProgressBar = ({ orderType, length }: Props) => (
  <View
    style={[
      styles.progressBar,
      {
        backgroundColor:
          orderType === "BIDS" ? "rgb(14, 203, 129)" : "rgb(246, 70, 93)",
        transform: [{ translateX: length }],
      },
    ]}
  ></View>
);

const styles = StyleSheet.create({
  progressBar: {
    position: "absolute",
    left: 0,
    width: "100%",
    zIndex: -1,
    opacity: 0.2,
    height: "100%",
  },
});

export const ProgressBar = React.memo(_ProgressBar);
