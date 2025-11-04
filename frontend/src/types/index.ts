// Common types for the application

export type Locale = 'fr' | 'en' | 'ka';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'user' | 'admin' | 'super_admin';
  created_at: string;
  updated_at: string;
}

export interface Formation {
  id: string;
  title: LocalizedContent;
  description: LocalizedContent;
  short_description: LocalizedContent;
  price: number;
  currency: string;
  duration_hours: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  image_url?: string;
  video_url?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface LocalizedContent {
  fr: string;
  en?: string;
  ka?: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  formation_id: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  progress: number;
  enrolled_at: string;
  completed_at?: string;
}

export interface Payment {
  id: string;
  user_id: string;
  formation_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: 'bog' | 'manual';
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}