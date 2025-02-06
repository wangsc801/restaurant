import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem } from '../../types/MenuItem';
import './MenuItemCard.css';

interface MenuItemCardProps {
    item: MenuItem;
    onViewDetails: (id: string) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onViewDetails }) => {
    const navigate = useNavigate();

    return (
        <div className="menu-item-card">
            <img 
                src={'http://localhost:8080'+item.imagePath} 
                alt={item.title} 
                className="menu-item-image"
            />
            <div className="menu-item-content">
                <h3>{item.title}</h3>
                <p className="subtitle">{item.subtitle}</p>
                <p className="price">
                    {item.moneySymbol}{item.price} / {item.unit}
                </p>
                <div className="tags">
                    {item.tags.map(tag => (
                        <span key={tag} className="tag">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="card-actions">
                    <button 
                        onClick={() => navigate(`/menu-items/update/${item.id}`)}
                        className="update-button"
                    >
                        Update
                    </button>
                    <button 
                        onClick={() => onViewDetails(item.id)}
                        className="details-button"
                    >
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard; 