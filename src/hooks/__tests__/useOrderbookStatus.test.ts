import { act, renderHook } from "@testing-library/react-hooks";
import { OrderbookDataDelta } from "../../@types/orderbook/Orderbook";
import { useOrderbookStatus } from "../useOrderbookStatus";

const mockUpdateFn = jest.fn();

afterEach(jest.resetAllMocks);

it("should not call the update function if orders delta are undefined", () => {
  renderHook<undefined, void>(() =>
    useOrderbookStatus({
      ordersDelta: undefined,
      sortedPrices: [10, 12],
      ordersMap: { 10: 6, 12: 9 },
      updateFn: mockUpdateFn,
    })
  );

  expect(mockUpdateFn).not.toHaveBeenCalled();
});

it("should not call the update function when ordersUpdate does not change", () => {
  let ordersDelta: OrderbookDataDelta["asks"] = [
    [10, 34],
    [12.5, 2],
    [13, 56],
  ];
  const { rerender } = renderHook<undefined, void>(() =>
    useOrderbookStatus({
      ordersDelta,
      sortedPrices: [10, 12],
      ordersMap: { 10: 6, 12: 9 },
      updateFn: mockUpdateFn,
    })
  );

  expect(mockUpdateFn).toHaveBeenCalledWith([10, 12, 12.5, 13], {
    10: 34,
    12: 9,
    12.5: 2,
    13: 56,
  });

  act(rerender);
  expect(mockUpdateFn).toHaveBeenCalledTimes(1);
});
