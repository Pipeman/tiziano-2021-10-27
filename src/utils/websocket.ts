import {
  ProductId,
  WSEventMessage,
} from "../@types/orderbook/Orderbook";

export const getWSSubscribeMessage = (productId: ProductId) => {
  const eventMessage: WSEventMessage = {
    event: "subscribe",
    feed: "book_ui_1",
    product_ids: [productId],
  };
  return JSON.stringify(eventMessage);
};

export const getWSUnsubscribeMessage = (productId: ProductId) => {
  const eventMessage: WSEventMessage = {
    event: "unsubscribe",
    feed: "book_ui_1",
    product_ids: [productId],
  };
  return JSON.stringify(eventMessage);
};
