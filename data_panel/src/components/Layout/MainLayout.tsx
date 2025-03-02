import React from 'react';
import { Outlet } from 'react-router-dom';
import './MainLayout.css';
import { Link } from 'react-router-dom'
import dayjs from 'dayjs';

const MainLayout: React.FC = () => {
    const formattedDate = dayjs().format('YYYY-MM-DD');
    return (
        <div className="main-layout">
            <div className="sidebar">
                <h2>Restaurant Menu</h2>
                <nav>
                    <ul>
                        <li className="active">Menu Items</li>
                        <li>Categories</li>
                        <li>Orders</li>
                        <li>Settings</li>
                        <li>
                            <Link to={`/statistics/category/${formattedDate}`} className="menu-button">
                                Today Categories
                            </Link>
                        </li>
                        <li>
                            <Link to={`/categories/sort`} className="menu-button">
                                Sort Categories
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout; 