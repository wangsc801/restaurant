import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import './OrderRecordRecentHours.css';
import { OrderRecord } from '../../types/Order';
import config from '../../config'

export default function OrderRecordRecentHours() {
  const { t } = useTranslation();
  const { hours } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState<OrderRecord[]>([]);

  useEffect(() => {
    document.title = '最近订单';
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const branchId = JSON.parse(localStorage.branch).id;
        const response = await fetch(
          `${config.API_BASE_URL}/api/order-record/get-recent-hours/${hours}/branch-id/${branchId}`
        );
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, [hours]);

  const handleHoursChange = (newHours: number) => {
    navigate(`/order-records/hours/${newHours}`);
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handleGoToMenu = () => {
    navigate('/menu');
  };

  const handlePrint = async (recordId: string) => {
    try {
      await fetch(`${config.API_BASE_URL}/api/order-record/${recordId}/print/times/1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error printing record:', error);
    }
  };

  return (
    <div className="order-records-container">
      <div className="navigation-buttons">
        <button onClick={handleBackToHome}>🏠</button>
        <button onClick={handleGoToMenu}>🍽️</button>
      </div>

      <div className="hours-selector">
        <button onClick={() => handleHoursChange(1)}>1h</button>
        <button onClick={() => handleHoursChange(4)}>4h</button>
        <button onClick={() => handleHoursChange(8)}>8h</button>
        <button onClick={() => handleHoursChange(24)}>24h</button>
      </div>

      <div className="records-grid">
        {records.map((record) => (
          <div key={record.orderNumber} className="record-card">
            <div className="record-header">
              <h3>{t('common.No')}: {record.orderNumber}</h3>
              <span>{dayjs(record.orderedAt).format('MM-DD HH:mm:ss')}</span>
            </div>

            <div className="order-items">
              {record.orderItems.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-header">
                    <h4>{item.title}</h4>
                    <span>x{item.quantity}</span>
                  </div>

                  <div className="item-details">
                    <p>{t('common.price')}: {item.price}</p>
                    {item.spiciness && (
                      <p>{t('menuRemark.spiciness')}: {item.spiciness}</p>
                    )}
                    {item.seasoning && item.seasoning.length > 0 && (
                      <p>{t('menuRemark.seasoning')}: {item.seasoning.join(', ')}</p>
                    )}
                    {item.ingredients && item.ingredients.length > 0 && (
                      <p>{t('menuRemark.ingredients')}: {item.ingredients}</p>
                    )}
                    {item.customRemark && (
                      <p>{t('menuRemark.customRemark')}: {item.customRemark}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="record-footer">
              <span>{t('common.total')}: </span>
              <b>{record.total}</b>
              <br />
              <p>{t('checkout.paymentMethod')}: {record.paymentMethod}</p>
              {record.remark && (
                <p>{t('common.remark')}: {record.remark}</p>
              )}
              <button
                className="print-button"
                onClick={() => record.id && handlePrint(record.id)}
              >
                🖨️ {t('common.print')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
