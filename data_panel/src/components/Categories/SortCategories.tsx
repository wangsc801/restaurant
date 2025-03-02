import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { categoriesService } from '../../services/categoriesService';
import './SortCategories.css';
// import { geoClipRectangle } from 'd3';

interface Category {
    name: string | null;
    sortWeight: number;
}

const SortCategories: React.FC = () => {
    const [sortWeightId,setSortWeightId] = useState<string>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await categoriesService.getAllCategoriesSortWeight();
            setSortWeightId(data.id);
            console.log(data)
            // Sort categories by sortWeight
            const sortedCategories = data.categories.sort((a, b) => a.sortWeight - b.sortWeight);
            console.log(sortedCategories)
            setCategories(sortedCategories);
        } catch (error) {
            setError('Failed to load categories');
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (result: any) => {
        if (!result.destination) return;

        const items = Array.from(categories);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update sort weights
        const updatedCategories = items.map((item, index) => ({
            ...item,
            sortWeight: index + 1
        }));

        setCategories(updatedCategories);

        try {
            const updateObj = {
                id: sortWeightId || '',
                branchId: '67a5734ed823f416daaa4b1b',
                categories: updatedCategories
            }
            console.log(updateObj)
            await categoriesService.updateCategoriesSortWeight(updateObj);
        } catch (error) {
            setError('Failed to update category order');
            console.error('Error updating category order:', error);
            // Reload original order if update fails
            loadCategories();
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="sort-categories">
            <h2>Sort Categories</h2>
            <p className="instruction">Drag and drop categories to reorder them</p>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="categories">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="category-list"
                        >
                            {categories.map((category, index) => (
                                <Draggable
                                    key={category.name || 'unnamed'}
                                    draggableId={category.name || 'unnamed'}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`category-item ${
                                                snapshot.isDragging ? 'dragging' : ''
                                            }`}
                                        >
                                            <span className="drag-handle">⋮⋮</span>
                                            <span className="category-name">
                                                {category.name}
                                            </span>
                                            <span className="weight">
                                                Weight: {category.sortWeight}
                                            </span>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default SortCategories;
