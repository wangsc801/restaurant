import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import OrderFlow from "../OrderFlow";
import config from "../../config/config";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const CategoriesOrdersView = () => {
  const { categories } = useParams();
  const targetCategories = categories ? categories.split("&") : [];
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const subscriptions = useRef(new Map());
  const orderIdsRef = useRef(new Set());

  const branchId = localStorage.getItem("branchId");

  // Initial fetch of orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${config.API_BASE_URL}/api/order-record/get-recent/200/categories/${categories}/branch-id/${branchId}`
        );
        const initialOrders = response.data;
        orderIdsRef.current = new Set(initialOrders.map(order => order.id));
        setOrders(initialOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders whenever orders change
  useEffect(() => {
    const filtered = orders
      .map((order) => ({
        ...order,
        orderItems: order.orderItems.filter((item) =>
          item.categories?.some((categ) =>
            targetCategories.includes(decodeURIComponent(categ))
          )
        ),
      }))
      .filter((order) => order.orderItems.length > 0);

    setFilteredOrders(filtered);
  }, [orders]);

  // WebSocket connection
  useEffect(() => {
    let stompClient = null;

    const unsubscribeAll = () => {
      subscriptions.current.forEach(subscription => subscription.unsubscribe());
      subscriptions.current.clear();
    };

    const connectWebSocket = () => {
      const socket = new SockJS(`${config.WS_URL}`);
      const client = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          console.log("Connected to WebSocket");
          unsubscribeAll();

          // Subscribe to new orders for each category
          targetCategories.forEach((category) => {
            const subscription = client.subscribe(
              `/topic/orders/new/category/${category}/branch-id/${branchId}`,
              (message) => {
                const newOrder = JSON.parse(message.body);
                // console.log("New order received:", newOrder);
                
                // Only add the order if it's not already in the list
                if (!orderIdsRef.current.has(newOrder.id)) {
                  orderIdsRef.current.add(newOrder.id);
                  setOrders(prevOrders => [newOrder, ...prevOrders]);
                }
              }
            );
            subscriptions.current.set(category, subscription);
          });

          // Subscribe to order item updates
          const updateSubscription = client.subscribe(
            `/topic/order-item/update`,
            (message) => {
              const data = JSON.parse(message.body);
              console.log("Order item update received:", data);
              setOrders(prevOrders =>
                prevOrders.map((order) => {
                  if (order.id === data.orderId) {
                    return {
                      ...order,
                      orderItems: order.orderItems.map((item) =>
                        item.id === data.itemId
                          ? { ...item, ...data.updates }
                          : item
                      ),
                    };
                  }
                  return order;
                })
              );
            }
          );
          subscriptions.current.set('updates', updateSubscription);
        },
        onDisconnect: () => {
          console.log("Disconnected from WebSocket");
          unsubscribeAll();
        },
        onStompError: (frame) => {
          console.error("STOMP error:", frame);
          unsubscribeAll();
        },
      });

      client.activate();
      stompClient = client;
    };

    connectWebSocket();

    return () => {
      unsubscribeAll();
      if (stompClient && stompClient.connected) {
        stompClient.deactivate();
      }
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <OrderFlow
      title={targetCategories.join(", ")}
      ordersData={filteredOrders}
    />
  );
};

export default CategoriesOrdersView;
