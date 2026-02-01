import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'

export function useCart() {
  const cartStore = useCartStore()

  // Refs
  const {
    cart,
    loading,
    initialized,
    itemCount,
    subtotal,
    discountAmount,
    total,
    isEmpty,
    items,
    coupon
  } = storeToRefs(cartStore)

  // Actions
  const {
    fetchCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    initializeCart
  } = cartStore

  // Helper function to add album to cart
  const addAlbumToCart = async (albumUuid: string, quantity: number = 1) => {
    return await addItem({ album_id: albumUuid, quantity })
  }

  // Helper function to increment quantity
  const incrementQuantity = async (albumUuid: string, currentQuantity: number) => {
    return await updateItemQuantity(albumUuid, currentQuantity + 1)
  }

  // Helper function to decrement quantity
  const decrementQuantity = async (albumUuid: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      return await updateItemQuantity(albumUuid, currentQuantity - 1)
    } else {
      return await removeItem(albumUuid)
    }
  }

  return {
    // State
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
    // Actions
    fetchCart,
    addItem,
    addAlbumToCart,
    updateItemQuantity,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    initializeCart
  }
}
