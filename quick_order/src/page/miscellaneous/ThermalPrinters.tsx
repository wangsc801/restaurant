import React, { useEffect, useState } from 'react';
import config from '../../config';
import './ThermalPrinters.css';

const ThermalPrinters: React.FC = () => {
  const [printerInfos, setPrinterInfos] = useState<{
    printerName: string;
    connectionType: string;
    assignedStalls: string[];
  }[]>([]);
  // const [printerNames, setPrinterNames] = useState<string[]>([]);
  const [selectedPrinters, setSelectedPrinters] = useState<string[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = '热敏打印机打印消息';
  }, []);

  // 获取打印机名称列表
  useEffect(() => {
    // const fetchPrinterNames = async () => {
    const fetchPrinterInfos = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/thermal-printer/get-all-configs`);
        if (!response.ok) throw new Error('获取打印机列表失败');
        const data = await response.json();
        setPrinterInfos(data);
      } catch (error) {
        alert('获取打印机列表失败');
      }
    };

    fetchPrinterInfos();
  }, []);

  // 处理打印机选择
  const handlePrinterToggle = (printerName: string) => {
    // 检查打印机是否存在于printerInfos中
    const printerExists = printerInfos
      .some(printer => printer.printerName === printerName);
    if (!printerExists) {
      return;
    }
    setSelectedPrinters(prev =>
      prev.includes(printerName)
        ? prev.filter(name => name !== printerName)
        : [...prev, printerName]
    );
  };

  // 处理打印请求
  const handlePrint = async () => {
    if (selectedPrinters.length === 0) {
      alert('请选择至少一个打印机');
      return;
    }

    if (!messageText.trim()) {
      alert('请输入要打印的内容');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/thermal-printer/print-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          printers: selectedPrinters,
          message: messageText,
        }),
      });

      if (!response.ok) throw new Error('打印失败');
      alert('打印请求已发送');
      setMessageText('');
    } catch (error) {
      alert('打印失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="thermal-printers">
      <div className="printer-section">
        <h2 className="section-title">选择打印机</h2>
        <div className="printer-buttons">
          {printerInfos.map(printer => (
            <button
              key={printer.printerName}
              className={`printer-button ${selectedPrinters.includes(printer.printerName) ? 'selected' : ''
                }`}
              onClick={() => handlePrinterToggle(printer.printerName)}
            >
              {printer.printerName}
              <br />
              {printer.connectionType}
              <br />
              {printer.assignedStalls && printer.assignedStalls.join(', ')}
            </button>
          ))}
        </div>
      </div>

      <div className="printer-section">
        <h2 className="section-title">打印内容</h2>
        <textarea
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          rows={4}
          className="message-textarea"
          placeholder="请输入要打印的内容"
        />
      </div>

      <button
        className="print-button"
        onClick={handlePrint}
        disabled={loading || selectedPrinters.length === 0 || !messageText.trim()}
      >
        {loading ? '打印中...' : '确认打印'}
      </button>
    </div>
  );
};

export default ThermalPrinters;
