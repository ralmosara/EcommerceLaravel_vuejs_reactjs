import { z } from 'zod'
import { AlbumFormat } from '@/api/types/models'

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(255, 'Email is too long'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
    email: z.string().email('Invalid email address').max(255, 'Email is too long'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    password_confirmation: z.string().min(1, 'Please confirm your password'),
    phone: z.string().max(20, 'Phone number is too long').optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ['password_confirmation'],
  })

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  email: z.string().email('Invalid email address').max(255, 'Email is too long'),
  phone: z.string().max(20, 'Phone number is too long').optional().or(z.literal('')),
})

// Address Schema
export const addressSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(255, 'Name is too long'),
  phone: z.string().min(1, 'Phone is required').max(20, 'Phone number is too long'),
  address_line1: z.string().min(1, 'Address is required').max(255, 'Address is too long'),
  address_line2: z.string().max(255, 'Address is too long').optional().or(z.literal('')),
  city: z.string().min(1, 'City is required').max(100, 'City name is too long'),
  state: z.string().max(100, 'State name is too long').optional().or(z.literal('')),
  postal_code: z.string().min(1, 'Postal code is required').max(20, 'Postal code is too long'),
  country: z.string().min(2, 'Country is required').max(2, 'Invalid country code'),
  is_default_shipping: z.boolean().optional(),
  is_default_billing: z.boolean().optional(),
})

// Album Schema (Admin)
export const albumSchema = z.object({
  artist_id: z.string().min(1, 'Artist is required'),
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  format: z.nativeEnum(AlbumFormat, { errorMap: () => ({ message: 'Invalid format' }) }),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .min(0, 'Price cannot be negative')
    .max(9999.99, 'Price is too high'),
  sale_price: z
    .number({ invalid_type_error: 'Sale price must be a number' })
    .min(0, 'Sale price cannot be negative')
    .max(9999.99, 'Sale price is too high')
    .optional()
    .nullable(),
  description: z.string().max(5000, 'Description is too long').optional().or(z.literal('')),
  release_year: z
    .number({ invalid_type_error: 'Release year must be a number' })
    .int('Release year must be an integer')
    .min(1900, 'Release year is too old')
    .max(new Date().getFullYear() + 1, 'Release year is too far in the future')
    .optional()
    .nullable(),
  label: z.string().max(100, 'Label name is too long').optional().or(z.literal('')),
  catalog_number: z.string().max(50, 'Catalog number is too long').optional().or(z.literal('')),
  cover_image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  genres: z.array(z.string()).optional(),
  is_featured: z.boolean().optional(),
}).refine(
  (data) => {
    if (data.sale_price && data.sale_price >= data.price) {
      return false
    }
    return true
  },
  {
    message: 'Sale price must be less than regular price',
    path: ['sale_price'],
  }
)

// Artist Schema (Admin)
export const artistSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  bio: z.string().max(5000, 'Bio is too long').optional().or(z.literal('')),
  origin: z.string().max(100, 'Origin is too long').optional().or(z.literal('')),
  formed_year: z
    .number({ invalid_type_error: 'Formed year must be a number' })
    .int('Formed year must be an integer')
    .min(1900, 'Formed year is too old')
    .max(new Date().getFullYear(), 'Formed year cannot be in the future')
    .optional()
    .nullable(),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
})

// Genre Schema (Admin)
export const genreSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().max(1000, 'Description is too long').optional().or(z.literal('')),
  parent_id: z.string().optional().nullable(),
})

// Review Schema
export const reviewSchema = z.object({
  rating: z
    .number({ invalid_type_error: 'Rating is required' })
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot be more than 5'),
  title: z.string().max(255, 'Title is too long').optional().or(z.literal('')),
  body: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(2000, 'Review is too long')
    .optional()
    .or(z.literal('')),
})

// Cart Item Schema
export const addToCartSchema = z.object({
  album_id: z.string().min(1, 'Album is required'),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1')
    .max(99, 'Quantity cannot exceed 99'),
})

export const updateCartItemSchema = z.object({
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be an integer')
    .min(0, 'Quantity cannot be negative')
    .max(99, 'Quantity cannot exceed 99'),
})

// Coupon Schema
export const applyCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').max(50, 'Coupon code is too long'),
})

// Order Schema
export const createOrderSchema = z.object({
  shipping_address: addressSchema,
  billing_address: addressSchema.optional(),
  use_same_address: z.boolean().optional(),
  shipping_method: z.string().optional(),
  customer_notes: z.string().max(1000, 'Notes are too long').optional().or(z.literal('')),
})

// Inventory Update Schema (Admin)
export const updateInventorySchema = z.object({
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be an integer')
    .min(0, 'Quantity cannot be negative'),
})

export const addStockSchema = z.object({
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1'),
})

// Order Status Update Schema (Admin)
export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
  tracking_number: z.string().max(100, 'Tracking number is too long').optional().or(z.literal('')),
  admin_notes: z.string().max(1000, 'Notes are too long').optional().or(z.literal('')),
})

// User Role Update Schema (Admin)
export const updateUserRoleSchema = z.object({
  role: z.enum(['admin', 'customer']),
})

// Search Schema
export const searchSchema = z.object({
  q: z.string().min(1, 'Search query is required').max(255, 'Search query is too long'),
})

// Contact Form Schema
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  email: z.string().email('Invalid email address').max(255, 'Email is too long'),
  subject: z.string().min(1, 'Subject is required').max(255, 'Subject is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message is too long'),
})

// Newsletter Schema
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address').max(255, 'Email is too long'),
})

// TypeScript types inferred from schemas
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
export type AddressFormData = z.infer<typeof addressSchema>
export type AlbumFormData = z.infer<typeof albumSchema>
export type ArtistFormData = z.infer<typeof artistSchema>
export type GenreFormData = z.infer<typeof genreSchema>
export type ReviewFormData = z.infer<typeof reviewSchema>
export type AddToCartFormData = z.infer<typeof addToCartSchema>
export type UpdateCartItemFormData = z.infer<typeof updateCartItemSchema>
export type ApplyCouponFormData = z.infer<typeof applyCouponSchema>
export type CreateOrderFormData = z.infer<typeof createOrderSchema>
export type UpdateInventoryFormData = z.infer<typeof updateInventorySchema>
export type AddStockFormData = z.infer<typeof addStockSchema>
export type UpdateOrderStatusFormData = z.infer<typeof updateOrderStatusSchema>
export type UpdateUserRoleFormData = z.infer<typeof updateUserRoleSchema>
export type SearchFormData = z.infer<typeof searchSchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type NewsletterFormData = z.infer<typeof newsletterSchema>
