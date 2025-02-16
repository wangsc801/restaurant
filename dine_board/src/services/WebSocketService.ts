import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import config from "../config/config";

type OrderUpdateCallback = (orders: any[] | ((prevOrders: any[]) => any[])) => void;
type OrderItemUpdateCallback = (data: any) => void;

export class WebSocketService {
  private client: Client | null = null;
  private subscriptions = new Map();
  private orderIdsSet = new Set();

  constructor(
    private setOrders: OrderUpdateCallback,
    private onOrderItemUpdate?: OrderItemUpdateCallback
  ) {}

  connect(websocketUrl: string) {
    const socket = new SockJS(`${config.WS_URL}`);
    this.client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        this.unsubscribeAll();
        this.subscribeToOrders(websocketUrl);
        this.subscribeToOrderItemUpdates();
      },
      onDisconnect: () => {
        this.unsubscribeAll();
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        this.unsubscribeAll();
      },
    });

    this.client.activate();
  }

  private subscribeToOrders(websocketUrl: string) {
    const subscription = this.client?.subscribe(websocketUrl, (message) => {
      const newOrder = JSON.parse(message.body);
      if (!this.orderIdsSet.has(newOrder.id)) {
        this.orderIdsSet.add(newOrder.id);
        this.setOrders((prevOrders: any[]) => [newOrder, ...prevOrders]);
      }
    });
    if (subscription) {
      this.subscriptions.set('orders', subscription);
    }
  }

  private subscribeToOrderItemUpdates() {
    const subscription = this.client?.subscribe(
      `/topic/order-item/update`,
      (message) => {
        const data = JSON.parse(message.body);
        if (this.onOrderItemUpdate) {
          this.onOrderItemUpdate(data);
        } else {
          this.setOrders((prevOrders: any[]) =>
            prevOrders.map((order) => {
              if (order.id === data.orderId) {
                return {
                  ...order,
                  orderItems: order.orderItems.map((item: any) =>
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
      }
    );
    if (subscription) {
      this.subscriptions.set('updates', subscription);
    }
  }

  setInitialOrderIds(orders: any[]) {
    this.orderIdsSet = new Set(orders.map(order => order.id));
  }

  unsubscribeAll() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions.clear();
  }

  disconnect() {
    this.unsubscribeAll();
    if (this.client?.connected) {
      this.client.deactivate();
    }
  }
}
