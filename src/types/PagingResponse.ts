export interface PagingResponse<T> {
    items: T[];
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
