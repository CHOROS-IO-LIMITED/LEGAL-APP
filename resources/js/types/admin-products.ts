export interface User {
    name: string;
    email: string;
}

export interface DocumentItem {
    id: number;
    title: string;
    description: string | null;
    price: string;
    image_url: string | null;
    document_url: string | null;
    image_original_name?: string | null;
    document_original_name?: string | null;
    created_at: string;
}

export interface PaginatedDocuments {
    data: DocumentItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface DocumentFilters {
    search?: string;
    price?: string;
    sort?: string;
}

export interface DocumentStats {
    total_documents: number;
    active_products: number;
    draft_products: number;
    top_product: string | null;
}

export interface DocumentPermissions {
    create_document: boolean;
}

export interface ProductIndexProps {
    user: User;
    documents: PaginatedDocuments;
    filters: DocumentFilters;
    stats: DocumentStats;
    can: DocumentPermissions;
}
