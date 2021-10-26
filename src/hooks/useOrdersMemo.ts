import { useMemo } from "react";
import { ORDERS_QUEUE_SIZE } from "../constants/display";
import {
  Groups,
  OrdersMap,
  OrderType,
  PriceList,
  TotalsList,
} from "../@types/orderbook/Orderbook";
import { getTotals } from "../utils/totals";

export const useOrdersMemo = (
  sortedOrderPrices: PriceList,
  orderPricesMap: OrdersMap,
  selectedGroup: Groups,
  orderType: OrderType
): [PriceList, OrdersMap, TotalsList] => {
  const lastTimestamp = Math.floor(Date.now() / 1000);

  const [sortedOrderPricesMemo, orderPricesMapMemo] = useMemo(() => {
    let grouppedPrices: PriceList = [];
    let grouppedPricesMap: OrdersMap = {};
    sortedOrderPrices.forEach((price) => {
      const roundingFunction = orderType === "BIDS" ? Math.floor : Math.ceil;
      const grouppedPrice =
        roundingFunction(price / selectedGroup) * selectedGroup;
      grouppedPrices = [...grouppedPrices, grouppedPrice];
      const size = orderPricesMap[price];
      grouppedPricesMap[grouppedPrice] =
        size + (grouppedPricesMap[grouppedPrice] || 0);
    });

    grouppedPrices = [...new Set(grouppedPrices)];
    const initialSliceIdx =
      orderType === "BIDS" ? grouppedPrices.length - ORDERS_QUEUE_SIZE : 0;
    const finalSliceIdx = orderType === "BIDS" ? undefined : ORDERS_QUEUE_SIZE;
    grouppedPrices = grouppedPrices.slice(initialSliceIdx, finalSliceIdx);

    return [grouppedPrices, grouppedPricesMap];
  }, [lastTimestamp, selectedGroup]);

  const bidsTotalsOrderedMemo = useMemo(
    () => getTotals(sortedOrderPricesMemo, orderPricesMapMemo, orderType),
    [sortedOrderPricesMemo, orderPricesMapMemo]
  );

  return [sortedOrderPricesMemo, orderPricesMapMemo, bidsTotalsOrderedMemo];
};
