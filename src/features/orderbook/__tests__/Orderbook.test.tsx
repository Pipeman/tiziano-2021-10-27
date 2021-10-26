import React from "react";
import WS from "jest-websocket-mock";
import {
  render,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import { WEBSOCKET_URL } from "../../../constants/websocket";
import { Orderbook } from "../Orderbook";

let ws: WS;

beforeEach(() => {
  WS.clean();
  ws = new WS(WEBSOCKET_URL);
});

afterEach(() => {
  cleanup();
});

it("should send subscription message to server when server is connected", async () => {
  await render(<Orderbook />);

  await ws.connected;
  await expect(ws).toReceiveMessage(
    JSON.stringify({
      event: "subscribe",
      feed: "book_ui_1",
      product_ids: ["PI_XBTUSD"],
    })
  );
});

it("should unsubscribe from the current feed and then subscribe to the new one when View button is pressed", async () => {
  const { findByA11yLabel } = await render(<Orderbook />);
  await ws.connected;

  const viewETHButton = await findByA11yLabel("View ETH");

  ws.send(
    JSON.stringify({
      event: "subscribed",
      feed: "book_ui_1",
      product_ids: ["PI_XBTUSD"],
    })
  );

  await expect(ws).toReceiveMessage(
    JSON.stringify({
      event: "subscribe",
      feed: "book_ui_1",
      product_ids: ["PI_XBTUSD"],
    })
  );
  await waitFor(() => fireEvent.press(viewETHButton));
  await waitFor(() =>
    expect(ws).toHaveReceivedMessages([
      JSON.stringify({
        event: "unsubscribe",
        feed: "book_ui_1",
        product_ids: ["PI_XBTUSD"],
      }),
    ])
  );

  await waitFor(() =>
    ws.send(
      JSON.stringify({
        event: "unsubscribed",
        feed: "book_ui_1",
        product_ids: ["PI_XBTUSD"],
      })
    )
  );

  expect(ws).toHaveReceivedMessages([
    JSON.stringify({
      event: "subscribe",
      feed: "book_ui_1",
      product_ids: ["PI_ETHUSD"],
    }),
  ]);
  expect(await findByA11yLabel("View BTC")).toBeTruthy();
});

it("should close the websocket and dispaly the reconnecting message when kill button is pressed", async () => {
  jest.setTimeout(10000);
  const { findByA11yLabel, findByText } = await render(<Orderbook />);
  await ws.connected;

  const killButton = await findByA11yLabel("Kill Feed");

  ws.send(
    JSON.stringify({
      event: "subscribed",
      feed: "book_ui_1",
      product_ids: ["PI_XBTUSD"],
    })
  );
  await waitFor(() => fireEvent.press(killButton));

  expect(
    await findByText(
      "There was a connection error, give us a moment to retry..."
    )
  ).toBeTruthy();
});
