import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import useWebSocket from "react-use-websocket";

import {
  Groups,
  OrderbookDataDelta,
  OrderbookDataSnapshot,
  OrdersMap,
  PriceList,
  ProductId,
  WSEventMessage,
} from "../../@types/orderbook/Orderbook";
import { WEBSOCKET_URL } from "../../constants/websocket";
import { getTotalBarsLengthMap } from "../../utils/totals";
import { PricesTable } from "../../components/prices-table/PricesTable";
import { Header } from "../../components/header/Header";
import { useOrdersMemo } from "../../hooks/useOrdersMemo";
import { useOrderbookStatus } from "../../hooks/useOrderbookStatus";
import { useUnsubscribedEvent } from "../../hooks/useUnsubscribedEvent";
import {
  getWSSubscribeMessage,
  getWSUnsubscribeMessage,
} from "../../utils/websocket";

export const Orderbook = () => {
  const [selectedGrouping, setSelectedGrouping] = useState<Groups>(0.5);
  const [renderToken, setRenderToken] = useState(0);
  const askOrdersMapRef = useRef<OrdersMap>({});
  const sortedAskPricesRef = useRef<PriceList>([]);
  const bidOrdersMapRef = useRef<OrdersMap>({});
  const sortedBidPricesRef = useRef<PriceList>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductId>("PI_XBTUSD");

  const [sortedAskPrices, askOrdersMap] = useMemo(
    () => [sortedAskPricesRef.current, askOrdersMapRef.current],
    [renderToken]
  );

  const [sortedBidPrices, bidOrdersMap] = useMemo(
    () => [sortedBidPricesRef.current, bidOrdersMapRef.current],
    [renderToken]
  );

  const [shouldShowLoader, setShouldShowLoader] = useState<boolean>(false);

  const { sendMessage, lastJsonMessage, getWebSocket } = useWebSocket(
    WEBSOCKET_URL,
    {
      reconnectAttempts: 10,
      shouldReconnect: (event: CloseEvent) => {
        if (!event.wasClean) {
          return true;
        }
        return false;
      },
      onClose: () => {
        setShouldShowLoader(true);
      },
      onOpen: () => {
        sendMessage(getWSSubscribeMessage(selectedProduct));
        setShouldShowLoader(false);
        setRenderToken(new Date().valueOf());
      },
    }
  );

  const updateAskStatus = useCallback(
    (newSortedAskPrices, newAskPricesMap) => {
      sortedAskPricesRef.current = newSortedAskPrices;
      askOrdersMapRef.current = newAskPricesMap;
      setRenderToken(new Date().valueOf());
    },
    [lastJsonMessage]
  );
  const updateBidStatus = useCallback(
    (newSortedBidPrices, newBidPricesMap) => {
      sortedBidPricesRef.current = newSortedBidPrices;
      bidOrdersMapRef.current = newBidPricesMap;
      setRenderToken(new Date().valueOf());
    },
    [lastJsonMessage]
  );

  useOrderbookStatus({
    ordersDelta: (lastJsonMessage as OrderbookDataSnapshot | OrderbookDataDelta)
      ?.asks,
    sortedPrices: sortedAskPrices,
    ordersMap: askOrdersMap,
    updateFn: updateAskStatus,
  });
  useOrderbookStatus({
    ordersDelta: (lastJsonMessage as OrderbookDataSnapshot | OrderbookDataDelta)
      ?.bids,
    sortedPrices: sortedBidPrices,
    ordersMap: bidOrdersMap,
    updateFn: updateBidStatus,
  });

  useUnsubscribedEvent((newProduct) => {
    setSelectedGrouping(newProduct === "PI_XBTUSD" ? 0.5 : 0.05);
    setSelectedProduct(newProduct);
    sortedAskPricesRef.current = [];
    askOrdersMapRef.current = {};
    sortedBidPricesRef.current = [];
    bidOrdersMapRef.current = {};
    sendMessage(getWSSubscribeMessage(newProduct));
    setRenderToken(new Date().valueOf());
  }, lastJsonMessage as WSEventMessage);

  const [sortedBidPricesMemo, bidPricesMapMemo, sortedBidTotalsMemo] =
    useOrdersMemo(sortedBidPrices, bidOrdersMap, selectedGrouping, "BIDS");

  const [sortedAskPricesMemo, askPricesMapMemo, sortedAskTotalsMemo] =
    useOrdersMemo(sortedAskPrices, askOrdersMap, selectedGrouping, "ASKS");
  const totalBarsLengthMapMemo = useMemo(
    () =>
      getTotalBarsLengthMap([...sortedBidTotalsMemo, ...sortedAskTotalsMemo]),
    [sortedAskTotalsMemo, sortedBidTotalsMemo]
  );

  return (
    <View>
      <View style={styles.container}>
        <Header
          selectedGrouping={selectedGrouping}
          handleValueChange={(grouping) => setSelectedGrouping(grouping)}
          selectedProduct={selectedProduct}
        />
        <View style={{ paddingVertical: 6 }}>
          {shouldShowLoader ? (
            <>
              <Text style={{ color: "white" }}>
                There was a connection error, give us a moment to retry...
              </Text>
              <ActivityIndicator hidesWhenStopped={false} />
            </>
          ) : (
            <PricesTable
              bidList={sortedBidPricesMemo}
              bidMap={bidPricesMapMemo}
              bidTotals={sortedBidTotalsMemo}
              askList={sortedAskPricesMemo}
              askMap={askPricesMapMemo}
              askTotals={sortedAskTotalsMemo}
              barsLength={totalBarsLengthMapMemo}
            />
          )}
        </View>

        <View style={styles.buttonsContainer}>
          <Pressable
            style={styles.actionButton}
            onPress={() => {
              sendMessage(getWSUnsubscribeMessage(selectedProduct));
            }}
            accessibilityLabel={`View ${
              selectedProduct === "PI_XBTUSD" ? "ETH" : "BTC"
            }`}
          >
            <Text style={styles.buttonText}>
              View {selectedProduct === "PI_XBTUSD" ? "ETH" : "BTC"}
            </Text>
          </Pressable>
          <Pressable
            style={styles.dangerButton}
            onPress={() => {
              getWebSocket()?.close();
            }}
            accessibilityLabel="Kill Feed"
          >
            <Text style={styles.buttonText}>{"Kill Feed"}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    paddingVertical: 18,
  },
  dangerButton: {
    borderRadius: 6,
    backgroundColor: "rgb(200, 00, 10)",
    minHeight: 40,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  startButton: {
    borderRadius: 6,
    backgroundColor: "rgb(90, 226, 226)",
    minHeight: 40,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    borderRadius: 6,
    backgroundColor: "rgb(105, 74, 226)",
    minHeight: 40,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#FFF" },
});
