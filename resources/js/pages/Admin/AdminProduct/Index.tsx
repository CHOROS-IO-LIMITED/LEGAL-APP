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

type PriceFilter = 'all' | 'highest' | 'lowest';
type SortFilter = 'az' | 'za';

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
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

function openFileInNewTab(url: string | null | undefined) {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
}

function revokePreview(url: string | null) {
    if (url) URL.revokeObjectURL(url);
}

export default function ProductIndex({ user, documents, stats, can }: ProductIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<DocumentItem | null>(null);
    const [viewingProduct, setViewingProduct] = useState<DocumentItem | null>(null);

    const [search, setSearch] = useState('');
    const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
    const [sortFilter, setSortFilter] = useState<SortFilter>('az');
    const [currentPage, setCurrentPage] = useState(1);

    const perPage = 8;

    const [createImagePreview, setCreateImagePreview] = useState<string | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
    const [createDocumentPreview, setCreateDocumentPreview] = useState<string | null>(null);
    const [editDocumentPreview, setEditDocumentPreview] = useState<string | null>(null);

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

    const resetCreateState = () => {
        createForm.reset();
        createForm.clearErrors();

        revokePreview(createImagePreview);
        revokePreview(createDocumentPreview);

        setCreateImagePreview(null);
        setCreateDocumentPreview(null);
    };

    const resetEditState = () => {
        editForm.reset();
        editForm.clearErrors();
        editForm.setData('_method', 'put');

        revokePreview(editImagePreview);
        revokePreview(editDocumentPreview);

        setEditImagePreview(null);
        setEditDocumentPreview(null);
        setEditingProduct(null);
    };

    useEffect(() => {
        return () => {
            revokePreview(createImagePreview);
            revokePreview(editImagePreview);
            revokePreview(createDocumentPreview);
            revokePreview(editDocumentPreview);
        };
    }, [createImagePreview, editImagePreview, createDocumentPreview, editDocumentPreview]);

    useEffect(() => {
        if (!editingProduct) return;

        revokePreview(editImagePreview);
        revokePreview(editDocumentPreview);

        setEditImagePreview(null);
        setEditDocumentPreview(null);

        editForm.setData({
            title: editingProduct.title ?? '',
            price: editingProduct.price ? String(editingProduct.price) : '',
            description: editingProduct.description ?? '',
            image: null,
            document: null,
            _method: 'put',
        });
    }, [editingProduct]);

    const selectedCreateImageName = useMemo(() => createForm.data.image?.name ?? null, [createForm.data.image]);
    const selectedCreateDocumentName = useMemo(() => createForm.data.document?.name ?? null, [createForm.data.document]);
    const selectedEditImageName = useMemo(() => editForm.data.image?.name ?? null, [editForm.data.image]);
    const selectedEditDocumentName = useMemo(() => editForm.data.document?.name ?? null, [editForm.data.document]);

    const filteredDocuments = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        const items = documents.filter((item) => {
            if (!keyword) return true;

            return [item.title, item.slug, item.description, item.document_original_name]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(keyword));
        });

        return items.sort((a, b) => {
            if (priceFilter === 'highest') {
                const priceDiff = Number(b.price ?? 0) - Number(a.price ?? 0);
                if (priceDiff !== 0) return priceDiff;
            }

            if (priceFilter === 'lowest') {
                const priceDiff = Number(a.price ?? 0) - Number(b.price ?? 0);
                if (priceDiff !== 0) return priceDiff;
            }

            if (sortFilter === 'za') {
                return (b.title ?? '').localeCompare(a.title ?? '');
            }

            return (a.title ?? '').localeCompare(b.title ?? '');
        });
    }, [documents, search, priceFilter, sortFilter]);

    const totalDocuments = filteredDocuments.length;
    const lastPage = Math.max(1, Math.ceil(totalDocuments / perPage));

    useEffect(() => {
        setCurrentPage(1);
    }, [search, priceFilter, sortFilter]);

    useEffect(() => {
        if (currentPage > lastPage) {
            setCurrentPage(lastPage);
        }
    }, [currentPage, lastPage]);

    const paginatedDocuments = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return filteredDocuments.slice(start, start + perPage);
    }, [filteredDocuments, currentPage]);

    const startIndex = totalDocuments === 0 ? 0 : (currentPage - 1) * perPage + 1;
    const endIndex = totalDocuments === 0 ? 0 : startIndex + paginatedDocuments.length - 1;

    const handleCreateImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        createForm.setData('image', file);

        revokePreview(createImagePreview);

        if (file) {
            setCreateImagePreview(URL.createObjectURL(file));
        } else {
            setCreateImagePreview(null);
        }
    };

    const handleCreateDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        createForm.setData('document', file);

        revokePreview(createDocumentPreview);

        if (file) {
            setCreateDocumentPreview(URL.createObjectURL(file));
        } else {
            setCreateDocumentPreview(null);
        }
    };

    const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        editForm.setData('image', file);

        revokePreview(editImagePreview);

        if (file) {
            setEditImagePreview(URL.createObjectURL(file));
        } else {
            setEditImagePreview(null);
        }
    };

    const handleEditDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        editForm.setData('document', file);

        revokePreview(editDocumentPreview);

        if (file) {
            setEditDocumentPreview(URL.createObjectURL(file));
        } else {
            setEditDocumentPreview(null);
        }
    };

    const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        createForm.post(route('admin.documents.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                resetCreateState();
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
                resetEditState();
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
                    {/* Header */}
                    <div className="rounded-none border border-[#E7E1D7] bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            {/* Title & Description */}
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl font-semibold tracking-tight text-[#1A1614]">Legal Products</h1>
                                <p className="text-sm text-[#6B635B]">Manage all your legal documents here. Add, edit, or remove items as needed.</p>
                            </div>

                            {/* Add Document Button & Dialog */}
                            {can.create_document && (
                                <Dialog
                                    open={isCreateOpen}
                                    onOpenChange={(open) => {
                                        setIsCreateOpen(open);
                                        if (!open) resetCreateState();
                                    }}
                                >
                                    <DialogTrigger asChild>
                                        <Button className="inline-flex cursor-pointer items-center gap-2 rounded-none bg-[#3D2B1F] px-4 py-2 text-sm text-white shadow-sm hover:bg-[#2E2017] hover:shadow-md focus:ring-2 focus:ring-[#3D2B1F]/20">
                                            <Plus className="h-4 w-4" />
                                            Add Document
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent className="max-h-[90vh] overflow-y-auto rounded-none border border-[#E7E1D7] bg-white p-6 shadow-sm sm:max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Add Document</DialogTitle>
                                            <DialogDescription>
                                                Create a new legal document that will be available in your product catalog.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <form onSubmit={handleCreateSubmit} className="space-y-5 py-2">
                                            {/* Preview Image & Product Info */}
                                            <div className="grid gap-5 md:grid-cols-[160px_1fr]">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Label htmlFor="image">Preview Image</Label>
                                                    <label
                                                        htmlFor="image"
                                                        className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-none border border-dashed border-[#D6D0C4] bg-[#FCF9F2] text-center text-xs text-[#6B635B] transition hover:border-[#B8A893] hover:bg-[#F8F3EA]"
                                                    >
                                                        {createImagePreview ? (
                                                            <img
                                                                src={createImagePreview}
                                                                alt="Selected preview"
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : selectedCreateImageName ? (
                                                            <div className="px-2 text-xs text-[#3D2B1F]">
                                                                <p className="font-medium">Selected</p>
                                                                <p className="mt-1 line-clamp-2 break-words">{selectedCreateImageName}</p>
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
                                                            className="rounded-none"
                                                        />
                                                        {createForm.errors.title && <p className="text-xs text-red-500">{createForm.errors.title}</p>}
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <Label htmlFor="price">Price (£)</Label>
                                                        <Input
                                                            id="price"
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            placeholder="50"
                                                            value={createForm.data.price}
                                                            onChange={(e) => createForm.setData('price', e.target.value)}
                                                            className="[appearance:textfield] rounded-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                        />
                                                        {createForm.errors.price && <p className="text-xs text-red-500">{createForm.errors.price}</p>}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Legal PDF Upload */}
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="document">Legal Document (PDF)</Label>
                                                <label
                                                    htmlFor="document"
                                                    className="flex cursor-pointer flex-col items-center justify-center rounded-none border border-dashed border-[#D6D0C4] bg-[#FCF9F2] px-4 py-6 text-sm text-[#6B635B] transition hover:border-[#B8A893] hover:bg-[#F8F3EA]"
                                                >
                                                    {selectedCreateDocumentName ? (
                                                        <div className="flex max-w-full items-center gap-2 text-[#1A1614]">
                                                            <FileText className="h-4 w-4 shrink-0 text-[#A68A64]" />
                                                            <span className="max-w-[260px] truncate text-[#A68A64]">
                                                                {selectedCreateDocumentName}
                                                            </span>
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

                                                {createDocumentPreview && (
                                                    <div className="rounded-none border border-[#E7E1D7] bg-white p-4 shadow-sm">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div className="flex min-w-0 items-center gap-3">
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-[#E7E1D7] bg-[#F6F1E8]">
                                                                    <FileText className="h-4 w-4 text-[#A68A64]" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-medium text-[#1A1614]">Selected PDF</p>
                                                                    <p className="max-w-[220px] truncate text-xs text-[#6B635B]">
                                                                        {selectedCreateDocumentName}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <Button
                                                                type="button"
                                                                size="icon"
                                                                variant="outline"
                                                                className="h-10 w-10 shrink-0 rounded-none border-[#D8CFC2] bg-[#FCF9F2] text-[#3D2B1F] hover:bg-[#F5EFE6]"
                                                                onClick={() => openFileInNewTab(createDocumentPreview)}
                                                                aria-label="Preview selected PDF"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    placeholder="Write a short description for this legal document..."
                                                    className="min-h-[110px] rounded-none"
                                                    value={createForm.data.description}
                                                    onChange={(e) => createForm.setData('description', e.target.value)}
                                                />
                                                {createForm.errors.description && (
                                                    <p className="text-xs text-red-500">{createForm.errors.description}</p>
                                                )}
                                            </div>

                                            {/* Dialog Footer */}
                                            <DialogFooter className="gap-2">
                                                <DialogClose asChild>
                                                    <Button type="button" variant="outline" disabled={createForm.processing} className="rounded-none">
                                                        Close
                                                    </Button>
                                                </DialogClose>

                                                <Button
                                                    type="submit"
                                                    disabled={createForm.processing}
                                                    className="rounded-none bg-[#3D2B1F] text-white hover:bg-[#2E2017]"
                                                >
                                                    {createForm.processing ? 'Adding...' : 'Add Document'}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* Total Documents */}
                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-[#6B635B]">Total Documents</CardTitle>
                                <div className="flex h-8 w-8 items-center justify-center border border-[#E7E1D7] bg-[#F2EDE4]">
                                    <FileText className="h-4 w-4 text-[#A68A64]" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-[#1A1614]">{stats.total_documents}</div>
                                <p className="text-xs text-[#6B635B]">Documents in catalog</p>
                            </CardContent>
                        </Card>

                        {/* Active Products */}
                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-[#6B635B]">Active Products</CardTitle>
                                <div className="flex h-8 w-8 items-center justify-center border border-[#E7E1D7] bg-[#F2EDE4]">
                                    <Package className="h-4 w-4 text-[#A68A64]" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-[#1A1614]">{stats.active_products}</div>
                                <p className="text-xs text-[#6B635B]">Available for purchase</p>
                            </CardContent>
                        </Card>

                        {/* Draft Products */}
                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-[#6B635B]">Draft Products</CardTitle>
                                <div className="flex h-8 w-8 items-center justify-center border border-[#E7E1D7] bg-[#F2EDE4]">
                                    <FileClock className="h-4 w-4 text-[#A68A64]" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-[#1A1614]">{stats.draft_products}</div>
                                <p className="text-xs text-[#6B635B]">Not yet published</p>
                            </CardContent>
                        </Card>

                        {/* Top Product */}
                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-[#6B635B]">Top Product</CardTitle>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7E1D7] bg-[#F2EDE4]">
                                    <TrendingUp className="h-4 w-4 text-[#A68A64]" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="truncate text-lg font-bold text-[#1A1614]">{stats.top_product ?? 'None'}</div>
                                <p className="text-xs text-[#6B635B]">Most purchased document</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        {/* Search Input */}
                        <div className="w-full md:max-w-sm">
                            <Input
                                placeholder="Search documents..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 rounded-none border-[#E7E1D7] bg-white focus:ring-2 focus:ring-[#3D2B1F]/20 focus:outline-none"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Price Filter */}
                            <Select value={priceFilter} onValueChange={(value) => setPriceFilter(value as PriceFilter)}>
                                <SelectTrigger className="h-10 w-[160px] rounded-none border-[#E7E1D7] bg-white focus:ring-2 focus:ring-[#3D2B1F]/20">
                                    <SelectValue placeholder="Price filter" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none border-[#E7E1D7]">
                                    <SelectItem value="all" className="rounded-none">
                                        All
                                    </SelectItem>
                                    <SelectItem value="highest" className="rounded-none">
                                        Highest Price
                                    </SelectItem>
                                    <SelectItem value="lowest" className="rounded-none">
                                        Lowest Price
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Sort Filter */}
                            <Select value={sortFilter} onValueChange={(value) => setSortFilter(value as SortFilter)}>
                                <SelectTrigger className="h-10 w-[140px] rounded-none border-[#E7E1D7] bg-white focus:ring-2 focus:ring-[#3D2B1F]/20">
                                    <SelectValue placeholder="Sort" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none border-[#E7E1D7]">
                                    <SelectItem value="az" className="rounded-none">
                                        Name A-Z
                                    </SelectItem>
                                    <SelectItem value="za" className="rounded-none">
                                        Name Z-A
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Card className="rounded-none border border-[#E7E1D7]">
                        {/* Header */}
                        <CardHeader className="flex flex-row items-center justify-between border-b border-[#E7E1D7]">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#1A1614]">
                                <FileText className="h-4 w-4 text-[#3D2B1F]" />
                                Legal Documents <span className="text-[#6B635B]">({totalDocuments})</span>
                            </CardTitle>
                        </CardHeader>

                        {/* Content */}
                        <CardContent className="p-6">
                            {paginatedDocuments.length === 0 ? (
                                <div className="border border-dashed border-[#E7E1D7] bg-[#FCF9F2] px-6 py-10 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center bg-[#F2EDE4]">
                                        <FileText className="h-5 w-5 text-[#A68A64]" />
                                    </div>
                                    <h3 className="text-base font-semibold text-[#1A1614]">No documents found</h3>
                                    <p className="mt-1 text-sm text-[#6B635B]">Try changing your filters or add a new document.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2">
                                    {paginatedDocuments.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex flex-col gap-4 border border-[#E7E1D7] bg-white p-6 hover:shadow-sm sm:flex-row sm:items-start sm:gap-6"
                                        >
                                            {/* Image with border */}
                                            <div className="flex h-40 w-full items-center justify-center overflow-hidden border border-[#E7E1D7] bg-[#F2EDE4] sm:h-32 sm:w-32 sm:flex-shrink-0">
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.title}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/images/products/placeholder.webp';
                                                        }}
                                                    />
                                                ) : (
                                                    <FileText className="h-6 w-6 text-[#A68A64]" />
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex min-w-0 flex-1 flex-col gap-2">
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

                                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                                    <span
                                                        className={`px-2.5 py-1 text-xs font-medium ${
                                                            product.is_active ? 'bg-[#EAF7EE] text-[#1F7A3D]' : 'bg-[#F5EDED] text-[#A94442]'
                                                        }`}
                                                    >
                                                        {product.is_active ? 'Active' : 'Draft'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center justify-end gap-2 sm:flex-col sm:items-center sm:justify-center">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="cursor-pointer rounded-none border border-[#E7E1D7] p-2 hover:bg-[#F8F4EC]"
                                                    onClick={() => setViewingProduct(product)}
                                                    aria-label={`View ${product.title}`}
                                                >
                                                    <Eye className="h-4 w-4 text-[#3D2B1F]" />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="cursor-pointer rounded-none border border-[#E7E1D7] p-2 hover:bg-[#F8F4EC]"
                                                    onClick={() => setEditingProduct(product)}
                                                    aria-label={`Edit ${product.title}`}
                                                >
                                                    <Pencil className="h-4 w-4 text-[#3D2B1F]" />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="cursor-pointer rounded-none border border-[#E7E1D7] p-2 hover:bg-[#F8F4EC]"
                                                    onClick={() => handleDelete(product)}
                                                    aria-label={`Delete ${product.title}`}
                                                >
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
                                <span className="font-medium text-[#1A1614]">{totalDocuments}</span> documents
                            </span>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-none border-[#E7E1D7] bg-white text-[#1A1614] hover:bg-[#F2EDE4]"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((prev) => prev - 1)}
                                >
                                    Prev
                                </Button>

                                <span className="text-sm text-[#6B635B]">
                                    Page <span className="font-medium text-[#1A1614]">{currentPage}</span> of{' '}
                                    <span className="font-medium text-[#1A1614]">{lastPage}</span>
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-none border-[#E7E1D7] bg-white text-[#1A1614] hover:bg-[#F2EDE4]"
                                    disabled={currentPage === lastPage}
                                    onClick={() => setCurrentPage((prev) => prev + 1)}
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
                                resetEditState();
                            }
                        }}
                    >
                        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-none border border-[#E7E1D7] bg-white p-6 shadow-sm sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Edit Document</DialogTitle>
                                <DialogDescription>Update the details of this legal document.</DialogDescription>
                            </DialogHeader>

                            {editingProduct && (
                                <form onSubmit={handleEditSubmit} className="space-y-5 py-2">
                                    <div className="grid gap-5 md:grid-cols-[160px_1fr]">
                                        {/* Image */}
                                        <div className="flex flex-col items-center gap-2">
                                            <Label htmlFor="edit-image">Image</Label>

                                            <label
                                                htmlFor="edit-image"
                                                className="flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-none border border-dashed border-[#D6D0C4] bg-[#FCF9F2] text-center text-xs text-[#6B635B] transition hover:border-[#B8A893] hover:bg-[#F8F3EA]"
                                            >
                                                {editImagePreview ? (
                                                    <img src={editImagePreview} alt="Selected preview" className="h-full w-full object-cover" />
                                                ) : selectedEditImageName ? (
                                                    <div className="px-2 text-[#3D2B1F]">
                                                        <p className="font-medium">Selected</p>
                                                        <p className="mt-1 line-clamp-2 break-words">{selectedEditImageName}</p>
                                                    </div>
                                                ) : editingProduct.image_url ? (
                                                    <img
                                                        src={editingProduct.image_url}
                                                        alt={editingProduct.title}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/images/products/placeholder.webp';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2">
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

                                        {/* Inputs */}
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="edit-title">Document Name</Label>
                                                <Input
                                                    id="edit-title"
                                                    value={editForm.data.title}
                                                    onChange={(e) => editForm.setData('title', e.target.value)}
                                                    className="rounded-none"
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
                                                    className="[appearance:textfield] rounded-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                />
                                                {editForm.errors.price && <p className="text-xs text-red-500">{editForm.errors.price}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* PDF Upload */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="edit-document">Legal Document (PDF)</Label>

                                        <label
                                            htmlFor="edit-document"
                                            className="flex cursor-pointer flex-col items-center justify-center rounded-none border border-dashed border-[#D6D0C4] bg-[#FCF9F2] px-4 py-6 text-sm text-[#6B635B] transition hover:border-[#B8A893] hover:bg-[#F8F3EA]"
                                        >
                                            {selectedEditDocumentName ? (
                                                <div className="flex max-w-full items-center gap-2 text-[#1A1614]">
                                                    <FileText className="h-4 w-4 shrink-0 text-[#A68A64]" />
                                                    <span className="max-w-[260px] truncate text-[#A68A64]">{selectedEditDocumentName}</span>
                                                </div>
                                            ) : (
                                                <div className="flex max-w-full items-center gap-2">
                                                    <FileText className="h-4 w-4 shrink-0" />
                                                    <span className="max-w-[260px] truncate">
                                                        {editingProduct.document_original_name || 'Replace PDF Template'}
                                                    </span>
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

                                        {(editDocumentPreview || editingProduct.document_url) && (
                                            <div className="rounded-none border border-[#E7E1D7] bg-white p-4 shadow-sm">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-[#E7E1D7] bg-[#F6F1E8]">
                                                            <FileText className="h-4 w-4 text-[#A68A64]" />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-[#1A1614]">PDF Document</p>
                                                            <p className="max-w-[220px] truncate text-xs text-[#6B635B]">
                                                                {selectedEditDocumentName ||
                                                                    editingProduct.document_original_name ||
                                                                    'Current PDF file'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="outline"
                                                        className="h-10 w-10 shrink-0 cursor-pointer rounded-none border border-[#D8CFC2] bg-[#FCF9F2] text-[#3D2B1F] hover:bg-[#F5EFE6]"
                                                        onClick={() => openFileInNewTab(editDocumentPreview || editingProduct.document_url)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="edit-description">Description</Label>
                                        <Textarea
                                            id="edit-description"
                                            value={editForm.data.description}
                                            onChange={(e) => editForm.setData('description', e.target.value)}
                                            className="min-h-[110px] rounded-none"
                                        />
                                        {editForm.errors.description && <p className="text-xs text-red-500">{editForm.errors.description}</p>}
                                    </div>

                                    {/* Footer */}
                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={editForm.processing}
                                                className="cursor-pointer rounded-none"
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            type="submit"
                                            disabled={editForm.processing}
                                            className="cursor-pointer rounded-none bg-[#3D2B1F] text-white hover:bg-[#2E2017]"
                                        >
                                            {editForm.processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            )}
                        </DialogContent>
                    </Dialog>

                    <Dialog open={!!viewingProduct} onOpenChange={() => setViewingProduct(null)}>
                        <DialogContent className="max-h-[85vh] max-w-4xl overflow-hidden rounded-none border border-[#E7E1D7] bg-white p-6 shadow-sm">
                            <DialogHeader className="sr-only">
                                <DialogTitle>Document Preview</DialogTitle>
                                <DialogDescription>Preview the selected legal document and its uploaded file.</DialogDescription>
                            </DialogHeader>

                            {viewingProduct && (
                                <div className="flex max-h-[85vh] min-w-0 flex-col gap-6 overflow-y-auto">
                                    {/* Top Section: Image + Info */}
                                    <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-start">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-none border border-[#E7E1D7] bg-[#F2EDE4]">
                                            <img
                                                src={viewingProduct.image_url || '/images/products/placeholder.webp'}
                                                alt={viewingProduct.title}
                                                className="h-full w-full object-cover"
                                                onError={(e) => (e.currentTarget.src = '/images/products/placeholder.webp')}
                                            />
                                        </div>

                                        <div className="flex min-w-0 flex-1 flex-col gap-2 overflow-hidden">
                                            <div className="flex min-w-0 items-start justify-between gap-3">
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

                                                <span className="shrink-0 text-sm font-semibold text-[#3D2B1F]">
                                                    {formatPrice(viewingProduct.price)}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                        viewingProduct.is_active ? 'bg-[#EAF7EE] text-[#1F7A3D]' : 'bg-[#F5EDED] text-[#A94442]'
                                                    }`}
                                                >
                                                    {viewingProduct.is_active ? 'Active' : 'Draft'}
                                                </span>
                                            </div>

                                            <p className="max-w-full text-sm leading-relaxed break-words text-[#6B635B]">
                                                {viewingProduct.description || 'No description provided.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-[#E7E1D7]" />

                                    {/* PDF Section */}
                                    <div className="flex min-w-0 flex-col gap-3">
                                        <h3 className="text-sm font-medium text-[#1A1614]">Legal Template Preview</h3>

                                        <div className="min-w-0 overflow-hidden rounded-none border border-[#E7E1D7] bg-gradient-to-br from-white to-[#FCF9F2] p-5 shadow-sm">
                                            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex min-w-0 items-center gap-3 overflow-hidden">
                                                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-none border border-[#E7E1D7] bg-[#F6F1E8]">
                                                        <FileText className="h-5 w-5 text-[#A68A64]" />
                                                    </div>

                                                    <div className="min-w-0 overflow-hidden">
                                                        <p className="text-sm font-semibold text-[#1A1614]">PDF Document</p>
                                                        <p className="truncate text-xs text-[#6B635B]">
                                                            {viewingProduct.document_original_name || 'No PDF file available'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="outline"
                                                    disabled={!viewingProduct.document_url}
                                                    onClick={() => openFileInNewTab(viewingProduct.document_url)}
                                                    className="h-10 w-10 flex-shrink-0 cursor-pointer rounded-none border border-[#D8CFC2] bg-[#FCF9F2] text-[#3D2B1F] hover:bg-[#F5EFE6] disabled:cursor-not-allowed disabled:border-[#E7E1D7] disabled:bg-[#F5F2EC] disabled:text-[#B7AEA2]"
                                                    aria-label={`Open PDF for ${viewingProduct.title}`}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
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
