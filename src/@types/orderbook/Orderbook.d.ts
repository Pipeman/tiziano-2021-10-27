export type Orders = [number, number][];

export type ProductId = "PI_XBTUSD" | "PI_ETHUSD";
interface WSEventMessage {
  event: "subscribe" | "unsubscribe" | "subscribed" | "unsubscribed" | "info";
  feed?: "book_ui_1";
  product_ids?: ProductId[];
  version?: number;
}
export interface OrderbookData {
  product_id: ProductId;
  bids: Orders;
  asks: Orders;
}

export interface OrderbookDataSnapshot extends OrderbookData {
  feed: "book_ui_1_snapshot";
  numLevels: number;
}

export interface OrderbookDataDelta extends OrderbookData {
  feed: "book_ui_1";
  bids?: Orders;
  asks?: Orders;
}

export interface OrdersMap {
  [price: number]: number;
}

export interface TotalBarsLengthMap {
  [total: number]: number;
}

export type PriceList = number[];
export type TotalsList = number[];
export type OrderType = "BIDS" | "ASKS";

type BTCGroups = 0.5 | 1 | 2.5;
type ETHGroups = 0.05 | 0.1 | 0.25;

type Groups = BTCGroups | ETHGroups;
