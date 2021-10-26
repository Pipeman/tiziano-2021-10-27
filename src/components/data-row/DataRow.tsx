import { FormatMoney } from "format-money-js";
import React, { useRef } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { OrderType } from "../../@types/orderbook/Orderbook";
import { DataCell } from "../data-cell/DataCell";
import { ProgressBar } from "../progress-bar/ProgressBar";

interface Props {
  price: number;
  size: number;
  total: number;
  barsLengthPercentage: number;
  orderType: OrderType;
}

const format = new FormatMoney();

export const _DataRow = ({
  price,
  size,
  total,
  barsLengthPercentage,
  orderType,
}: Props) => {
  const screenWidth = useRef(Dimensions.get("window").width);
  const formattedPrice = useRef(
    format.from(price, { symbol: "$", decimals: 2 }).toString()
  );
  const formattedSize = useRef(format.from(size, { symbol: "" }).toString());
  const formattedTotal = useRef(format.from(total, { symbol: "" }).toString());

  return (
    <View key={price} style={styles.dataRow}>
      <View style={styles.dataValues}>
        <DataCell
          value={formattedPrice.current}
          color={
            orderType === "BIDS" ? "rgb(14, 203, 129)" : "rgb(246, 70, 93)"
          }
        />
        <DataCell value={formattedSize.current} />
        <DataCell value={formattedTotal.current} />
      </View>
      <ProgressBar
        orderType={orderType}
        length={
          screenWidth.current -
          (screenWidth.current * barsLengthPercentage) / 100
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dataRow: {
    minHeight: 18,
  },
  dataValues: {
    paddingHorizontal: 6,
    flexDirection: "row",
    width: "100%",
  },
  progressBar: {
    position: "absolute",
    left: 0,
    width: "100%",
    zIndex: -1,
    opacity: 0.2,
    height: "100%",
  },
});

export const DataRow = React.memo(
  _DataRow,
  (prevProps, newProps) =>
    prevProps.barsLengthPercentage === newProps.barsLengthPercentage &&
    prevProps.orderType === newProps.orderType &&
    prevProps.price === newProps.price &&
    prevProps.size === newProps.size &&
    prevProps.total === newProps.total
);
