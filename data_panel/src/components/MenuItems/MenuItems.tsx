import React, { useEffect, useState } from 'react';
import { MenuItem } from '../../types/MenuItem';
import { menuItemService } from '../../services/menuItemService';
import MenuItemCard from './MenuItemCard';
import './MenuItems.css';

const MenuItems: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedTag, setSelectedTag] = useState<string>('all');
    const [filterBy, setFilterBy] = useState<'category' | 'tag'>('category');

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const items = await menuItemService.getAllMenuItems();
                setMenuItems(items);
                
                // Extract unique categories and tags
                const allCategories = Array.from(
                    new Set(items.flatMap(item => item.categories))
                );
                const allTags = Array.from(
                    new Set(items.flatMap(item => item.tags))
                );
                
                setCategories(allCategories);
                setTags(allTags);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };

        fetchMenuItems();
    }, []);

    const filteredMenuItems = menuItems.filter(item => {
        if (filterBy === 'category') {
            return selectedCategory === 'all' || item.categories.includes(selectedCategory);
        } else {
            return selectedTag === 'all' || item.tags.includes(selectedTag);
        }
    });

    const handleViewDetails = (id: string) => {
        // TODO: Implement details view functionality
        console.log('View details:', id);
    };

    return (
        <div className="menu-items-container">
            <div className="filter-controls">
                <div className="filter-type">
                    <label>
                        <input
                            type="radio"
                            value="category"
                            checked={filterBy === 'category'}
                            onChange={(e) => setFilterBy('category')}
                        />
                        Filter by Category
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="tag"
                            checked={filterBy === 'tag'}
                            onChange={(e) => setFilterBy('tag')}
                        />
                        Filter by Tag
                    </label>
                </div>

                {filterBy === 'category' ? (
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                ) : (
                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                    >
                        <option value="all">All Tags</option>
                        {tags.map(tag => (
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div className="menu-items-grid">
                {filteredMenuItems.map(item => (
                    <MenuItemCard
                        key={item.id}
                        item={item}
                        onViewDetails={handleViewDetails}
                    />
                ))}
            </div>
        </div>
    );
};

export default MenuItems; 