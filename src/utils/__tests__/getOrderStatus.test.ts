import { getOrdersStatus } from "../getOrderStatus";

it("should return empty data structures", () => {
  const [priceList, ordersMap] = getOrdersStatus([], [], {});
  expect(priceList).toEqual([]);
  expect(ordersMap).toEqual({});
});

it("should return data structures with delta if only delta is passed", () => {
  const [priceList, ordersMap] = getOrdersStatus(
    [
      [5, 3],
      [4.5, 7],
      [3, 10],
    ],
    [],
    {}
  );
  expect(priceList).toEqual([3, 4.5, 5]);
  expect(ordersMap).toEqual({
    5: 3,
    4.5: 7,
    3: 10,
  });
});

it("should remove zero size prices", () => {
  const [priceList, ordersMap] = getOrdersStatus(
    [
      [5, 3],
      [4.5, 7],
      [3, 0],
    ],
    [],
    {}
  );
  expect(priceList).toEqual([4.5, 5]);
  expect(ordersMap).toEqual({
    5: 3,
    [4.5]: 7,
  });
});

it("should update data structure when no prices overlap", () => {
  const [priceList, ordersMap] = getOrdersStatus(
    [
      [7, 3],
      [4.5, 7],
      [3, 0],
    ],
    [3.5, 4, 6],
    {
      [3.5]: 34,
      4: 9,
      6: 76,
    }
  );
  expect(priceList).toEqual([3.5, 4, 4.5, 6, 7]);
  expect(ordersMap).toEqual({
    7: 3,
    [4.5]: 7,
    [3.5]: 34,
    4: 9,
    6: 76,
  });
});

it("should update data structure when prices overlap", () => {
  const [priceList, ordersMap] = getOrdersStatus(
    [
      [7, 3],
      [4.5, 7],
      [3, 0],
    ],
    [4.5, 5, 6],
    {
      4.5: 34,
      5: 9,
      6: 76,
    }
  );
  expect(priceList).toEqual([4.5, 5, 6, 7]);
  expect(ordersMap).toEqual({
    7: 3,
    4.5: 7,
    5: 9,
    6: 76,
  });
});

it("should return the same data structures if delta is an empty array", () => {
  const [priceList, ordersMap] = getOrdersStatus([], [3.5, 4, 6], {
    [3.5]: 34,
    4: 9,
    6: 76,
  });
  expect(priceList).toEqual([3.5, 4, 6]);
  expect(ordersMap).toEqual({
    [3.5]: 34,
    4: 9,
    6: 76,
  });
});
