import { Button } from '@/components/ui/button';
import React, { DragEvent, useRef, useState } from 'react';

interface ProofOfIdentityProps {
    onFileChange?: (file: File | null) => void;
    required?: boolean;
}

const ProofOfIdentity: React.FC<ProofOfIdentityProps> = ({ onFileChange }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
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

    return (
        <div className="flex flex-col gap-4">
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => inputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${isDragging ? 'border-[#3D2B1F] bg-[#FCF9F2]' : 'border-[#E8E2D6] bg-white hover:bg-[#F5F3EE]'}`}
            >
                {preview ? (
                    <img src={preview} alt="Preview" className="h-40 w-auto rounded border border-[#E8E2D6] object-cover" />
                ) : (
                    <>
                        <p className="text-sm text-[#70665E]">Drag & drop your government-issued ID here, or click to select a file.</p>
                        <p className="text-xs text-[#A68A64]">Accepted: JPG, PNG, PDF | Max size: 10MB</p>
                    </>
                )}
            </div>

            {file && preview && (
                <div className="flex justify-end">
                    <Button variant="destructive" size="sm" onClick={handleRemove}>
                        Remove
                    </Button>
                </div>
            )}

            <input ref={inputRef} type="file" accept="image/*,application/pdf" onChange={handleChange} className="hidden" />
        </div>
    );
};

export default ProofOfIdentity;
