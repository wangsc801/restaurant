import axios from 'axios';

const CATEGORY_URL = 'http://localhost:8080/api/categories';


interface Category {
    name: string|null;
    sortWeight: number;
}

interface CategoriesSortWeight {
    id:string,
    branchId: string;
    categories: Category[];
}

export const categoriesService = {
    getAllCategoriesSortWeight: async (): Promise<CategoriesSortWeight> => {
        const response = await axios.get(
            `${CATEGORY_URL}/sort-weight/branch-id/67a5734ed823f416daaa4b1b`
        );
        return response.data;
    },

    updateCategoriesSortWeight: async (data: CategoriesSortWeight): Promise<void> => {
        await axios.put(`${CATEGORY_URL}/sort-weight/update`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}