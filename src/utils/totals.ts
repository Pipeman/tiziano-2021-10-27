import {
  OrdersMap,
  OrderType,
  PriceList,
  TotalBarsLengthMap,
  TotalsList,
} from "../@types/orderbook/Orderbook";

export const getTotals = (
  priceList: PriceList,
  ordersMap: OrdersMap,
  orderType: OrderType
): TotalsList => {
  const prices = orderType === "BIDS" ? [...priceList].reverse() : priceList;
  const totals = prices.reduce<TotalsList>((acc, currentPrice, idx) => {
    if (!ordersMap[currentPrice]) {
      return acc[idx - 1] ? acc.concat(acc[idx - 1]) : acc.concat(0);
    }
    if (idx === 0) {
      return acc.concat(ordersMap[currentPrice]);
    }
    return acc.concat(acc[idx - 1] + ordersMap[currentPrice]);
  }, []);

  return orderType === "BIDS" ? totals.reverse() : totals;
};

export const getTotalBarsLengthMap = (totals: number[]): TotalBarsLengthMap => {
  const sortedTotals = totals.sort((totalA, totalB) => totalB - totalA);
  const higherTotal = sortedTotals[0];
  const totalLengthMap: TotalBarsLengthMap = {};
  sortedTotals.forEach((total: number) => {
    totalLengthMap[total] = Math.ceil((100 * total) / higherTotal);
  });

  return totalLengthMap;
};
