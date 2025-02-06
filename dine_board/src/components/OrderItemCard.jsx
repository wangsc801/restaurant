import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config/config";
import { useTranslation } from "react-i18next";

const OrderItemCard = ({ item, orderId }) => {
  const { t } = useTranslation();
  const [isPlatedLoading, setIsPlatedLoading] = useState(false);
  const [isDeliveredLoading, setIsDeliveredLoading] = useState(false);
  const [isPlated, setIsPlated] = useState(item.plated);
  const [isDelivered, setIsDelivered] = useState(item.delivered);

  const handlePlatedToggle = async () => {
    setIsPlatedLoading(true);
    try {
      const endpoint = isPlated ? "not-plated" : "plated";
      const api = `${config.API_BASE_URL}/api/order-record/${orderId}/order-item/${item.id}/${endpoint}`;
      const response = await axios.post(api);

      // if (response.data === !isPlated) {
      //   // Don't set the state here, wait for WebSocket update
      // }
    } catch (error) {
      console.error("Failed to update plated status:", error);
    } finally {
      setIsPlatedLoading(false);
    }
  };

  const handleDeliveredToggle = async () => {
    console.log("isDelivered", isDelivered);
    setIsDeliveredLoading(true);
    try {
      const endPoint = isDelivered ? "not-delivered" : "delivered";
      const api = `${config.API_BASE_URL}/api/order-record/${orderId}/order-item/${item.id}/${endPoint}`;
      const response = await axios.post(api);
      // if (response.data === !isDelivered) {
      //   setIsDelivered(!isDelivered);
      // } else {
      //   console.error("Server returned unexpected status");
      // }
    } catch (error) {
      console.error("Failed to update plated status:", error);
    } finally {
      setIsDeliveredLoading(false);
    }
  };

  // Add useEffect to handle prop updates
  useEffect(() => {
    if (item.plated !== undefined) {
      setIsPlated(item.plated);
    }
    if (item.delivered !== undefined) {
      setIsDelivered(item.delivered);
    }
  }, [item.plated, item.delivered]);

  return (
    <div
      className={`rounded-lg p-4 flex flex-col md:flex-row gap-4 ${
        isPlated ? "bg-yellow-200" : "bg-gray-50"
      }`}
    >
      {/* Item Details */}
      <div className="flex-1">
        <div className="flex justify-start items-center mb-2">
          {isDelivered && <span className="text-3xl">✅</span>}
          <span className="text-3xl font-extrabold text-gray-800">
            {item.title}
          </span>
          <span className="ml-3 text-2xl font-semibold text-red-600">
            {item.price}
          </span>
          {item.quantity > 1 && (
            <span className="ml-3 text-2xl font-semibold text-gray-600">
              x{item.quantity}
            </span>
          )}
        </div>

        {item.spiciness && (
          <div className="text-gray-600 ml-4 mb-1">
            <span className="font-semibold text-gray-700 mr-2">
              {t("orderItem.spiciness")}:
            </span>
            {item.spiciness}
          </div>
        )}

        {item.seasoning?.length > 0 && (
          <div className="text-gray-600 ml-4 mb-1">
            <span className="font-semibold text-gray-700 mr-2">
              {t("orderItem.seasoning")}:
            </span>
            {item.seasoning.join(", ")}
          </div>
        )}

        {item.ingredients?.length > 0 && (
          <div className="text-gray-600 ml-4 mb-1">
            <span className="font-semibold text-gray-700 mr-2">
              {t("orderItem.ingredients")}:
            </span>
            {item.ingredients.join(", ")}
          </div>
        )}

        {item.customRemark && (
          <div className="text-gray-600 ml-4 mb-1">
            <span className="font-semibold text-gray-700 mr-2">
              {t("orderItem.customRemark")}:
            </span>
            {item.customRemark}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex md:flex-col gap-2 md:w-28">
        <button
          onClick={handlePlatedToggle}
          disabled={isPlatedLoading}
          className={`flex-1 px-4 py-2 ${
            isPlatedLoading
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-blue-50 hover:bg-blue-100 text-blue-700"
          } rounded-md transition-colors`}
        >
          {isPlatedLoading
            ? t("orderItem.loading")
            : isPlated
            ? t("orderItem.notPlated")
            : t("orderItem.plated")}
        </button>
        <button
          onClick={handleDeliveredToggle}
          disabled={isDeliveredLoading}
          className="flex-1 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-md transition-colors"
        >
          {isDeliveredLoading
            ? t("orderItem.loading")
            : isDelivered
            ? t("orderItem.notDelivered")
            : t("orderItem.delivered")}
        </button>
      </div>
    </div>
  );
};

export default OrderItemCard;
