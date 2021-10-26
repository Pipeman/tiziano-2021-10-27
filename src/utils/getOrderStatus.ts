import {
  Orders,
  OrdersMap,
  PriceList,
} from "../@types/orderbook/Orderbook";

const sortOrders = (priceList: PriceList, direction: "ASC" | "DESC" = "ASC") =>
  priceList.sort((priceA, priceB) =>
    direction === "DESC" ? priceB - priceA : priceA - priceB
  );

export function getOrdersStatus(
  newOrdersDelta: Orders,
  prevPriceList: PriceList,
  prevOrdersMap: OrdersMap
): [PriceList, OrdersMap] {
  const deltaPriceList = newOrdersDelta.map(([price]) => price);

  const newOrdersDeltaMap = newOrdersDelta.reduce<OrdersMap>(
    (acc, [price, size]) => ({ ...acc, [price]: size }),
    {}
  );

  // Create array without duplicates
  let newSortedPriceList = [
    ...new Set([...prevPriceList, ...deltaPriceList]),
  ].filter((price) =>
    // Remove new deltas with size === 0
    typeof newOrdersDeltaMap[price] === "number"
      ? newOrdersDeltaMap[price] > 0
      : true
  );

  newSortedPriceList = sortOrders([...newSortedPriceList]);

  const newOrdersMap = newSortedPriceList.reduce<OrdersMap>((acc, price) => {
    acc[price] = newOrdersDeltaMap[price] || prevOrdersMap[price];
    return acc;
  }, {});

  return [newSortedPriceList, newOrdersMap];
}
