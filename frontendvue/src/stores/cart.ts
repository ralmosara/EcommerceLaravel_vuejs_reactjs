import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Cart } from '@/api/types/models'
import { cartApi } from '@/api/endpoints/cart'
import type { AddToCartData, UpdateCartItemData, ApplyCouponData } from '@/api/endpoints/cart'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useCartStore = defineStore('cart', () => {
  // State
  const cart = ref<Cart | null>(null)
  const loading = ref(false)
  const initialized = ref(false)

  // Getters
  const itemCount = computed(() => cart.value?.total_items || 0)
  const subtotal = computed(() => cart.value?.subtotal || 0)
  const discountAmount = computed(() => cart.value?.discount_amount || 0)
  const total = computed(() => cart.value?.total || 0)
  const isEmpty = computed(() => cart.value?.is_empty ?? true)
  const items = computed(() => cart.value?.items || [])
  const coupon = computed(() => cart.value?.coupon || null)

  // Actions
  async function fetchCart() {
    try {
      loading.value = true
      const data = await cartApi.getCart()
      cart.value = data
      return data
    } catch (error) {
      console.error('Failed to fetch cart:', error)
      // Initialize empty cart on error
      cart.value = {
        items: [],
        subtotal: 0,
        discount_amount: 0,
        total: 0,
        total_items: 0,
        is_empty: true,
        updated_at: new Date().toISOString()
      }
      throw error
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  async function addItem(itemData: AddToCartData) {
    try {
      loading.value = true
      const data = await cartApi.addItem(itemData)
      cart.value = data
      toast.success('Item added to cart')
      return data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart'
      toast.error(errorMessage)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateItemQuantity(albumUuid: string, quantity: number) {
    try {
      loading.value = true
      const itemData: UpdateCartItemData = { quantity }
      const data = await cartApi.updateItem(albumUuid, itemData)
      cart.value = data

      if (quantity === 0) {
        toast.success('Item removed from cart')
      } else {
        toast.success('Cart updated')
      }

      return data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update cart'
      toast.error(errorMessage)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function removeItem(albumUuid: string) {
    try {
      loading.value = true
      const data = await cartApi.removeItem(albumUuid)
      cart.value = data
      toast.success('Item removed from cart')
      return data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to remove item'
      toast.error(errorMessage)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function clearCart() {
    try {
      loading.value = true
      const data = await cartApi.clearCart()
      cart.value = data
      toast.success('Cart cleared')
      return data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to clear cart'
      toast.error(errorMessage)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function applyCoupon(code: string) {
    try {
      loading.value = true
      const couponData: ApplyCouponData = { code }
      const data = await cartApi.applyCoupon(couponData)
      cart.value = data
      toast.success('Coupon applied successfully')
      return data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid coupon code'
      toast.error(errorMessage)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function removeCoupon() {
    try {
      loading.value = true
      const data = await cartApi.removeCoupon()
      cart.value = data
      toast.success('Coupon removed')
      return data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to remove coupon'
      toast.error(errorMessage)
      throw error
    } finally {
      loading.value = false
    }
  }

  function initializeCart() {
    if (!initialized.value) {
      fetchCart().catch(() => {
        // Cart fetch failed, but we already set empty cart in fetchCart
        console.warn('Failed to initialize cart')
      })
    }
  }

  return {
    cart,
    loading,
    initialized,
    itemCount,
    subtotal,
    discountAmount,
    total,
    isEmpty,
    items,
    coupon,
    fetchCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    initializeCart
  }
})
