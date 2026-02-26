import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for our database tables
export type Profile = {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  village?: string
  city?: string
  province?: string
  postal_code?: string
  avatar_url?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export type Product = {
  id: string
  user_id: string
  name: string
  price: number
  stock: number
  unit: string
  status: 'active' | 'inactive'
  image_url?: string
  description?: string
  created_at: string
  updated_at: string
}

export type Order = {
  id: string
  product_id?: string
  seller_id: string
  buyer_name: string
  buyer_phone?: string
  quantity: number
  total_price: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
}

export type Notification = {
  id: string
  user_id: string
  type: 'order' | 'payment' | 'product' | 'price' | 'system' | 'message'
  title: string
  message: string
  is_read: boolean
  is_important: boolean
  data?: any
  created_at: string
}

export type MarketPrice = {
  id: string
  commodity_name: string
  current_price: number
  change: number
  change_percent: number
  unit: string
  market: string
  high?: number
  low?: number
  volume?: number
  last_updated: string
}