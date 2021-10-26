import { useEffect } from "react";
import {
  OrderbookDataDelta,
  OrderbookDataSnapshot,
  OrdersMap,
  PriceList,
} from "../@types/orderbook/Orderbook";
import { getOrdersStatus } from "../utils/getOrderStatus";

export interface Args {
  ordersDelta?:
    | OrderbookDataSnapshot["asks" | "bids"]
    | OrderbookDataDelta["asks" | "bids"];
  sortedPrices: PriceList;
  ordersMap: OrdersMap;
  updateFn: (sortedPrices: PriceList, ordersMap: OrdersMap) => void;
}

export const useOrderbookStatus = ({
  ordersDelta: ordersUpdate,
  sortedPrices,
  ordersMap,
  updateFn,
}: Args) => {
  useEffect(() => {
    if (ordersUpdate) {
      const [newSortedPrices, newPricesMap] = getOrdersStatus(
        ordersUpdate,
        sortedPrices,
        ordersMap
      );

      updateFn(newSortedPrices, newPricesMap);
    }
  }, [ordersUpdate]);
};
