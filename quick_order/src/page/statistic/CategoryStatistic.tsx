import { useState, useEffect } from 'react';
import './CategoryStatistic.css'
import { useParams } from 'react-router-dom';
// import dayjs from 'dayjs';
interface SimpleMenuItemStatistic {
  menuItemTitle: string;
  quantity: number;
  total: number;
}

export default function CategoryStatistic() {

  const { date } = useParams();

  const [statisticMap, setStatisticMap] = useState<Record<string, SimpleMenuItemStatistic[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      // const formattedDate = dayjs().format('YYYY-MM-DD');
      const branchId = JSON.parse(localStorage.branch).id;
      const url = `http://192.168.2.39:8080/api/statistic/category/date/${date}/branch-id/${branchId}`;
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
    fetchData();
  }, []);

  return (
    <div className='container'>
      <div>CategoryStatistic</div>
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
    </div>
  );
}
