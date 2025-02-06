import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import OrderItemCard from "./OrderItemCard";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import config from "../config/config";
import { useTranslation } from 'react-i18next';
// Create a single shared audio instance
const audioInstances = {
  default: new Audio("/Luna.mp3"),
  // ding: new Audio("/Merope.mp3"),
  // hum: new Audio("/Corbalt.mp3"),
};

// Initialize audio instances
Object.values(audioInstances).forEach((audio) => {
  audio.preload = "auto";
  audio.volume = 1.0;
});

const OrderFlow = ({
  title = "Order Information Flow",
  ordersData = [],
  notificationSound = "default",
  onOrderItemUpdate,
}) => {
  const { t } = useTranslation();
  const [isMuted, setIsMuted] = useState(false);
  const prevOrdersLengthRef = React.useRef(ordersData.length);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    localStorage.setItem("orderNotificationsMuted", !isMuted);
  };

  // Load mute preference from localStorage
  useEffect(() => {
    const mutedPreference = localStorage.getItem("orderNotificationsMuted");
    if (mutedPreference !== null) {
      setIsMuted(mutedPreference === "true");
    }
  }, []);

  // Handle notification sound when ordersData changes
  useEffect(() => {
    if (ordersData.length > prevOrdersLengthRef.current && !isMuted) {
      const audio = audioInstances[notificationSound];
      audio.currentTime = 0;
      audio.play().catch((err) => {
        console.log("Audio playback failed:", err);
      });
    }
    prevOrdersLengthRef.current = ordersData.length;
  }, [ordersData, isMuted, notificationSound]);

  // Clean up audio instances on component unmount
  useEffect(() => {
    const socket = new SockJS(`${config.WS_URL}`);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        // console.log("Connected to WebSocket");
        client.subscribe(`/topic/order-item/update`, (message) => {
          const data = JSON.parse(message.body);
          onOrderItemUpdate(data.orderId, data.itemId, data.updates);
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
      }
    });

    client.activate();

    return () => {
      Object.values(audioInstances).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-gray-50 shadow-md">
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span className="text-3xl" title={t('orderFlow.home')}>🏠</span>
            </Link>
            <span className="text-gray-400">|</span>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 py-4">
              {title}
            </h1>
          </div>
          <button
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-gray-200"
            title={isMuted ? t('orderFlow.unmute') : t('orderFlow.mute')}
          >
            {isMuted ? (
              <span className="text-2xl">🔇</span>
            ) : (
              <span className="text-2xl">🔊</span>
            )}
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          {ordersData.map((order, index) => (
            <div
              key={`${order.createdAt}-${index}`}
              className="bg-white rounded-lg shadow-lg p-4 md:p-6 flex flex-col md:flex-row gap-4"
            >
              {/* Order Header */}
              <div className="md:w-36 flex md:flex-col gap-3 md:border-r md:border-gray-200 md:pr-4">
                <div className="text-xl md:text-2xl font-bold text-gray-700">
                  {/* {t('orderFlow.orderNumber', { number: String(order.orderNumber).padStart(3, "0") })} */}
                  {String(order.orderNumber).padStart(3, "0")}
                </div>
                <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-md font-semibold">
                  {moment(order.createdAt).format("MM-DD HH:mm")}
                </div>
                <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md text-md font-medium">
                  {order.paymentMethod}
                </div>
              </div>

              {/* Order Content */}
              <div className="flex-1">
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <OrderItemCard
                      key={item.id}
                      item={item}
                      orderId={order.id}
                    />
                  ))}
                </div>

                {order.remark && (
                  <div className="mt-4 bg-orange-50 text-orange-700 p-4 rounded-md flex items-center gap-2">
                    <span className="text-xl">📝</span>
                    {order.remark}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderFlow;
