import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import OrderFlow from "../OrderFlow";
import config from "../../config/config";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { WebSocketService } from "../../services/WebSocketService";

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
    const wsService = new WebSocketService(setOrders);
    
    // Set initial order IDs after fetching orders
    wsService.setInitialOrderIds(orders);
    
    // Connect to WebSocket for each category
    wsService.connect(`/topic/orders/new/category/${category}/branch-id/${branchId}`);

    return () => {
      wsService.disconnect();
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
