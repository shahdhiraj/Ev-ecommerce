import React, { createContext, useContext, useEffect, useState } from 'react'
import { catalogue, type Product } from '../data/catalog'
import {
  type CartItem,
  type NepalAddress,
  type NepalProvince,
  type Order,
  type ShippingMethod,
  type UserSession,
  type UserRole,
  type StoreSettings,
  calculateLandedCost,
  DEFAULT_USER,
  OWNER_USER,
  DEFAULT_STORE_SETTINGS,
  INITIAL_CART_ITEMS,
  PRESEEDED_ORDERS,
  SHIPPING_METHODS,
  VALID_PROMO_CODES,
} from './commerceStore'

export type WishlistEntry = {
  id: string
  productId: string
  variantId: string | null
  savedAt: number | null
}

export type CommerceContextType = {
  // Cart
  cartItems: CartItem[]
  addToCart: (productName: string, options?: { quantity?: number; variant?: string; sku?: string }) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  saveForLater: (itemId: string) => void
  undoLastRemove: () => void
  lastRemovedItem: CartItem | null
  clearCart: () => void
  cartCount: number

  // Destination & Shipping
  deliveryDestination: { province: NepalProvince; district: string }
  setDeliveryDestination: (dest: { province: NepalProvince; district: string }) => void
  selectedShipping: ShippingMethod
  setSelectedShipping: (method: ShippingMethod) => void

  // Promo Code
  appliedPromo: string | null
  applyPromo: (code: string) => { success: boolean; message: string }
  removePromo: () => void

  // Order Totals
  totals: ReturnType<typeof calculateLandedCost>

  // User & Auth & Role Permissions
  user: UserSession
  isOwner: boolean
  switchRole: (role: UserRole) => void
  login: (email: string, password?: string, asRole?: UserRole) => Promise<{ success: boolean; message?: string; role?: UserRole }>
  logout: () => void
  registerUser: (data: { fullName: string; email: string; phone: string; role?: UserRole }) => Promise<{ success: boolean; message?: string }>
  updateProfile: (data: Partial<UserSession>) => void
  addAddress: (address: Omit<NepalAddress, 'id'>) => NepalAddress
  updateAddress: (id: string, address: Partial<NepalAddress>) => void
  deleteAddress: (id: string) => void
  setDefaultAddress: (id: string) => void

  // Products (Catalog with Owner Upload/Edit Support)
  products: Product[]
  addProduct: (newProd: Omit<Product, 'id'> & { id?: string }) => Product
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void

  // Orders & Owner Order Management
  orders: Order[]
  createOrder: (data: {
    address: NepalAddress
    shippingMethod: ShippingMethod
    paymentMethod: any
  }) => Order
  getOrderById: (orderId: string) => Order | undefined
  updateOrderStatus: (orderId: string, status: Order['fulfillmentStatus'], trackingNumber?: string) => void

  // Store Settings (Owner Permission)
  storeSettings: StoreSettings
  updateStoreSettings: (updates: Partial<StoreSettings>) => void

  // Wishlist & Compatibility
  wishlist: Set<string>
  wishlistEntries: WishlistEntry[]
  toggleWishlist: (productId: string, variantId?: string | null) => void
  removeWishlistEntry: (entryId: string) => void
  restoreWishlistEntry: (entry: WishlistEntry) => void
  clearWishlist: () => void

  // Comparison & Browsing
  recentlyViewed: string[]
  viewProduct: (productId: string) => void
  clearRecentlyViewed: () => void
  comparison: Set<string>
  toggleComparison: (productId: string) => void

  // Toast notifications
  toast: string
  notify: (message: string) => void

  // Dashboard Sidebar State
  sidebarCollapsed: boolean
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  toggleSidebar: () => void
}

const CommerceContext = createContext<CommerceContextType | null>(null)

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  // Cart state persisted to localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('ubuy-cart-items')
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.warn('Failed to parse cart items', e)
    }
    return INITIAL_CART_ITEMS
  })

  const [lastRemovedItem, setLastRemovedItem] = useState<CartItem | null>(null)
  const [appliedPromo, setAppliedPromo] = useState<string | null>(() => {
    return localStorage.getItem('ubuy-applied-promo') || null
  })

  // Delivery destination
  const [deliveryDestination, setDeliveryDestination] = useState<{ province: NepalProvince; district: string }>({
    province: 'Bagmati Province',
    district: 'Kathmandu',
  })

  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod>(SHIPPING_METHODS[0])

  // User auth state persisted
  const [user, setUser] = useState<UserSession>(() => {
    try {
      const stored = localStorage.getItem('ubuy-user-session')
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.warn('Failed to parse user session', e)
    }
    return DEFAULT_USER
  })

  // Store Settings (Owner managed)
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const stored = localStorage.getItem('ubuy-store-settings')
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.warn('Failed to parse store settings', e)
    }
    return DEFAULT_STORE_SETTINGS
  })

  // Products state (Catalog + Owner uploads)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('ubuy-products')
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.warn('Failed to parse products', e)
    }
    return catalogue
  })

  // Orders state persisted
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('ubuy-orders')
      if (stored) {
        const parsed: Order[] = JSON.parse(stored)
        return parsed.map((ord) => ({
          ...ord,
          items: (ord.items || []).map((it) => ({
            ...it,
            name: it.name.replace(/VoltCraft/g, "ABC EV"),
            brand: it.brand === "VoltCraft Performance" ? "ABC EV Performance" : it.brand.replace(/VoltCraft/g, "ABC EV"),
          })),
        }))
      }
    } catch (e) {
      console.warn('Failed to parse orders', e)
    }
    return PRESEEDED_ORDERS
  })

  // Wishlist state
  const [wishlistEntries, setWishlistEntries] = useState<WishlistEntry[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('volt-wishlist-entries') || '[]') as WishlistEntry[]
      if (stored.length) return stored
      const legacy = JSON.parse(localStorage.getItem('volt-wishlist') || '[]') as string[]
      return legacy.map((productId) => ({ id: `${productId}:default`, productId, variantId: null, savedAt: null }))
    } catch {
      return []
    }
  })

  // Recently viewed & comparison
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('volt-recently-viewed') || '[]')
    } catch {
      return []
    }
  })

  const [comparison, setComparison] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('volt-comparison') || '[]'))
    } catch {
      return new Set()
    }
  })

  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 3000)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const notify = (msg: string) => setToast(msg)

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('ubuy-cart-items', JSON.stringify(cartItems))
    } catch (e) {
      console.warn('Failed to save cart items', e)
    }
  }, [cartItems])

  // Persist user
  useEffect(() => {
    try {
      localStorage.setItem('ubuy-user-session', JSON.stringify(user))
    } catch (e) {
      console.warn('Failed to save user', e)
    }
  }, [user])

  // Persist products
  useEffect(() => {
    try {
      localStorage.setItem('ubuy-products', JSON.stringify(products))
    } catch (e) {
      console.warn('Failed to save products', e)
    }
  }, [products])

  // Persist store settings
  useEffect(() => {
    try {
      localStorage.setItem('ubuy-store-settings', JSON.stringify(storeSettings))
    } catch (e) {
      console.warn('Failed to save store settings', e)
    }
  }, [storeSettings])

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem('ubuy-orders', JSON.stringify(orders))
    } catch (e) {
      console.warn('Failed to save orders', e)
    }
  }, [orders])

  const persistWishlist = (entries: WishlistEntry[]) => {
    localStorage.setItem('volt-wishlist-entries', JSON.stringify(entries))
    localStorage.setItem('volt-wishlist', JSON.stringify([...new Set(entries.map((entry) => entry.productId))]))
    return entries
  }

  // Cart operations
  const addToCart = (productName: string, options: { quantity?: number; variant?: string; sku?: string } = {}) => {
    const quantity = Math.max(1, options.quantity || 1)
    // Find matching product in state products or default catalogue
    const matchedProduct =
      products.find((p) => p.name === productName || p.id === options.sku || p.id === productName) ||
      products.find((p) => p.name.toLowerCase().includes(productName.toLowerCase())) ||
      catalogue.find((p) => p.name === productName || p.id === options.sku || p.id === productName) ||
      catalogue.find((p) => p.name.toLowerCase().includes(productName.toLowerCase()))

    const productId = matchedProduct?.id || options.sku || `product-${Date.now()}`
    const price = matchedProduct?.price || 120000
    const brand = matchedProduct?.brand || 'ABC EV Performance'
    const image = matchedProduct?.image || '/images/subsystems/powertrain-motor.jpg'
    const availability = matchedProduct?.availability || 'In Stock'
    const importEligibility = matchedProduct?.detail?.importEligibility
      ? `${matchedProduct.detail.importEligibility} for Nepal import`
      : 'Verified eligible for Nepal import'

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === productId && item.variant === options.variant,
      )

      if (existingIndex >= 0) {
        const next = [...prev]
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        }
        return next
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        productId,
        name: matchedProduct?.name || productName,
        brand,
        image,
        price,
        quantity,
        variant: options.variant,
        sku: options.sku || matchedProduct?.id,
        voltage: matchedProduct?.voltage,
        subcategory: matchedProduct?.subcategory,
        availability,
        importEligibility,
      }
      return [...prev, newItem]
    })

    notify(`${quantity} × ${productName}${options.variant ? ` (${options.variant})` : ''} added to your Cart`)
  }

  const removeFromCart = (itemId: string) => {
    const item = cartItems.find((i) => i.id === itemId)
    if (item) {
      setLastRemovedItem(item)
    }
    setCartItems((prev) => prev.filter((i) => i.id !== itemId))
    notify('Item removed from cart. Undo available.')
  }

  const undoLastRemove = () => {
    if (!lastRemovedItem) return
    setCartItems((prev) => [...prev, lastRemovedItem])
    notify(`Restored ${lastRemovedItem.name} to your Cart`)
    setLastRemovedItem(null)
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
    )
  }

  const saveForLater = (itemId: string) => {
    const item = cartItems.find((i) => i.id === itemId)
    if (!item) return

    // Move to wishlist
    const exactId = `${item.productId}:${item.variant || 'default'}`
    setWishlistEntries((current) => {
      if (current.some((entry) => entry.id === exactId)) return current
      return persistWishlist([...current, { id: exactId, productId: item.productId, variantId: item.variant || null, savedAt: Date.now() }])
    })

    // Remove from cart
    setCartItems((prev) => prev.filter((i) => i.id !== itemId))
    notify(`Moved ${item.name} to your Wishlist`)
  }

  const clearCart = () => {
    setCartItems([])
  }

  // Promo code
  const applyPromo = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase()
    if (!code) {
      return { success: false, message: 'Please enter a promo code' }
    }
    if (VALID_PROMO_CODES[code]) {
      setAppliedPromo(code)
      localStorage.setItem('ubuy-applied-promo', code)
      notify(`Promo code ${code} applied: ${VALID_PROMO_CODES[code].description}`)
      return { success: true, message: VALID_PROMO_CODES[code].description }
    }
    return { success: false, message: 'Invalid or expired promotional code. Try ABCEVPART, VOLT15 or FREESHIP' }
  }

  const removePromo = () => {
    setAppliedPromo(null)
    localStorage.removeItem('ubuy-applied-promo')
    notify('Promo code removed')
  }

  // Calculate totals
  const totals = calculateLandedCost(cartItems, deliveryDestination, selectedShipping, appliedPromo)

  // Role & Permissions
  const isOwner = user.role === 'owner'

  const switchRole = (role: UserRole) => {
    if (role === 'owner') {
      setUser({ ...OWNER_USER, isAuthenticated: true, isGuest: false })
      notify('Switched to Store Owner Portal (Full Access)')
    } else {
      setUser({ ...DEFAULT_USER, isAuthenticated: true, isGuest: false })
      notify('Switched to Customer Account')
    }
  }

  // Auth operations
  const login = async (email: string, _password?: string, asRole?: UserRole) => {
    const targetRole: UserRole =
      asRole ||
      (email.toLowerCase().includes('admin') || email.toLowerCase().includes('owner') ? 'owner' : 'customer')

    let loggedInUser: UserSession
    if (targetRole === 'owner') {
      loggedInUser = {
        ...OWNER_USER,
        email: email || OWNER_USER.email,
        isAuthenticated: true,
        isGuest: false,
      }
    } else {
      loggedInUser = {
        ...DEFAULT_USER,
        email: email || DEFAULT_USER.email,
        isAuthenticated: true,
        isGuest: false,
        role: 'customer',
      }
    }
    setUser(loggedInUser)
    notify(`Welcome back, ${loggedInUser.fullName} (${loggedInUser.role === 'owner' ? 'Store Owner' : 'Customer'})!`)
    return { success: true, role: loggedInUser.role }
  }

  const logout = () => {
    const loggedOutUser: UserSession = {
      ...user,
      isAuthenticated: false,
      isGuest: true,
    }
    setUser(loggedOutUser)
    notify('You have signed out securely.')
  }

  const registerUser = async (data: { fullName: string; email: string; phone: string; role?: UserRole }) => {
    const role: UserRole = data.role || 'customer'
    const newUser: UserSession = {
      ...user,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role,
      permissions:
        role === 'owner'
          ? OWNER_USER.permissions
          : ['buyer_checkout', 'order_tracking', 'leave_review', 'save_garage'],
      isAuthenticated: true,
      isGuest: false,
    }
    setUser(newUser)
    notify(`Welcome to ABC EV PART, ${data.fullName} (${role === 'owner' ? 'Store Owner' : 'Customer'})!`)
    return { success: true }
  }

  const updateProfile = (data: Partial<UserSession>) => {
    setUser((prev) => ({ ...prev, ...data }))
    notify('Profile updated successfully.')
  }

  // Owner Products Management
  const addProduct = (newProdData: Omit<Product, 'id'> & { id?: string }): Product => {
    const newProduct: Product = {
      ...newProdData,
      id: newProdData.id || `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    }
    setProducts((prev) => [newProduct, ...prev])
    notify(`Product "${newProduct.name}" added to store catalog!`)
    return newProduct
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
    notify('Product updated successfully.')
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    notify('Product removed from store catalog.')
  }

  // Owner Order Processing & Status Update
  const updateOrderStatus = (
    orderId: string,
    status: Order['fulfillmentStatus'],
    trackingNumber?: string,
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId || o.orderNumber === orderId) {
          return {
            ...o,
            fulfillmentStatus: status,
            ...(trackingNumber ? { trackingNumber } : {}),
          }
        }
        return o
      }),
    )
    notify(`Order #${orderId} fulfillment status updated to "${status}".`)
  }

  // Owner Store Settings Update
  const updateStoreSettings = (updates: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...updates }))
    notify('Store configuration updated.')
  }

  const addAddress = (addressData: Omit<NepalAddress, 'id'>) => {
    const newAddr: NepalAddress = {
      ...addressData,
      id: `addr_${Date.now()}`,
    }
    setUser((prev) => {
      const addresses = addressData.isDefault
        ? prev.addresses.map((a) => ({ ...a, isDefault: false })).concat(newAddr)
        : [...prev.addresses, newAddr]
      return { ...prev, addresses }
    })
    notify('Address saved to your address book.')
    return newAddr
  }

  const updateAddress = (id: string, addressData: Partial<NepalAddress>) => {
    setUser((prev) => {
      let addresses = prev.addresses.map((a) => (a.id === id ? { ...a, ...addressData } : a))
      if (addressData.isDefault) {
        addresses = addresses.map((a) => (a.id === id ? a : { ...a, isDefault: false }))
      }
      return { ...prev, addresses }
    })
    notify('Address updated.')
  }

  const deleteAddress = (id: string) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((a) => a.id !== id),
    }))
    notify('Address removed.')
  }

  const setDefaultAddress = (id: string) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
    }))
    notify('Default address updated.')
  }

  // Create Order from Checkout
  const createOrder = ({
    address,
    shippingMethod,
    paymentMethod,
  }: {
    address: NepalAddress
    shippingMethod: ShippingMethod
    paymentMethod: any
  }): Order => {
    const currentTotals = calculateLandedCost(cartItems, { province: address.province, district: address.district }, shippingMethod, appliedPromo)
    const orderNum = `UB-NP-${Math.floor(100000 + Math.random() * 900000)}`

    // Generate date + 4 business days
    const estDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const newOrder: Order = {
      id: orderNum,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      items: cartItems.map((item) => ({ ...item, lineTotal: item.price * item.quantity })),
      subtotal: currentTotals.subtotal,
      shippingFee: currentTotals.shippingFee,
      customsDuty: currentTotals.customsDuty,
      vat: currentTotals.vat,
      discount: currentTotals.discount,
      totalPaid: currentTotals.payNowTotal,
      appliedPromo: appliedPromo || undefined,
      deliveryAddress: address,
      shippingMethod,
      paymentMethod,
      paymentStatus: 'Paid (Demo Simulation)',
      fulfillmentStatus: 'Order Placed',
      trackingNumber: `DHL-NP-${Math.floor(10000000 + Math.random() * 90000000)}-EXP`,
      carrier: shippingMethod.carrier,
      originHub: 'Global Logistics Hub (Frankfurt / Los Angeles)',
      destination: `${address.city}, Nepal`,
      estimatedDeliveryDate: estDelivery,
      isDemo: true,
    }

    setOrders((prev) => [newOrder, ...prev])
    clearCart()
    return newOrder
  }

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId)
  }

  // Wishlist methods
  const toggleWishlist = (productId: string, variantId: string | null = null) => {
    setWishlistEntries((current) => {
      const exactId = `${productId}:${variantId || 'default'}`
      const exactExists = current.some((entry) => entry.id === exactId)
      if (exactExists) return persistWishlist(current.filter((entry) => entry.id !== exactId))
      if (variantId === null && current.some((entry) => entry.productId === productId)) {
        return persistWishlist(current.filter((entry) => entry.productId !== productId))
      }
      return persistWishlist([...current, { id: exactId, productId, variantId, savedAt: Date.now() }])
    })
  }

  const removeWishlistEntry = (entryId: string) => {
    setWishlistEntries((current) => persistWishlist(current.filter((entry) => entry.id !== entryId)))
  }

  const restoreWishlistEntry = (entry: WishlistEntry) => {
    setWishlistEntries((current) => persistWishlist(current.some((item) => item.id === entry.id) ? current : [...current, entry]))
  }

  const clearWishlist = () => setWishlistEntries(() => persistWishlist([]))

  // Recently viewed
  const viewProduct = (productId: string) => {
    setRecentlyViewed((current) => {
      const next = [productId, ...current.filter((id) => id !== productId)].slice(0, 8)
      localStorage.setItem('volt-recently-viewed', JSON.stringify(next))
      return next
    })
  }

  const clearRecentlyViewed = () => {
    localStorage.removeItem('volt-recently-viewed')
    setRecentlyViewed([])
  }

  // Comparison
  const toggleComparison = (productId: string) => {
    setComparison((current) => {
      const next = new Set(current)
      next.has(productId) ? next.delete(productId) : next.add(productId)
      localStorage.setItem('volt-comparison', JSON.stringify([...next]))
      return next
    })
  }

  // Dashboard Sidebar State persisted
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ubuy-sidebar-collapsed') === 'true'
    } catch {
      return false
    }
  })

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('ubuy-sidebar-collapsed', String(next))
      } catch {}
      return next
    })
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const wishlist = new Set(wishlistEntries.map((entry) => entry.productId))

  return (
    <CommerceContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        saveForLater,
        undoLastRemove,
        lastRemovedItem,
        clearCart,
        cartCount,
        deliveryDestination,
        setDeliveryDestination,
        selectedShipping,
        setSelectedShipping,
        appliedPromo,
        applyPromo,
        removePromo,
        totals,
        user,
        isOwner,
        switchRole,
        login,
        logout,
        registerUser,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        createOrder,
        getOrderById,
        updateOrderStatus,
        storeSettings,
        updateStoreSettings,
        wishlist,
        wishlistEntries,
        toggleWishlist,
        removeWishlistEntry,
        restoreWishlistEntry,
        clearWishlist,
        recentlyViewed,
        viewProduct,
        clearRecentlyViewed,
        comparison,
        toggleComparison,
        toast,
        notify,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
      }}
    >
      {children}
    </CommerceContext.Provider>
  )
}

export function useCommerce(): CommerceContextType {
  const context = useContext(CommerceContext)
  if (!context) {
    throw new Error('useCommerce must be used within a CommerceProvider')
  }
  return context
}
