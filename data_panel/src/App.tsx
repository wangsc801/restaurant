import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import MenuItems from './components/MenuItems/MenuItems';
import UpdateMenuItem from './components/MenuItems/UpdateMenuItem';
import CategorCategoriesPieCharts from './components/Statistics/CategoriesPieCharts'
import './App.css'

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Navigate to="/menu-items" replace />} />
                    <Route path="/menu-items" element={<MenuItems />} />
                    <Route path="/menu-items/update/:id" element={<UpdateMenuItem />} />
                    <Route path="/statistics/category/:date" element={<CategorCategoriesPieCharts />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
