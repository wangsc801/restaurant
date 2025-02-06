import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderFlow from "../OrderFlow";
import config from "../../config/config";

const RecentOrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const branchId = localStorage.getItem("branchId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${config.API_BASE_URL}/api/order-record/get-recent-quantity/100/branch-id/${branchId}`
        );
        setOrders(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again later.");
      }
    };

    // Initial fetch
    fetchOrders();
  }, [branchId]);

  // Handle WebSocket updates
  const handleOrderItemUpdate = (orderId, itemId, updates) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            orderItems: order.orderItems.map((item) =>
              item.id === itemId ? { ...item, ...updates } : item
            ),
          };
        }
        return order;
      })
    );
  };

  if (error) {
    return (
      <div
        className="error-message"
        style={{
          textAlign: "center",
          padding: "20px",
          color: "#e74c3c",
          fontSize: "1.2em",
          fontWeight: "500",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <OrderFlow
      title="Recent Orders"
      ordersData={orders}
      notificationSound="default"
      onOrderItemUpdate={handleOrderItemUpdate}
    />
  );
};

export default RecentOrdersView;
