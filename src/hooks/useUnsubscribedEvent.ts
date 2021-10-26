import { useEffect } from "react";
import {
  ProductId,
  WSEventMessage,
} from "../@types/orderbook/Orderbook";

export const useUnsubscribedEvent = (
  resetFn: (newProduct: ProductId) => void,
  lastMessage?: WSEventMessage
) => {
  useEffect(() => {
    if (lastMessage?.event === "unsubscribed") {
      const newProduct = lastMessage.product_ids.includes("PI_XBTUSD")
        ? "PI_ETHUSD"
        : "PI_XBTUSD";
      resetFn(newProduct);
    }
  }, [lastMessage]);
};
