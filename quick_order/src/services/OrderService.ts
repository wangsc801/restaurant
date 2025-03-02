import { OrderItem, OrderRecord } from '../types/Order';
import config from '../config'

export async function createOrderRecord({
  orderItems,
  orderNumber,
  branch,
  employee,
  totalPrice,
  paymentMethod,
  remark,
  printReceipt
}: {
  orderItems: OrderItem[];
  orderNumber: number;
  branch: any;
  employee: any;
  totalPrice: number;
  paymentMethod: string;
  remark: string;
  printReceipt: boolean;
}): Promise<void> {
  const orderRecord: OrderRecord = {
    id: null, 
    orderItems,
    orderNumber,
    branchId: branch.id,
    employeeId: employee.id,
    total: totalPrice,
    paymentMethod,
    orderStatus: null,
    customerName: null,
    customerPhone: null,
    remark: remark,
    tableCode: null,
    isReservation: null,
    guestCount: null,
    orderedAt: new Date().toISOString()
  };

  await fetch(`${config.API_BASE_URL}/api/order-record/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Print-Receipt': printReceipt.toString(),
      'X-Print-Times': '2',
    },
    body: JSON.stringify(orderRecord)
  });
}