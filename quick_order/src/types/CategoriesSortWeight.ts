interface Category {
    name: string|null;
    sortWeight: number;
}

export interface CategoriesSortWeight {
    id:string,
    branchId: string;
    categories: Category[];
}