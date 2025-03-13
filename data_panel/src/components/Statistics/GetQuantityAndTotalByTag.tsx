import React, { useState } from 'react';
import './GetQuantityAndTotalByTag.css';
import dayjs from 'dayjs';
import axios from 'axios';

const GetQuantityAndTotalByTag: React.FC = () => {
    const [tag, setTag] = useState<string>('');
    const [date, setDate] = useState<dayjs.Dayjs>(dayjs());
    const [data, setData] = useState<any>(null);

    // 处理日期变化
    // const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    //     if (newDate) {
    //         setDate(newDate);
    //     }
    // };

    // 处理前一天按钮点击
    const handlePrevDay = () => {
        setDate(date.subtract(1, 'day'));
        if (tag) {
            setTimeout(fetchData, 0);
        }
    };

    // 处理后一天按钮点击
    const handleNextDay = () => {
        setDate(date.add(1, 'day'));
        if (tag) {
            setTimeout(fetchData, 0);
        }
    };

    // 处理日期变化
    const handleDateChange = (newDate: dayjs.Dayjs | null) => {
        if (newDate) {
            setDate(newDate);
            if (tag) {
                setTimeout(fetchData, 0);
            }
        }
    };

    // 获取数据
    const fetchData = async () => {
        if (!tag) {
            alert('请输入标签');
            return;
        }

        try {
            const formattedDate = date.format('YYYY-MM-DD');
            const response = await axios.get(
                `http://localhost:8080/api/statistic/tag/${tag}/date/${formattedDate}/branch-id/67a5734ed823f416daaa4b1b`
            );
            setData(response.data);
        } catch (error) {
            alert('获取数据失败');
            console.error(error);
        }
    };

    return (
        <div className="quantity-tag-container">
            <div className="quantity-tag-controls">
                <div className="quantity-tag-input-group">
                    <input 
                        placeholder="请输入标签" 
                        value={tag} 
                        onChange={(e) => setTag(e.target.value)}
                        className="quantity-tag-input"
                    />
                    <div className="quantity-tag-date-controls">
                        <button 
                            className="date-control-btn"
                            onClick={handlePrevDay}
                        >
                            上一天
                        </button>
                        <input
                            type="date"
                            value={date.format('YYYY-MM-DD')}
                            onChange={(e) => handleDateChange(dayjs(e.target.value))}
                            className="quantity-tag-datepicker"
                        />
                        <button 
                            className="date-control-btn"
                            onClick={handleNextDay}
                        >
                            下一天
                        </button>
                    </div>
                    <button
                        onClick={fetchData}
                        className="quantity-tag-submit"
                    >
                        确认
                    </button>
                </div>

                {data && (
                    <div className="quantity-tag-result">
                        <div className="result-content">
                            <table className="result-table">
                                <thead>
                                    <tr>
                                        <th>商品名称</th>
                                        <th>数量</th>
                                        <th>总金额</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item: {
                                        menuItemTitle: string;
                                        quantity: number;
                                        total: number;
                                    }, index: number) => (
                                        <tr key={index}>
                                            <td>{item.menuItemTitle}</td>
                                            <td>{item.quantity}</td>
                                            <td>¥{item.total.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td>总计</td>
                                        <td>{data.reduce((sum: number, item: { quantity: number }) => 
                                            sum + item.quantity, 0
                                        )}</td>
                                        <td>¥{data.reduce((sum: number, item: { total: number }) => 
                                            sum + item.total, 0
                                        ).toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GetQuantityAndTotalByTag;
