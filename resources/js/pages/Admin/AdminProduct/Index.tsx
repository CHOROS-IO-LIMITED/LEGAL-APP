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
import { Eye, FileClock, FileText, Package, Pencil, Plus, Trash2, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface User {
    name: string;
    email: string;
}

interface ProductIndexProps {
    user: User;
}

const products = [
    {
        name: 'Employment Contract',
        description: 'A legally binding agreement outlining employment terms, responsibilities, and conditions between employer and employee.',
        price: '$49',
        image: '/images/products/placeholder.webp',
    },
    {
        name: 'Non-Disclosure Agreement',
        description: 'Protects confidential business information shared between parties during employment or partnerships.',
        price: '$29',
        image: '/images/products/placeholder.webp',
    },
    {
        name: 'Independent Contractor Agreement',
        description: 'Defines the working relationship, payment terms, and responsibilities between a business and an independent contractor.',
        price: '$39',
        image: '/images/products/placeholder.webp',
    },
    {
        name: 'Service Agreement',
        description: 'Outlines the terms and expectations between a service provider and a client, including scope, payment, and responsibilities.',
        price: '$35',
        image: '/images/products/placeholder.webp',
    },
    {
        name: 'Partnership Agreement',
        description: 'Defines ownership, responsibilities, profit sharing, and decision-making rules between business partners.',
        price: '$59',
        image: '/images/products/placeholder.webp',
    },
    {
        name: 'Lease Agreement',
        description: 'A legal contract between a landlord and tenant specifying rental terms, payment schedule, and property usage rules.',
        price: '$45',
        image: '/images/products/placeholder.webp',
    },
    {
        name: 'Freelance Contract',
        description: 'Establishes the terms of work between a freelancer and client including deliverables, payment, and deadlines.',
        price: '$32',
        image: '/images/products/placeholder.webp',
    },
    {
        name: 'Consulting Agreement',
        description: 'Defines the relationship between a consultant and a client, including services provided, compensation, and confidentiality.',
        price: '$42',
        image: '/images/products/placeholder.webp',
    },
    {
        name: 'Privacy Policy',
        description: 'A legally compliant privacy policy explaining how a business collects, stores, and uses customer data.',
        price: '$25',
        image: '/images/products/placeholder.webp',
    },
    {
        name: 'Terms and Conditions',
        description: 'A comprehensive set of rules and guidelines users must agree to when using a website, app, or service.',
        price: '$27',
        image: '/images/products/placeholder.webp',
    },
    {
        name: 'Shareholder Agreement',
        description: 'Defines the rights, obligations, and ownership structure among shareholders in a company.',
        price: '$69',
        image: '/images/products/placeholder.webp',
    },
    {
        name: 'Letter of Intent',
        description: 'A preliminary document outlining the key terms of a proposed agreement before a formal contract is signed.',
        price: '$31',
        image: '/images/products/placeholder.webp',
    },
];

export default function ProductIndex({ user }: ProductIndexProps) {
    // UI state
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [editingProduct, setEditingProduct] = useState<(typeof products)[0] | null>(null);
    const [viewingProduct, setViewingProduct] = useState<(typeof products)[0] | null>(null);

    // pagination state
    const [currentPage, setCurrentPage] = useState(1);

    // pagination config
    const ITEMS_PER_PAGE = 6;

    // derived pagination values
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProducts = products.slice(startIndex, endIndex);

    // handlers
    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setDocumentFile(file);
    };

    return (
        <AdminLayout user={user}>
            <main className="flex-1 overflow-y-auto bg-[#FCF9F2] p-4 md:p-6">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1A1614]">Legal Products</h1>
                            <p className="text-sm text-[#6B635B]">Manage all your legal documents here. Add, edit, or remove items as needed.</p>
                        </div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-[#3D2B1F] text-white hover:bg-[#5A4638]">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Document
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Add Document</DialogTitle>
                                    <DialogDescription>Create a new legal document that will be available in your product catalog.</DialogDescription>
                                </DialogHeader>

                                <form className="space-y-4 py-4">
                                    <div className="grid grid-cols-[120px_1fr] gap-4">
                                        {/* Upload Image */}
                                        <div className="flex flex-col items-center gap-2">
                                            <Label htmlFor="image">Image</Label>

                                            <label
                                                htmlFor="image"
                                                className="flex h-28 w-28 cursor-pointer items-center justify-center rounded-md border border-dashed border-[#D6D0C4] bg-[#FCF9F2] text-xs text-[#6B635B]"
                                            >
                                                Upload
                                            </label>

                                            <input id="image" type="file" accept="image/*" className="hidden" />
                                        </div>

                                        {/* Name + Price */}
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="name">Product Name</Label>
                                                <Input id="name" placeholder="Employment Contract" />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="price">Price (£)</Label>

                                                <Input
                                                    id="price"
                                                    type="number"
                                                    placeholder="50"
                                                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="document">Legal Document (PDF)</Label>

                                        <label
                                            htmlFor="document"
                                            className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-[#D6D0C4] bg-[#FCF9F2] px-4 py-6 text-sm text-[#6B635B]"
                                        >
                                            {documentFile ? (
                                                <div className="flex items-center gap-2 text-[#1A1614]">
                                                    <FileText className="h-4 w-4 text-[#A68A64]" />
                                                    <span className="max-w-[220px] truncate text-[#A68A64]">{documentFile.name}</span>
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
                                            onChange={handleDocumentUpload}
                                            className="hidden"
                                        />

                                        <p className="text-xs text-[#9C9389]">
                                            Upload the legal template the AI will use to generate documents from user responses.
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="description">Description</Label>

                                        <Textarea
                                            id="description"
                                            placeholder="Write a short description for this legal document..."
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                </form>

                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button variant="outline">Close</Button>
                                    </DialogClose>

                                    <Button className="bg-[#3D2B1F] text-white hover:bg-[#5A4638]">Add Document</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
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
                                <div className="text-2xl font-bold text-[#1A1614]">24</div>
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
                                <div className="text-2xl font-bold text-[#1A1614]">18</div>
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
                                <div className="text-2xl font-bold text-[#1A1614]">6</div>
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
                                <div className="text-lg font-bold text-[#1A1614]">Employment Contract</div>
                                <p className="text-xs text-[#6B635B]">Most purchased document</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        {/* Search */}
                        <div className="w-full md:max-w-sm">
                            <Input placeholder="Search documents..." className="border-[#E7E1D7] bg-white" />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[140px] border-[#E7E1D7] bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="highest">Highest Price</SelectItem>
                                    <SelectItem value="lowest">Lowest</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select defaultValue="az">
                                <SelectTrigger className="w-[140px] border-[#E7E1D7] bg-white">
                                    <SelectValue />
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
                                Legal Documents <span className="text-[#6B635B]">({products.length})</span>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="grid gap-6 p-6 md:grid-cols-2">
                            {paginatedProducts.map((product, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-4 rounded-xl border border-[#E7E1D7] bg-white p-6 sm:flex-row sm:items-start sm:gap-6"
                                >
                                    {/* Image */}
                                    <div className="h-40 w-full overflow-hidden rounded-lg border border-[#E7E1D7] bg-[#F2EDE4] sm:h-32 sm:w-32 sm:flex-shrink-0">
                                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <h3 className="max-w-[220px] truncate text-base font-semibold text-[#1A1614]">
                                                            {product.name}
                                                        </h3>
                                                    </TooltipTrigger>

                                                    <TooltipContent>
                                                        <p>{product.name}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <span className="text-sm font-semibold text-[#3D2B1F]">{product.price}</span>
                                        </div>

                                        <p className="line-clamp-3 text-sm leading-relaxed text-[#6B635B]">{product.description}</p>
                                    </div>

                                    {/* Vertical Actions */}
                                    <div className="flex items-center justify-end gap-2 sm:flex-col sm:items-center sm:justify-center">
                                        <Button variant="ghost" size="icon" onClick={() => setViewingProduct(product)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>

                                        <Button variant="ghost" size="icon" onClick={() => setEditingProduct(product)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        <Button variant="ghost" size="icon">
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>

                        <div className="flex items-center justify-between border-t border-[#E7E1D7] px-6 py-4 text-sm text-[#6B635B]">
                            <span>
                                Showing <span className="font-medium text-[#1A1614]">{startIndex + 1}</span> –{' '}
                                <span className="font-medium text-[#1A1614]">{Math.min(endIndex, products.length)}</span> of{' '}
                                <span className="font-medium text-[#1A1614]">{products.length}</span> documents
                            </span>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                >
                                    Prev
                                </Button>

                                <span className="text-sm text-[#6B635B]">
                                    Page <span className="font-medium text-[#1A1614]">{currentPage}</span> of{' '}
                                    <span className="font-medium text-[#1A1614]">{totalPages}</span>
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Edit Document</DialogTitle>
                                <DialogDescription>Update the details of this legal document.</DialogDescription>
                            </DialogHeader>

                            {editingProduct && (
                                <form className="space-y-4 py-4">
                                    <div className="grid grid-cols-[120px_1fr] gap-4">
                                        {/* Image */}
                                        <div className="flex flex-col items-center gap-2">
                                            <Label>Image</Label>

                                            <label
                                                htmlFor="edit-image"
                                                className="flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-[#D6D0C4] bg-[#FCF9F2]"
                                            >
                                                <img src={editingProduct.image} className="h-full w-full object-cover" />
                                            </label>

                                            <Input id="edit-image" type="file" accept="image/*" className="hidden" />
                                        </div>

                                        {/* Name + Price */}
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col gap-2">
                                                <Label>Name</Label>
                                                <Input defaultValue={editingProduct.name} />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <Label>Price (£)</Label>
                                                <Input type="number" defaultValue={editingProduct.price.replace('$', '')} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="edit-document">Legal Document (PDF)</Label>

                                        <label
                                            htmlFor="edit-document"
                                            className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-[#D6D0C4] bg-[#FCF9F2] px-4 py-6 text-sm text-[#6B635B]"
                                        >
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                <span>Replace PDF Template</span>
                                            </div>
                                        </label>

                                        <Input id="edit-document" type="file" accept="application/pdf" className="hidden" />

                                        <p className="text-xs text-[#9C9389]">
                                            Upload a new template if you want to replace the document used for AI generation.
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <div className="flex flex-col gap-2">
                                        <Label>Description</Label>
                                        <Textarea defaultValue={editingProduct.description} className="min-h-[100px]" />
                                    </div>
                                </form>
                            )}

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>

                                <Button className="bg-[#3D2B1F] text-white hover:bg-[#5A4638]">Save Changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={!!viewingProduct} onOpenChange={() => setViewingProduct(null)}>
                        <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden p-0">
                            {viewingProduct && (
                                <div className="flex max-h-[85vh] flex-col overflow-y-auto p-6">
                                    {/* Overview */}
                                    <div className="flex items-start gap-4">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-[#E7E1D7] bg-[#F2E2DE4]">
                                            <img src={viewingProduct.image} alt={viewingProduct.name} className="h-full w-full object-cover" />
                                        </div>

                                        <div className="flex flex-1 flex-col gap-2">
                                            {/* Name + Price */}
                                            <div className="flex items-center justify-between gap-3">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <h2 className="min-w-0 flex-1 cursor-pointer truncate text-lg font-semibold text-[#1A1614]">
                                                                {viewingProduct.name}
                                                            </h2>
                                                        </TooltipTrigger>

                                                        <TooltipContent>
                                                            <p>{viewingProduct.name}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <span className="flex-shrink-0 text-sm font-semibold text-[#3D2B1F]">{viewingProduct.price}</span>
                                            </div>

                                            <p className="text-sm leading-relaxed text-[#6B635B]">{viewingProduct.description}</p>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="my-6 border-t border-[#E7E1D7]" />

                                    {/* PDF Preview */}
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-sm font-medium text-[#1A1614]">Legal Template Preview</h3>

                                        <div className="overflow-hidden rounded-md border border-[#E7E1D7]">
                                            <iframe src="/documents/sample.pdf" title="Legal Template" className="h-[500px] w-full" />
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
