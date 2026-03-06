import { Button } from '@/components/ui/button';
import React, { DragEvent, useRef, useState } from 'react';

interface ProofOfAddressProps {
    onFileChange?: (file: File | null) => void;
    onLocationChange?: (location: string) => void;
}

const ProofOfAddress: React.FC<ProofOfAddressProps> = ({ onFileChange, onLocationChange }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [location, setLocation] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFile = (selectedFile: File | null) => {
        setFile(selectedFile);
        onFileChange?.(selectedFile);

        if (selectedFile && selectedFile.type.startsWith('image')) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        handleFile(selectedFile);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        handleFile(droppedFile);
    };

    const handleRemove = () => {
        handleFile(null);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(e.target.value);
        onLocationChange?.(e.target.value);
    };

    return (
        <div className="flex flex-col gap-4">
            {/* add input */}
            <div className="flex flex-col gap-2">
                <label htmlFor="address-location" className="text-sm font-medium text-[#3D2B1F]">
                    Full Location Address:
                </label>
                <input
                    id="address-location"
                    type="text"
                    placeholder="221B Baker Street, London NW1 6XE, UK"
                    className="rounded border border-[#E8E2D6] bg-white px-3 py-2 text-sm shadow-sm focus:border-[#3D2B1F] focus:ring focus:ring-[#3D2B1F]/20"
                    value={location}
                    onChange={handleLocationChange}
                    required
                />
            </div>

            {/* File upload */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => inputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                    isDragging ? 'border-[#3D2B1F] bg-[#FCF9F2]' : 'border-[#E8E2D6] bg-white hover:bg-[#F5F3EE]'
                }`}
            >
                {preview ? (
                    <img src={preview} alt="Preview" className="h-40 w-auto rounded border border-[#E8E2D6] object-cover" />
                ) : (
                    <>
                        <p className="text-sm text-[#70665E]">
                            Drag & drop a recent utility bill, bank statement, or official document showing your address.
                        </p>
                        <p className="text-xs text-[#A68A64]">Accepted: JPG, PNG, PDF | Max size: 10MB</p>
                    </>
                )}
            </div>

            <div className="flex items-center justify-between">
                {!file || !location ? <p className="text-xs text-red-600">Please upload a document and enter your location to continue.</p> : <div />}

                {file && preview && (
                    <Button variant="destructive" size="sm" onClick={handleRemove}>
                        Remove
                    </Button>
                )}
            </div>

            <input ref={inputRef} type="file" accept="image/*,application/pdf" onChange={handleChange} className="hidden" />
        </div>
    );
};

export default ProofOfAddress;
