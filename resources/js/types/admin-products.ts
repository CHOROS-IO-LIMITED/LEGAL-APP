export interface User {
    name: string;
    email: string;
}

export interface DocumentItem {
    id: number;
    title: string;
    description: string | null;
    price: string | number;
    image_url: string | null;
    document_url: string | null;
    image_original_name?: string | null;
    document_original_name?: string | null;
    created_at: string;
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
    documents: DocumentItem[];
    stats: DocumentStats;
    can: DocumentPermissions;
}
