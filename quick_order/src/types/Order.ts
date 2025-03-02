export interface OrderDetails {
  itemId: string;
  itemName: string;
  price: number;
  categories: string[];
  remarks: {
    spiciness?: string;
    seasoning: string[];
    ingredients: string[];
    customRemark?: string;
  };
}

export interface OrderItem {
  id: string | null;
  menuItemId: string;
  title: string;
  price: number;
  quantity: number;
  categories: string[];
  spiciness?: string;
  seasoning: string[];
  ingredients: string[];
  customRemark?: string;
  plated: boolean | false;
  delivered: boolean | false;
}

export interface OrderRecord {
  id: string | null;
  orderItems: OrderItem[];
  orderNumber: number | null;
  branchId: string | null;
  employeeId: string | null;
  tableCode: string | null;
  isReservation: boolean | null;
  guestCount: number | null;
  total: number;
  paymentMethod: string | null;
  orderStatus: string | null;
  customerName: string | null;
  customerPhone: string | null;
  orderedAt: string | null;
  remark: string;
}