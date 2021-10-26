import { renderHook } from "@testing-library/react-hooks";
import { ORDERS_QUEUE_SIZE } from "../../constants/display";
import { useOrdersMemo } from "../useOrdersMemo";

const sortedArray = [
  9, 9.5, 12, 15, 16.5, 17, 19, 20, 23, 23.5, 29, 31, 34, 34.5, 78, 79, 79.5,
  90, 98,
];

const pricesMap = {
  9: 2,
  9.5: 20,
  12: 1,
  15: 18,
  16.5: 2,
  17: 9,
  19: 9,
  20: 20,
  23: 23,
  23.5: 13,
  29: 3,
  31: 90,
  34: 6,
  34.5: 4,
  78: 10,
  79: 3,
  79.5: 12,
  90: 9,
  98: 1,
};

describe("sorted prices list", () => {
  it("should return an empty array when passed an empty array", () => {
    const { result } = renderHook(() => useOrdersMemo([], {}, 0.5, "ASKS"));

    expect(result.current[0]).toEqual([]);
  });

  it("should remove duplicates from the returned sorted prices array", () => {
    const { result } = renderHook(() =>
      useOrdersMemo(
        [34, 34.5, 78, 79, 79.5],
        { 34: 6, 34.5: 4, 78: 10, 79: 3, 79.5: 12 },
        1,
        "BIDS"
      )
    );

    expect(result.current[0]).toEqual([34, 78, 79]);
  });

  it("should return the first ORDERS_QUEUE_SIZE elements if ASKS and values should be rounded with ceil", () => {
    const { result } = renderHook(() =>
      useOrdersMemo(sortedArray, pricesMap, 1, "ASKS")
    );

    expect(result.current[0].length).toEqual(ORDERS_QUEUE_SIZE);
    expect(result.current[0]).toEqual([
      9, 10, 12, 15, 17, 19, 20, 23, 24, 29, 31, 34, 35,
    ]);
  });

  it("should return the last ORDERS_QUEUE_SIZE elements if BIDS and values should be rounded with floor", () => {
    const { result } = renderHook(() =>
      useOrdersMemo(sortedArray, pricesMap, 1, "BIDS")
    );

    // expect(result.current[0].length).toEqual(ORDERS_QUEUE_SIZE);
    expect(result.current[0]).toEqual([
      15, 16, 17, 19, 20, 23, 29, 31, 34, 78, 79, 90, 98,
    ]);
  });
});

describe("orders map", () => {
  it("should return an empty object when passed an empty array", () => {
    const { result } = renderHook(() => useOrdersMemo([], {}, 0.5, "ASKS"));

    expect(result.current[1]).toEqual({});
  });

  it("should return a map where the value of each key is the sum of the un-groupped map prices in their respective price group", () => {
    const { result } = renderHook(() =>
      useOrdersMemo(sortedArray, pricesMap, 1, "BIDS")
    );

    expect(result.current[1]).toEqual({
      9: 22,
      12: 1,
      15: 18,
      16: 2,
      17: 9,
      19: 9,
      20: 20,
      23: 36,
      29: 3,
      31: 90,
      34: 10,
      78: 10,
      79: 15,
      90: 9,
      98: 1,
    });
  });

  it("should ceil the groupped prices when order type is ASKS", () => {
    const { result } = renderHook(() =>
      useOrdersMemo(sortedArray, pricesMap, 1, "ASKS")
    );

    expect(result.current[1]).toEqual({
      9: 2,
      10: 20,
      12: 1,
      15: 18,
      17: 11,
      19: 9,
      20: 20,
      23: 23,
      24: 13,
      29: 3,
      31: 90,
      34: 6,
      35: 4,
      78: 10,
      79: 3,
      80: 12,
      90: 9,
      98: 1,
    });
  });
});

describe("totals list", () => {
  it("should return an empty object when passed an empty array", () => {
    const { result } = renderHook(() => useOrdersMemo([], {}, 0.5, "ASKS"));

    expect(result.current[1]).toEqual({});
  });

  it("should return an array where the totals are calculated based on the groupped prices", () => {
    const { result } = renderHook(() =>
      useOrdersMemo(sortedArray, pricesMap, 1, "BIDS")
    );

    expect(result.current[2]).toEqual([
      232, 214, 212, 203, 194, 174, 138, 135, 45, 35, 25, 10, 1,
    ]);
  });

  it("should return an array in reversed order when order type is ASKS", () => {
    const { result } = renderHook(() =>
      useOrdersMemo(sortedArray, pricesMap, 1, "ASKS")
    );

    expect(result.current[2]).toEqual([
      2, 22, 23, 41, 52, 61, 81, 104, 117, 120, 210, 216, 220,
    ]);
  });
});
