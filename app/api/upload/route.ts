import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }
    
    // Проверяем тип файла
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only images allowed' }, { status: 400 })
    }
    
    // Проверяем размер (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Генерируем уникальное имя файла
    const ext = file.name.split('.').pop()
    const filename = `${uuidv4()}.${ext}`
    const filepath = `uploads/${filename}`
    
    // Загружаем в Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filepath, buffer, {
        contentType: file.type,
        cacheControl: '3600'
      })
    
    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
    
    // Получаем публичный URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filepath)
    
    return NextResponse.json({ success: true, url: urlData.publicUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
