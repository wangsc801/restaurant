import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem } from '../../types/MenuItem';
import { menuItemService } from '../../services/menuItemService';
import './AddMenuItem.css';

const AddMenuItem: React.FC = () => {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [item, setItem] = useState<Partial<MenuItem>>({
        title: '',
        subtitle: '',
        categories: [],
        tags: [],
        price: 0,
        moneySymbol: '$',
        unit: 'piece',
        abbr: '',
        description: '',
        remark: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'categories' || name === 'tags') {
            setItem({
                ...item,
                [name]: value.split(',').map(item => item.trim())
            });
        } else {
            setItem({
                ...item,
                [name]: value
            });
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const validateForm = (): boolean => {
        if (!item.title?.trim()) {
            setError('Title is required');
            return false;
        }

        if (!item.price || item.price <= 0) {
            setError('Price must be greater than 0');
            return false;
        }

        if (!item.categories || item.categories.length === 0) {
            setError('At least one category is required');
            return false;
        }

        if (!imageFile) {
            setError('Image is required');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            let imageData = '';
            
            if (imageFile) {
                // Convert the file to base64
                const reader = new FileReader();
                imageData = await new Promise((resolve, reject) => {
                    reader.onload = () => {
                        if (typeof reader.result === 'string') {
                            // Extract base64 data without the data URL prefix
                            const base64Data = reader.result.split(',')[1];
                            resolve(base64Data);
                        }
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(imageFile);
                });
            }

            const newItem: Partial<MenuItem> = {
                ...item,
                image: imageData
            };
            
            await menuItemService.addMenuItem(newItem);
            navigate('/menu-items');
        } catch (error) {
            setError('Failed to add menu item');
            console.error('Error adding menu item:', error);
        }
    };

    return (
        <div className="add-menu-item">
            <h2>Add New Menu Item</h2>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={item.title}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Subtitle</label>
                    <input
                        type="text"
                        name="subtitle"
                        value={item.subtitle}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Categories (comma-separated)</label>
                    <input
                        type="text"
                        name="categories"
                        value={item.categories?.join(', ')}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Tags (comma-separated)</label>
                    <input
                        type="text"
                        name="tags"
                        value={item.tags?.join(', ')}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={item.price}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Money Symbol</label>
                    <input
                        type="text"
                        name="moneySymbol"
                        value={item.moneySymbol}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Unit</label>
                    <input
                        type="text"
                        name="unit"
                        value={item.unit}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Abbreviation</label>
                    <input
                        type="text"
                        name="abbr"
                        value={item.abbr}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={item.description}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Remark</label>
                    <textarea
                        name="remark"
                        value={item.remark}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="image-preview"
                        />
                    )}
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/menu-items')}>
                        Cancel
                    </button>
                    <button type="submit">
                        Add Menu Item
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddMenuItem;
