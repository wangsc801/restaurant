import { useState, useEffect } from 'react';
import './CategoryStatistic.css'
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
// import dayjs from 'dayjs';
interface SimpleMenuItemStatistic {
  menuItemTitle: string;
  quantity: number;
  total: number;
}

export default function CategoryStatistic() {

  const { date } = useParams();
  const navigate = useNavigate();

  const [statisticMap, setStatisticMap] = useState<Record<string, SimpleMenuItemStatistic[]>>({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const branchId = JSON.parse(localStorage.branch).id;
    const fetchData = async () => {
      // const formattedDate = dayjs().format('YYYY-MM-DD');
      const url = `http://localhost:8080/api/statistic/category/date/${date}/branch-id/${branchId}`;
      const response = await fetch(url)
      const data = await response.json()
      // // 转换数据结构
      // const transformedData = Object.keys(data).map((category) => ({
      //   category,
      //   statisticArray: data[category],
      // }));

      // console.log(transformedData); // 确保转换后的数据正确
      // setStatisticMap(transformedData);
      setStatisticMap(data);
    }
    const fetchTotal = async () => {
      const url = `http://localhost:8080/api/statistic/total/date/${date}/branch-id/${branchId}`;
      const response = await fetch(url);
      const total = await response.json()
      setTotal(total);
    }
    fetchData();
    fetchTotal();
  }, [date]);

  const handlePreviousDay = () => {
    const previousDay = dayjs(date).subtract(1, 'day').format('YYYY-MM-DD');
    navigate(`/category-statistics/${previousDay}`);
  };

  const handleNextDay = () => {
    const nextDay = dayjs(date).add(1, 'day').format('YYYY-MM-DD');
    navigate(`/category-statistics/${nextDay}`);
  };

  const handleBackToMenu = () =>{
    navigate(`/menu`);
  }
  const isToday = dayjs(date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');

  return (
    <div className='container'>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px'}}>
        <button onClick={handleBackToMenu}>Back</button>
      </div>
      {Object.keys(statisticMap).length > 0 ? (
        Object.entries(statisticMap).map(([category, statisticArray]) => {
          // 计算 Quantity 和 Total 的总计
          const totalQuantity = statisticArray.reduce((sum, item) => sum + item.quantity, 0);
          const totalSum = statisticArray.reduce((sum, item) => sum + item.total, 0);

          return (
            <div key={category}>
              <h3 style={{ textAlign: "center" }}>{category}</h3>
              <table style={{ borderCollapse: "collapse", width: "30vw", margin: "0 auto" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Menu Item</th>
                    <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Quantity</th>
                    <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {statisticArray.map((menuItem) => (
                    <tr key={menuItem.menuItemTitle}>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{menuItem.menuItemTitle}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{menuItem.quantity}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{menuItem.total}</td>
                    </tr>
                  ))}
                  {/* 添加总计行 */}
                  <tr style={{ fontWeight: "bold", background: "#f0f0f0" }}>
                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>Total:</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{totalQuantity}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{totalSum.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })
      ) : (
        <p>No statistics available.</p>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px'}}>
        <span>{date && date+": "}</span>
        <span style={{ fontWeight: 'bold'}} >{total}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={handlePreviousDay}>Previous Day</button>
        <button onClick={handleNextDay} disabled={isToday}>Next Day</button>
      </div>
    </div>
  );
}
