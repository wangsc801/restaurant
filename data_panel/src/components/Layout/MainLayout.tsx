import React from 'react';
import { Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout: React.FC = () => {
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