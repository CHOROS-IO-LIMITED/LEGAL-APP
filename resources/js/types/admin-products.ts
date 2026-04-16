export interface User {
    name: string;
    email: string;
}

export type DocumentItem = {
    id: number;
    title: string;
    slug: string | null;
    price: string | number;
    document_type: string | null;
    description: string | null;
    short_description?: string | null;
    image_path?: string | null;
    image_original_name?: string | null;
    image_mime?: string | null;
    image_size?: number | null;
    document_path?: string | null;
    document_original_name?: string | null;
    document_mime?: string | null;
    document_size?: number | null;
    image_url: string | null;
    document_url: string | null;
    is_active: boolean;
    is_featured?: boolean;
    sort_order?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
};

export interface DocumentStats {
    total_documents: number;
    active_products: number;
    draft_products: number;
    top_product: string | null;
}

export interface DocumentPermissions {
    create_document: boolean;
}

export type DocumentTypeOption = {
    value: string;
    label: string;
};

export interface ProductIndexProps {
    user: User;
    documents: DocumentItem[];
    stats: DocumentStats;
    can: DocumentPermissions;
    documentTypes: DocumentTypeOption[];
}
