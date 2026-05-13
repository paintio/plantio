'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  currentImage?: string
}

export default function ImageUpload({ onImageUploaded, currentImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    setUploading(true)
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        setPreview(data.url)
        onImageUploaded(data.url)
      } else {
        alert(data.error || 'Ошибка загрузки')
      }
    } catch (error) {
      alert('Ошибка загрузки')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadImage(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) uploadImage(file)
  }

  const removeImage = () => {
    setPreview(null)
    onImageUploaded('')
  }

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          className={`relative w-full aspect-square rounded-lg border-2 border-dashed transition ${
            dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400" />
                <p className="text-sm text-gray-500 text-center">
                  Нажмите или перетащите<br />фото растения
                </p>
                <p className="text-xs text-gray-400">JPEG, PNG, WEBP до 5MB</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
