import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AdminLayout from '@/layouts/admin-layout';
import type { DocumentItem, ProductIndexProps } from '@/types/admin-products';
import { router, useForm } from '@inertiajs/react';
import { Eye, FileClock, FileText, Package, Pencil, Plus, Trash2, TrendingUp, Upload } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type CreateDocumentForm = {
    title: string;
    price: string;
    description: string;
    image: File | null;
    document: File | null;
};

type EditDocumentForm = {
    title: string;
    price: string;
    description: string;
    image: File | null;
    document: File | null;
    _method: 'put';
};

function formatPrice(value: string | number | null | undefined) {
    const amount = Number(value ?? 0);

    if (Number.isNaN(amount)) return '£0.00';

    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
    }).format(amount);
}

function buildQuery(
    filters: {
        search?: string;
        price?: string;
        sort?: string;
    },
    overrides: Partial<{
        search: string;
        price: string;
        sort: string;
        page: number;
    }> = {},
) {
    return {
        search: overrides.search ?? filters.search ?? '',
        price: overrides.price ?? filters.price ?? 'all',
        sort: overrides.sort ?? filters.sort ?? 'az',
        page: overrides.page ?? 1,
    };
}

export default function ProductIndex({ user, documents, filters, stats, can }: ProductIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<DocumentItem | null>(null);
    const [viewingProduct, setViewingProduct] = useState<DocumentItem | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');

    const createForm = useForm<CreateDocumentForm>({
        title: '',
        price: '',
        description: '',
        image: null,
        document: null,
    });

    const editForm = useForm<EditDocumentForm>({
        title: '',
        price: '',
        description: '',
        image: null,
        document: null,
        _method: 'put',
    });

    useEffect(() => {
        if (!editingProduct) return;

        editForm.setData({
            title: editingProduct.title ?? '',
            price: editingProduct.price ? String(editingProduct.price) : '',
            description: editingProduct.description ?? '',
            image: null,
            document: null,
            _method: 'put',
        });
    }, [editingProduct]);

    const startIndex = documents.total === 0 ? 0 : (documents.current_page - 1) * documents.per_page + 1;
    const endIndex = documents.total === 0 ? 0 : startIndex + documents.data.length - 1;

    const currentPriceFilter = filters.price ?? 'all';
    const currentSortFilter = filters.sort ?? 'az';

    const selectedCreateImageName = useMemo(() => createForm.data.image?.name ?? null, [createForm.data.image]);
    const selectedCreateDocumentName = useMemo(() => createForm.data.document?.name ?? null, [createForm.data.document]);
    const selectedEditImageName = useMemo(() => editForm.data.image?.name ?? null, [editForm.data.image]);
    const selectedEditDocumentName = useMemo(() => editForm.data.document?.name ?? null, [editForm.data.document]);

    const applyFilters = (overrides: Partial<{ search: string; price: string; sort: string; page: number }> = {}) => {
        router.get(route('admin.my-products'), buildQuery(filters, overrides), {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        applyFilters({ search, page: 1 });
    };

    const handleCreateImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        createForm.setData('image', file);
    };

    const handleCreateDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        createForm.setData('document', file);
    };

    const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        editForm.setData('image', file);
    };

    const handleEditDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        editForm.setData('document', file);
    };

    const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        createForm.post(route('admin.documents.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                createForm.reset();
                setIsCreateOpen(false);
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!editingProduct) return;

        editForm.post(route('admin.documents.update', editingProduct.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                editForm.reset();
                editForm.setData('_method', 'put');
                setEditingProduct(null);
            },
        });
    };

    const handleDelete = (product: DocumentItem) => {
        const confirmed = window.confirm(`Delete "${product.title}"? This action cannot be undone.`);

        if (!confirmed) return;

        router.delete(route('admin.documents.destroy', product.id), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout user={user}>
            <main className="flex-1 overflow-y-auto bg-[#FCF9F2] p-4 md:p-6">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1A1614]">Legal Products</h1>
                            <p className="text-sm text-[#6B635B]">Manage all your legal documents here. Add, edit, or remove items as needed.</p>
                        </div>

                        {can.create_document && (
                            <Dialog
                                open={isCreateOpen}
                                onOpenChange={(open) => {
                                    setIsCreateOpen(open);

                                    if (!open) {
                                        createForm.reset();
                                        createForm.clearErrors();
                                    }
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button className="bg-[#3D2B1F] text-white hover:bg-[#5A4638]">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Document
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Add Document</DialogTitle>
                                        <DialogDescription>
                                            Create a new legal document that will be available in your product catalog.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={handleCreateSubmit} className="space-y-5 py-2">
                                        <div className="grid gap-5 md:grid-cols-[160px_1fr]">
                                            <div className="flex flex-col items-center gap-2">
                                                <Label htmlFor="image">Preview Image</Label>

                                                <label
                                                    htmlFor="image"
                                                    className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#D6D0C4] bg-[#FCF9F2] text-center text-xs text-[#6B635B] transition hover:border-[#B8A893] hover:bg-[#F8F3EA]"
                                                >
                                                    {selectedCreateImageName ? (
                                                        <div className="px-2 text-[#3D2B1F]">
                                                            <p className="font-medium">Selected</p>
                                                            <p className="mt-1 line-clamp-2 text-[11px] break-words">{selectedCreateImageName}</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Upload className="h-4 w-4" />
                                                            <span>Upload image</span>
                                                        </div>
                                                    )}
                                                </label>

                                                <Input
                                                    id="image"
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                                    className="hidden"
                                                    onChange={handleCreateImageUpload}
                                                />

                                                {createForm.errors.image && (
                                                    <p className="text-center text-xs text-red-500">{createForm.errors.image}</p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <Label htmlFor="title">Product Name</Label>
                                                    <Input
                                                        id="title"
                                                        placeholder="Employment Contract"
                                                        value={createForm.data.title}
                                                        onChange={(e) => createForm.setData('title', e.target.value)}
                                                    />
                                                    {createForm.errors.title && <p className="text-xs text-red-500">{createForm.errors.title}</p>}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Label htmlFor="price">Price (₱)</Label>
                                                    <Input
                                                        id="price"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="500"
                                                        value={createForm.data.price}
                                                        onChange={(e) => createForm.setData('price', e.target.value)}
                                                        className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                    />
                                                    {createForm.errors.price && <p className="text-xs text-red-500">{createForm.errors.price}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="document">Legal Document (PDF)</Label>

                                            <label
                                                htmlFor="document"
                                                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#D6D0C4] bg-[#FCF9F2] px-4 py-6 text-sm text-[#6B635B] transition hover:border-[#B8A893] hover:bg-[#F8F3EA]"
                                            >
                                                {selectedCreateDocumentName ? (
                                                    <div className="flex items-center gap-2 text-[#1A1614]">
                                                        <FileText className="h-4 w-4 text-[#A68A64]" />
                                                        <span className="max-w-[260px] truncate text-[#A68A64]">{selectedCreateDocumentName}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4" />
                                                        <span>Upload PDF Template</span>
                                                    </div>
                                                )}
                                            </label>

                                            <Input
                                                id="document"
                                                type="file"
                                                accept="application/pdf"
                                                onChange={handleCreateDocumentUpload}
                                                className="hidden"
                                            />

                                            {createForm.errors.document && <p className="text-xs text-red-500">{createForm.errors.document}</p>}

                                            <p className="text-xs text-[#9C9389]">
                                                Upload the legal template the AI will use to generate documents from user responses.
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Write a short description for this legal document..."
                                                className="min-h-[110px]"
                                                value={createForm.data.description}
                                                onChange={(e) => createForm.setData('description', e.target.value)}
                                            />
                                            {createForm.errors.description && <p className="text-xs text-red-500">{createForm.errors.description}</p>}
                                        </div>

                                        <DialogFooter className="gap-2">
                                            <DialogClose asChild>
                                                <Button type="button" variant="outline" disabled={createForm.processing}>
                                                    Close
                                                </Button>
                                            </DialogClose>

                                            <Button
                                                type="submit"
                                                disabled={createForm.processing}
                                                className="bg-[#3D2B1F] text-white hover:bg-[#5A4638]"
                                            >
                                                {createForm.processing ? 'Adding...' : 'Add Document'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-[#6B635B]">Total Documents</CardTitle>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7E1D7] bg-[#F2EDE4]">
                                    <FileText className="h-4 w-4 text-[#A68A64]" />
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="text-2xl font-bold text-[#1A1614]">{stats.total_documents}</div>
                                <p className="text-xs text-[#6B635B]">Documents in catalog</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-[#6B635B]">Active Products</CardTitle>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7E1D7] bg-[#F2EDE4]">
                                    <Package className="h-4 w-4 text-[#A68A64]" />
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="text-2xl font-bold text-[#1A1614]">{stats.active_products}</div>
                                <p className="text-xs text-[#6B635B]">Available for purchase</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-[#6B635B]">Draft Products</CardTitle>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7E1D7] bg-[#F2EDE4]">
                                    <FileClock className="h-4 w-4 text-[#A68A64]" />
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="text-2xl font-bold text-[#1A1614]">{stats.draft_products}</div>
                                <p className="text-xs text-[#6B635B]">Not yet published</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-[#6B635B]">Top Product</CardTitle>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7E1D7] bg-[#F2EDE4]">
                                    <TrendingUp className="h-4 w-4 text-[#A68A64]" />
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="text-lg font-bold text-[#1A1614]">{stats.top_product ?? '—'}</div>
                                <p className="text-xs text-[#6B635B]">Most purchased document</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <form onSubmit={handleSearchSubmit} className="w-full md:max-w-sm">
                            <Input
                                placeholder="Search documents..."
                                className="border-[#E7E1D7] bg-white"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </form>

                        <div className="flex flex-wrap items-center gap-2">
                            <Select value={currentPriceFilter} onValueChange={(value) => applyFilters({ price: value, page: 1 })}>
                                <SelectTrigger className="w-[160px] border-[#E7E1D7] bg-white">
                                    <SelectValue placeholder="Price filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="highest">Highest Price</SelectItem>
                                    <SelectItem value="lowest">Lowest Price</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={currentSortFilter} onValueChange={(value) => applyFilters({ sort: value, page: 1 })}>
                                <SelectTrigger className="w-[140px] border-[#E7E1D7] bg-white">
                                    <SelectValue placeholder="Sort" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="az">Name A-Z</SelectItem>
                                    <SelectItem value="za">Name Z-A</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between border-b border-[#E7E1D7]">
                            <CardTitle className="text-base font-semibold text-[#1A1614]">
                                Legal Documents <span className="text-[#6B635B]">({documents.total})</span>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-6">
                            {documents.data.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-[#E7E1D7] bg-[#FCF9F2] px-6 py-10 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F2EDE4]">
                                        <FileText className="h-5 w-5 text-[#A68A64]" />
                                    </div>
                                    <h3 className="text-base font-semibold text-[#1A1614]">No documents found</h3>
                                    <p className="mt-1 text-sm text-[#6B635B]">Try changing your filters or add a new document.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2">
                                    {documents.data.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex flex-col gap-4 rounded-xl border border-[#E7E1D7] bg-white p-6 sm:flex-row sm:items-start sm:gap-6"
                                        >
                                            <div className="h-40 w-full overflow-hidden rounded-lg border border-[#E7E1D7] bg-[#F2EDE4] sm:h-32 sm:w-32 sm:flex-shrink-0">
                                                <img
                                                    src={product.image_url || '/images/products/placeholder.webp'}
                                                    alt={product.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>

                                            <div className="flex flex-1 flex-col gap-2">
                                                <div className="flex items-center justify-between gap-3">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <h3 className="max-w-[220px] truncate text-base font-semibold text-[#1A1614]">
                                                                    {product.title}
                                                                </h3>
                                                            </TooltipTrigger>

                                                            <TooltipContent>
                                                                <p>{product.title}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <span className="shrink-0 text-sm font-semibold text-[#3D2B1F]">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                </div>

                                                <p className="line-clamp-3 text-sm leading-relaxed text-[#6B635B]">
                                                    {product.description || 'No description provided.'}
                                                </p>

                                                <div className="pt-1 text-xs text-[#9C9389]">
                                                    {product.document_original_name ? (
                                                        <span>PDF: {product.document_original_name}</span>
                                                    ) : (
                                                        <span>No PDF uploaded</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end gap-2 sm:flex-col sm:items-center sm:justify-center">
                                                <Button variant="ghost" size="icon" onClick={() => setViewingProduct(product)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>

                                                <Button variant="ghost" size="icon" onClick={() => setEditingProduct(product)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>

                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(product)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>

                        <div className="flex flex-col gap-3 border-t border-[#E7E1D7] px-6 py-4 text-sm text-[#6B635B] md:flex-row md:items-center md:justify-between">
                            <span>
                                Showing <span className="font-medium text-[#1A1614]">{startIndex}</span> –{' '}
                                <span className="font-medium text-[#1A1614]">{endIndex}</span> of{' '}
                                <span className="font-medium text-[#1A1614]">{documents.total}</span> documents
                            </span>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={documents.current_page === 1}
                                    onClick={() => applyFilters({ page: documents.current_page - 1 })}
                                >
                                    Prev
                                </Button>

                                <span className="text-sm text-[#6B635B]">
                                    Page <span className="font-medium text-[#1A1614]">{documents.current_page}</span> of{' '}
                                    <span className="font-medium text-[#1A1614]">{documents.last_page}</span>
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={documents.current_page === documents.last_page}
                                    onClick={() => applyFilters({ page: documents.current_page + 1 })}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Dialog
                        open={!!editingProduct}
                        onOpenChange={(open) => {
                            if (!open) {
                                setEditingProduct(null);
                                editForm.reset();
                                editForm.setData('_method', 'put');
                                editForm.clearErrors();
                            }
                        }}
                    >
                        <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Edit Document</DialogTitle>
                                <DialogDescription>Update the details of this legal document.</DialogDescription>
                            </DialogHeader>

                            {editingProduct && (
                                <form onSubmit={handleEditSubmit} className="space-y-5 py-2">
                                    <div className="grid gap-5 md:grid-cols-[160px_1fr]">
                                        <div className="flex flex-col items-center gap-2">
                                            <Label htmlFor="edit-image">Image</Label>

                                            <label
                                                htmlFor="edit-image"
                                                className="flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#D6D0C4] bg-[#FCF9F2]"
                                            >
                                                {selectedEditImageName ? (
                                                    <div className="px-2 text-center text-[#3D2B1F]">
                                                        <p className="font-medium">Selected</p>
                                                        <p className="mt-1 line-clamp-2 text-[11px] break-words">{selectedEditImageName}</p>
                                                    </div>
                                                ) : editingProduct.image_url ? (
                                                    <img
                                                        src={editingProduct.image_url}
                                                        alt={editingProduct.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 text-xs text-[#6B635B]">
                                                        <Upload className="h-4 w-4" />
                                                        <span>Upload image</span>
                                                    </div>
                                                )}
                                            </label>

                                            <Input
                                                id="edit-image"
                                                type="file"
                                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                                className="hidden"
                                                onChange={handleEditImageUpload}
                                            />

                                            {editForm.errors.image && <p className="text-center text-xs text-red-500">{editForm.errors.image}</p>}
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="edit-title">Document Name</Label>
                                                <Input
                                                    id="edit-title"
                                                    value={editForm.data.title}
                                                    onChange={(e) => editForm.setData('title', e.target.value)}
                                                />
                                                {editForm.errors.title && <p className="text-xs text-red-500">{editForm.errors.title}</p>}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="edit-price">Price (£)</Label>
                                                <Input
                                                    id="edit-price"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={editForm.data.price}
                                                    onChange={(e) => editForm.setData('price', e.target.value)}
                                                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                />
                                                {editForm.errors.price && <p className="text-xs text-red-500">{editForm.errors.price}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="edit-document">Legal Document (PDF)</Label>

                                        <label
                                            htmlFor="edit-document"
                                            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#D6D0C4] bg-[#FCF9F2] px-4 py-6 text-sm text-[#6B635B]"
                                        >
                                            {selectedEditDocumentName ? (
                                                <div className="flex items-center gap-2 text-[#1A1614]">
                                                    <FileText className="h-4 w-4 text-[#A68A64]" />
                                                    <span className="max-w-[260px] truncate text-[#A68A64]">{selectedEditDocumentName}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    <span>{editingProduct.document_original_name || 'Replace PDF Template'}</span>
                                                </div>
                                            )}
                                        </label>

                                        <Input
                                            id="edit-document"
                                            type="file"
                                            accept="application/pdf"
                                            className="hidden"
                                            onChange={handleEditDocumentUpload}
                                        />

                                        {editForm.errors.document && <p className="text-xs text-red-500">{editForm.errors.document}</p>}

                                        <p className="text-xs text-[#9C9389]">
                                            Upload a new template only if you want to replace the existing legal document PDF.
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="edit-description">Description</Label>
                                        <Textarea
                                            id="edit-description"
                                            value={editForm.data.description}
                                            onChange={(e) => editForm.setData('description', e.target.value)}
                                            className="min-h-[110px]"
                                        />
                                        {editForm.errors.description && <p className="text-xs text-red-500">{editForm.errors.description}</p>}
                                    </div>

                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="outline" disabled={editForm.processing}>
                                                Cancel
                                            </Button>
                                        </DialogClose>

                                        <Button type="submit" disabled={editForm.processing} className="bg-[#3D2B1F] text-white hover:bg-[#5A4638]">
                                            {editForm.processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            )}
                        </DialogContent>
                    </Dialog>

                    <Dialog open={!!viewingProduct} onOpenChange={() => setViewingProduct(null)}>
                        <DialogContent className="max-h-[85vh] max-w-4xl overflow-hidden p-0">
                            {viewingProduct && (
                                <div className="flex max-h-[85vh] flex-col overflow-y-auto p-6">
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-[#E7E1D7] bg-[#F2EDE4]">
                                            <img
                                                src={viewingProduct.image_url || '/images/products/placeholder.webp'}
                                                alt={viewingProduct.title}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="flex flex-1 flex-col gap-2">
                                            <div className="flex items-center justify-between gap-3">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <h2 className="min-w-0 flex-1 truncate text-lg font-semibold text-[#1A1614]">
                                                                {viewingProduct.title}
                                                            </h2>
                                                        </TooltipTrigger>

                                                        <TooltipContent>
                                                            <p>{viewingProduct.title}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <span className="flex-shrink-0 text-sm font-semibold text-[#3D2B1F]">
                                                    {formatPrice(viewingProduct.price)}
                                                </span>
                                            </div>

                                            <p className="text-sm leading-relaxed text-[#6B635B]">
                                                {viewingProduct.description || 'No description provided.'}
                                            </p>

                                            <div className="text-xs text-[#9C9389]">
                                                {viewingProduct.document_original_name ? (
                                                    <span>PDF file: {viewingProduct.document_original_name}</span>
                                                ) : (
                                                    <span>No PDF file name available</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="my-6 border-t border-[#E7E1D7]" />

                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-sm font-medium text-[#1A1614]">Legal Template Preview</h3>

                                        <div className="overflow-hidden rounded-md border border-[#E7E1D7] bg-white">
                                            {viewingProduct.document_url ? (
                                                <iframe src={viewingProduct.document_url} title={viewingProduct.title} className="h-[560px] w-full" />
                                            ) : (
                                                <div className="flex h-[320px] items-center justify-center px-6 text-sm text-[#6B635B]">
                                                    No PDF preview available for this document.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </main>
        </AdminLayout>
    );
}
