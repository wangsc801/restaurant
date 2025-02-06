import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MenuItem } from '../../types/MenuItem';
import { menuItemService } from '../../services/menuItemService';
import './UpdateMenuItem.css';

const UpdateMenuItem: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [item, setItem] = useState<MenuItem | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (id) {
            loadMenuItem(id);
        }
        // Cleanup function to revoke object URLs when component unmounts
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [id]);

    const loadMenuItem = async (itemId: string) => {
        try {
            const data = await menuItemService.getMenuItem(itemId);
            setItem(data);
            // For server images, add the base URL
            setImagePreview(`http://localhost:8080${data.imagePath}`);
        } catch (error) {
            setError('Failed to load menu item');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!item) return;

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
            // For local file preview, use URL.createObjectURL
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const validateForm = (): boolean => {
        if (!item) return false;

        if (!item.title.trim()) {
            setError('Title is required');
            return false;
        }

        if (!item.price || item.price <= 0) {
            setError('Price must be greater than 0');
            return false;
        }

        if (item.categories.length === 0) {
            setError('At least one category is required');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !item) return;

        try {
            let newImagePath = item.imagePath;
            
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                newImagePath = await menuItemService.uploadImage(formData);
            }

            const updatedItem: MenuItem = {
                ...item,
                imagePath: newImagePath
            };
            
            await menuItemService.updateMenuItem(updatedItem);
            navigate('/menu-items');
        } catch (error) {
            setError('Failed to update menu item');
            console.error('Error updating menu item:', error);
        }
    };

    if (!item) return <div>Loading...</div>;

    return (
        <div className="update-menu-item">
            <h2>Update Menu Item</h2>
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
                        value={item.categories.join(', ')}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Tags (comma-separated)</label>
                    <input
                        type="text"
                        name="tags"
                        value={item.tags.join(', ')}
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
                    <label>Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
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
                        Update Menu Item
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateMenuItem; 