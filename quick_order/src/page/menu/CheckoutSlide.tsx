import { OrderItem } from '../../types/Order';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { createOrderRecord } from '../../services/OrderService';
import './CheckoutSlide.css';
import config from '../../config'

interface CheckoutSlideProps {
  orderItems: OrderItem[];
  totalPrice: number;
  paymentMethod: string | null;
  onClose: () => void;
  onConfirm: () => void;
  onPaymentMethodChange: (method: string) => void;
  isOpen: boolean;
}

const CheckoutSlide = ({ orderItems, totalPrice, paymentMethod, onClose, onConfirm, onPaymentMethodChange, isOpen }: CheckoutSlideProps) => {
  const { t } = useTranslation();
  const [orderCountToday, setOrderCountToday] = useState(0);
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [remark, setRemark] = useState('');
  const [printReceipt, setPrintReceipt] = useState(true);
  // const [showPrinterError, setShowPrinterError] = useState(false);

  const localStorageBranch = localStorage.getItem('branch');
  const branch = localStorageBranch ? JSON.parse(localStorageBranch) : null;
  const localStorageEmployee = localStorage.getItem('employee');
  const employee = localStorageEmployee ? JSON.parse(localStorageEmployee) : null;

  useEffect(() => {
    fetchOrderCount();
  }, []);

  const fetchOrderCount = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/order-quantity-of-date/today/branch-id/` + branch.id);
      const data = await response.json();
      setOrderCountToday(data);
    } catch (error) {
      console.error('Error fetching order count:', error);
    }
  };

  const handleConfirm = async () => {
    if (!paymentMethod) {
      setShowPaymentError(true);
      setTimeout(() => setShowPaymentError(false), 3000);
      return;
    }

    try {
      const payment = t(`checkout.${paymentMethod}`);
      // Get new order count first
      const response = await fetch(`${config.API_BASE_URL}/api/order-quantity-of-date/today-add-one/branch-id/` + branch.id,
        { method: 'POST' });
      const newCount = await response.json();
      setOrderCountToday(newCount);

      // Create order record
      await createOrderRecord({
        orderItems,
        orderNumber: newCount,
        branch: branch,
        employee,
        totalPrice,
        paymentMethod: payment,
        remark: remark,
        printReceipt: printReceipt
      });
      onConfirm();
    } catch (error) {
      console.error('Order submission error:', error);
    }
  };

  const paymentMethods = ['cash', 'pending', 'mobile', 'points', 'other'];

  return (
    <div className={`checkout-slide ${isOpen ? 'open' : ''}`}>
      <div className="checkout-slide-content">
        <h2>{t('menu.orderSummary')}</h2>
        <div className="orders-list">
          {orderItems.map((order, index) => (
            <div key={index} className="order-summary-item">
              <div className="order-summary-header">
                <span className="order-name">{order.title}</span>
                <span className="order-quantity">×{order.quantity}</span>
                <span className="order-price">{(order.price * order.quantity).toFixed(2)}</span>
              </div>
              {((order.seasoning?.length > 0) ||
                (order.ingredients?.length > 0) ||
                order.customRemark) && (
                  <div className="order-summary-remarks">
                    {order.seasoning?.map(item => <span key={item}>{item}</span>)}
                    {order.ingredients?.map(item => <span key={item}>{item}</span>)}
                    {order.customRemark && <span>{order.customRemark}</span>}
                  </div>
                )}
            </div>
          ))}
        </div>

        <div className="checkout-slide-total">
          <div className="total-row">
            <span>{t('checkout.totalPrice')}</span>
            <span className="total-amount">
              {orderItems.reduce((sum, order) =>
                sum + (order.price * order.quantity), 0).toFixed(2)}
            </span>
          </div>
        </div>
        <div className="payment-methods">
          <h3>{t('checkout.paymentMethod')}</h3>
          <div className="payment-options">
            {paymentMethods.map(method => (
              <button
                key={method}
                className={`payment-option ${paymentMethod === method ? 'active' : ''}`}
                onClick={() => onPaymentMethodChange(method)}
              >
                {t(`checkout.${method}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="print-receipt-section">
          <label className="print-receipt-checkbox">
            <input
              type="checkbox"
              checked={printReceipt}
              onChange={(e) => setPrintReceipt(e.target.checked)}
            />
            {t('checkout.printReceipt')}
          </label>
        </div>
        <div className="remark-section">
          <h3>{t('menu.remarks')}</h3>
          <textarea
            className="remark-input"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder={t('menuRemark.customRemarkPlaceholder')}
            rows={3}
          />
        </div>

        <span>{orderCountToday}</span>

        <div className="checkout-slide-actions">
          <button className="back-button" onClick={onClose}>
            {t('common.back')}
          </button>
          <button
            className={`confirm-button ${!paymentMethod ? 'disabled' : ''}`}
            onClick={handleConfirm}
          >
            {t('common.confirm')}
          </button>
        </div>
      </div>

      {showPaymentError && (
        <div className="error-message">
          {t('checkout.selectPaymentMethod')}
        </div>
      )}
      {
      /*showPrinterError && (
        <div className="error-message">
          {t('checkout.printerError')}
        </div>
      )*/
      }
    </div>
  );
};

export default CheckoutSlide; 