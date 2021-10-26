import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  OrdersMap,
  PriceList,
  TotalBarsLengthMap,
  TotalsList,
} from "../../@types/orderbook/Orderbook";
import { DataRow } from "../data-row/DataRow";

interface Props {
  bidList: PriceList;
  bidMap: OrdersMap;
  bidTotals: TotalsList;
  askList: PriceList;
  askMap: OrdersMap;
  askTotals: TotalsList;
  barsLength: TotalBarsLengthMap;
}

export const _PricesTable = ({
  bidList,
  bidMap,
  bidTotals,
  askList,
  askMap,
  askTotals,
  barsLength,
}: Props) => {
  return (
    <>
      <View style={styles.dataHeader}>
        <Text style={styles.dataTitle}>Price</Text>
        <Text style={styles.dataTitle}>Size</Text>
        <Text style={styles.dataTitle}>Total</Text>
      </View>
      <View>
        {bidList.map((price, idx) => (
          <DataRow
            price={price}
            size={bidMap[price]}
            total={bidTotals[idx]}
            barsLengthPercentage={barsLength[bidTotals[idx]]}
            orderType={"BIDS"}
            key={`BID-${price}`}
          />
        ))}
      </View>
      <View style={styles.separator} />
      <View>
        {askList.map((price, idx) => (
          <DataRow
            price={price}
            size={askMap[price]}
            total={askTotals[idx]}
            barsLengthPercentage={barsLength[askTotals[idx]]}
            orderType={"ASKS"}
            key={`ASK-${price}`}
          />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  dataHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    color: "#666",
    paddingHorizontal: 6,
  },
  dataTitle: {
    width: "33.3%",
    textAlign: "right",
    color: "#999",
    textTransform: "uppercase",
  },
  separator: { height: 18 },
});

export const PricesTable = React.memo(_PricesTable);
