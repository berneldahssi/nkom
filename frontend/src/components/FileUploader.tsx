"use client";

import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  acceptedTypes?: string[];
}

export default function FileUploader({
  onFileSelect,
  isLoading = false,
  acceptedTypes = [".mp3", ".pdf"],
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      } else {
        alert(`Invalid file type. Accepted: ${acceptedTypes.join(", ")}`);
      }
    }
  };

  const isValidFile = (file: File): boolean => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    return acceptedTypes.includes(ext);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      } else {
        alert(`Invalid file type. Accepted: ${acceptedTypes.join(", ")}`);
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-primary/10 bg-white p-6">
      {selectedFile ? (
        <>
          {/* File selected state */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Upload size={32} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-charcoal truncate">{selectedFile.name}</p>
              <p className="text-xs text-charcoal/60">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              onClick={clearFile}
              className="p-2 hover:bg-neutral rounded-lg transition"
              disabled={isLoading}
            >
              <X size={20} className="text-charcoal/60" />
            </button>
          </div>
          <button
            onClick={handleClick}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary-600 disabled:opacity-60"
          >
            <Upload size={18} />
            {isLoading ? "Processing..." : "Upload & Generate"}
          </button>
        </>
      ) : (
        <>
          {/* File upload area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition cursor-pointer ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-primary/20 bg-primary/5"
            }`}
          >
            <Upload size={40} className={dragActive ? "text-primary" : "text-charcoal/30"} />
            <div className="text-center">
              <p className="font-medium text-charcoal">
                {dragActive ? "Drop your file here" : "Drag & drop your file"}
              </p>
              <p className="text-sm text-charcoal/60">or click to browse</p>
            </div>
            <p className="text-xs text-charcoal/40">
              Supported: {acceptedTypes.join(", ")}
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            onChange={handleChange}
            accept={acceptedTypes.join(",")}
            className="hidden"
            disabled={isLoading}
          />
        </>
      )}
    </div>
  );
}
