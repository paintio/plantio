'use client'

import { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface MultiImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export default function MultiImageUpload({ images, onChange, maxImages = 5 }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const uploadImage = async (file: File) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      onChange([...images, data.url])
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border">
            <img src={img} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => removeImage(idx)}
              className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])}
              disabled={uploading}
            />
            {uploading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600" />
            ) : (
              <>
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-xs text-gray-400">Загрузить</span>
              </>
            )}
          </label>
        )}
      </div>
      <p className="text-xs text-gray-400">Максимум {maxImages} фото</p>
    </div>
  )
}
