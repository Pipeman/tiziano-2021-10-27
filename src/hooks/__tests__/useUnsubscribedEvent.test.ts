import { renderHook } from "@testing-library/react-hooks";
import {
  ProductId,
  WSEventMessage,
} from "../../@types/orderbook/Orderbook";
import { useUnsubscribedEvent } from "../useUnsubscribedEvent";

const mockResetFn = jest.fn();

afterEach(jest.resetAllMocks);

it("should select 'PI_ETHUSD' when unsubscribed from 'PI_XBTUSD'", () => {
  let mockLastMessage: WSEventMessage = {
    event: "unsubscribed",
    feed: "book_ui_1",
    product_ids: ["PI_XBTUSD"],
  };
  renderHook(() => useUnsubscribedEvent(mockResetFn, mockLastMessage));

  expect(mockResetFn).toHaveBeenCalledWith<ProductId[]>("PI_ETHUSD");
});

it("should select 'PI_XBTUSD' when unsubscribed from 'PI_ETHUSD'", () => {
  let mockLastMessage: WSEventMessage = {
    event: "unsubscribed",
    feed: "book_ui_1",
    product_ids: ["PI_ETHUSD"],
  };
  renderHook(() => useUnsubscribedEvent(mockResetFn, mockLastMessage));

  expect(mockResetFn).toHaveBeenCalledWith<ProductId[]>("PI_XBTUSD");
});

it("should not execute resetFn if the event type is not 'unsubscribed'", () => {
  const mockLastMessage: WSEventMessage = {
    event: "unsubscribe",
    feed: "book_ui_1",
    product_ids: ["PI_XBTUSD"],
  };
  renderHook(() => useUnsubscribedEvent(mockResetFn, mockLastMessage));

  expect(mockResetFn).not.toHaveBeenCalled();
});

it("should not execute resetFn if last message is not defined", () => {
  renderHook(() => useUnsubscribedEvent(mockResetFn, undefined));

  expect(mockResetFn).not.toHaveBeenCalled();
});
