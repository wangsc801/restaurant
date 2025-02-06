import axios from 'axios';
import { MenuItem } from '../types/MenuItem';

const API_URL = 'http://localhost:8080/api/menu-items';

export const menuItemService = {
    getAllMenuItems: async (): Promise<MenuItem[]> => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getMenuItem: async (id: string): Promise<MenuItem> => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    updateMenuItem: async (item: MenuItem): Promise<MenuItem> => {
        const response = await axios.post(`${API_URL}/add`, item);
        return response.data;
    },

    uploadImage: async (formData: FormData): Promise<string> => {
        const response = await axios.post(`${API_URL}/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
}; 