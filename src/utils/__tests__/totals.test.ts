import { getTotalBarsLengthMap, getTotals } from "../totals";

describe("getTotals", () => {
  it("should return empty array if prices array is empty", () => {
    const totals = getTotals([], {}, "ASKS");

    expect(totals).toEqual([]);
  });

  it("should return an array with a 0 if orders map is empty", () => {
    const totals = getTotals([98], {}, "ASKS");

    expect(totals).toEqual([0]);
  });

  it("should assume a size 0 in place of a price without size", () => {
    const totals = getTotals([98, 100, 101], { 98: 87, 101: 3 }, "ASKS");

    expect(totals).toEqual([87, 87, 90]);
  });

  it("should set the first element of totals with the size of the first price", () => {
    const totals = getTotals([98, 100, 101], { 101: 3, 98: 8 }, "ASKS");

    expect(totals[0]).toEqual(8);
  });

  it("should return an array where the element at the current index is the sum of its size and the previous element", () => {
    const totals = getTotals(
      [67832, 67833.5, 67834],
      { 67832: 3, 67833.5: 8, 67834: 10 },
      "ASKS"
    );

    expect(totals).toEqual([3, 11, 21]);
  });

  it("should return a reversed array when orders are bids", () => {
    const totals = getTotals(
      [67832, 67833.5, 67834],
      { 67832: 3, 67833.5: 8, 67834: 10 },
      "BIDS"
    );

    expect(totals).toEqual([21, 18, 10]);
  });
});

describe("getTotalBarsLengthMap", () => {
  it("should return an empty object when it receives an empty array", () => {
    expect(getTotalBarsLengthMap([])).toEqual({});
  });

  it("should return a map where the highest value is 100 and is assigned to the highest key", () => {
    expect(getTotalBarsLengthMap([89])).toEqual({ 89: 100 });
    expect(getTotalBarsLengthMap([89, 98, 3])).toEqual({
      98: 100,
      89: 91,
      3: 4,
    });
  });
});
