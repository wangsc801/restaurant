import { OrderItem, OrderRecord } from '../types/Order';

export async function createOrderRecord({
  orderItems,
  orderNumber,
  branch,
  employee,
  totalPrice,
  paymentMethod,
  remark
}: {
  orderItems: OrderItem[];
  orderNumber: number;
  branch: any;
  employee: any;
  totalPrice: number;
  paymentMethod: string;
  remark: string;
}): Promise<void> {
  const orderRecord: OrderRecord = {
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
    guestCount: null
  };

  await fetch('http://localhost:8080/api/order-record/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(orderRecord)
  });
} 