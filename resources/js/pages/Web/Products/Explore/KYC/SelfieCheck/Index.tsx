import { Button } from '@/components/ui/button';
import React, { useRef, useState } from 'react';

interface SelfieCheckProps {
    onFileChange?: (file: File | null) => void;
}

const SelfieCheck: React.FC<SelfieCheckProps> = ({ onFileChange }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFile = (selectedFile: File | null) => {
        setFile(selectedFile);
        onFileChange?.(selectedFile);

        if (selectedFile) {
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

    const handleRemove = () => {
        handleFile(null);
    };

    return (
        <div className="flex flex-col gap-4">
            <div
                onClick={() => inputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors hover:bg-[#F5F3EE]`}
            >
                {preview ? (
                    <img src={preview} alt="Selfie Preview" className="h-40 w-auto rounded border border-[#E8E2D6] object-cover" />
                ) : (
                    <>
                        <p className="text-sm text-[#70665E]">Take a selfie or upload an image for verification.</p>
                        <p className="text-xs text-[#A68A64]">Accepted: JPG, PNG | Max size: 10MB</p>
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

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="user" // opens camera on mobile devices
                onChange={handleChange}
                className="hidden"
            />
        </div>
    );
};

export default SelfieCheck;
