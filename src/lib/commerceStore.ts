import { catalogue, type Product } from "../data/catalog"

export type CartItem = {
  id: string
  productId: string
  name: string
  brand: string
  image: string
  price: number
  quantity: number
  variant?: string
  sku?: string
  voltage?: string
  subcategory?: string
  availability: string
  importEligibility: string
}

export type NepalProvince = "Bagmati Province" | "Gandaki Province" | "Koshi Province" | "Lumbini Province" | "Madhesh Province" | "Karnali Province" | "Sudurpashchim Province"

export type NepalAddress = {
  id: string
  fullName: string
  phone: string
  email: string
  country: "Nepal"
  province: NepalProvince
  district: string
  city: string
  ward: string
  street: string
  postalCode: string
  deliveryInstructions?: string
  isDefault?: boolean
}

export type UserRole = "customer" | "owner"

export type StoreSettings = {
  announcement: string
  vatRate: number
  storeName: string
  featuredHeroId: string
  hubLocation: string
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  announcement: "Nepal Delivery Only · 100% Authentic with 13% Government VAT Tax Invoice",
  vatRate: 0.13,
  storeName: "ABC EV PART Hub",
  featuredHeroId: "apex-900-axial-flux-motor",
  hubLocation: "Kathmandu Central Distribution Hub, Ward 2",
}

export type UserSession = {
  id: string
  fullName: string
  email: string
  phone: string
  role: UserRole
  permissions?: string[]
  isAuthenticated: boolean
  isGuest: boolean
  addresses: NepalAddress[]
  currency: "NPR" | "USD" | "EUR"
  language: "English" | "Nepali (नेपाली)"
  notifications: {
    emailUpdates: boolean
    smsTracking: boolean
    whatsAppAlerts: boolean
    deliveryNotices: boolean
    promotions: boolean
  }
}

export type ShippingMethod = {
  id: "express_ktm" | "express_nepal" | "standard_nepal"
  name: string
  carrier: string
  transitTime: string
  rateNpr: number
  description: string
  isInsured: boolean
}

export type PaymentMethodId = "fonepay" | "card" | "esewa" | "khalti" | "wire" | "cod"

export type OrderItem = CartItem & {
  lineTotal: number
}

export type Order = {
  id: string
  orderNumber: string
  createdAt: string
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  customsDuty: number
  vat: number
  discount: number
  totalPaid: number
  appliedPromo?: string
  deliveryAddress: NepalAddress
  shippingMethod: ShippingMethod
  paymentMethod: PaymentMethodId
  paymentStatus: "Paid (Demo Simulation)" | "Pending Verification" | "Refunded"
  fulfillmentStatus: "Order Placed" | "In Transit" | "Processing" | "Out for Delivery" | "Delivered" | "Cancelled"
  trackingNumber: string
  carrier: string
  originHub: string
  destination: string
  estimatedDeliveryDate: string
  isDemo: true
}

export type TrackingCheckpoint = {
  id: string
  title: string
  location: string
  timestamp: string
  completed: boolean
  current: boolean
  description: string
  stage: "placed" | "processing" | "transit" | "out_for_delivery" | "delivered"
}

export const NEPAL_PROVINCES: {
  province: NepalProvince
  majorDistricts: string[]
}[] = [
  {
    province: "Bagmati Province",
    majorDistricts: [
      "Kathmandu",
      "Lalitpur",
      "Bhaktapur",
      "Chitwan",
      "Kavrepalanchok",
      "Makwanpur",
    ],
  },
  {
    province: "Gandaki Province",
    majorDistricts: [
      "Kaski (Pokhara)",
      "Tanahun",
      "Syangja",
      "Gorkha",
      "Nawalpur",
    ],
  },
  {
    province: "Koshi Province",
    majorDistricts: [
      "Morang (Biratnagar)",
      "Sunsari (Dharan)",
      "Jhapa",
      "Ilam",
    ],
  },
  {
    province: "Lumbini Province",
    majorDistricts: [
      "Rupandehi (Butwal/Bhairahawa)",
      "Banke (Nepalgunj)",
      "Dang",
      "Palpa",
    ],
  },
  {
    province: "Madhesh Province",
    majorDistricts: [
      "Parsa (Birgunj)",
      "Dhanusha (Janakpur)",
      "Bara",
      "Siraha",
    ],
  },
  {
    province: "Karnali Province",
    majorDistricts: ["Surkhet (Birendranagar)", "Dailekh", "Jumla"],
  },
  {
    province: "Sudurpashchim Province",
    majorDistricts: [
      "Kailali (Dhangadhi)",
      "Kanchanpur (Mahendranagar)",
      "Doti",
    ],
  },
]

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "express_ktm",
    name: "Kathmandu Valley Express",
    carrier: "Express Nepal Courier",
    transitTime: "1–2 Business Days",
    rateNpr: 250,
    description:
      "Expedited doorstep delivery across Kathmandu, Lalitpur, and Bhaktapur.",
    isInsured: true,
  },
  {
    id: "express_nepal",
    name: "Inter-Province Courier Delivery",
    carrier: "Nepal Post EMS / Fast Logistics",
    transitTime: "2–4 Business Days",
    rateNpr: 500,
    description:
      "Doorstep delivery to Pokhara, Chitwan, Biratnagar, Butwal, and all 7 provinces.",
    isInsured: true,
  },
  {
    id: "standard_nepal",
    name: "Standard Nepal Delivery",
    carrier: "Domestic Cargo Nepal",
    transitTime: "3–5 Business Days",
    rateNpr: 0,
    description:
      "Standard delivery across Nepal with full package tracking.",
    isInsured: true,
  },
]

export const DEFAULT_USER: UserSession = {
  id: "usr_nepal_9921",
  fullName: "Aayush Shrestha",
  email: "aayush.shrestha@abcevpart.np",
  phone: "+977 9841234567",
  role: "customer",
  permissions: ["view_catalog", "place_orders", "track_orders", "manage_addresses"],
  isAuthenticated: true,
  isGuest: false,
  currency: "NPR",
  language: "English",
  notifications: {
    emailUpdates: true,
    smsTracking: true,
    whatsAppAlerts: true,
    deliveryNotices: true,
    promotions: false,
  },
  addresses: [
    {
      id: "addr_ktm_1",
      fullName: "Aayush Shrestha",
      phone: "+977 9841234567",
      email: "aayush.shrestha@abcevpart.np",
      country: "Nepal",
      province: "Bagmati Province",
      district: "Kathmandu",
      city: "Kathmandu Metro",
      ward: "Ward 2",
      street: "Lazimpat, Near Radisson Way, House #42",
      postalCode: "44600",
      deliveryInstructions: "Ring bell at main gate. Gate code 4290.",
      isDefault: true,
    },
    {
      id: "addr_pkr_2",
      fullName: "Aayush Shrestha (Engineering Garage)",
      phone: "+977 9801987654",
      email: "aayush.shrestha@abcevpart.np",
      country: "Nepal",
      province: "Gandaki Province",
      district: "Kaski (Pokhara)",
      city: "Pokhara",
      ward: "Ward 6",
      street: "Lakeside North, Hallan Chowk EV Depot",
      postalCode: "33700",
      deliveryInstructions: "Deliver to rear loading bay between 10 AM - 5 PM.",
      isDefault: false,
    },
  ],
}

export const OWNER_USER: UserSession = {
  id: "usr_owner_001",
  fullName: "ABC EV PART Admin (Store Owner)",
  email: "admin@abcevpart.com.np",
  phone: "+977 9801122334",
  role: "owner",
  permissions: [
    "manage_products",
    "upload_products",
    "edit_products",
    "delete_products",
    "manage_orders",
    "update_order_status",
    "manage_content",
    "view_analytics",
  ],
  isAuthenticated: true,
  isGuest: false,
  currency: "NPR",
  language: "English",
  notifications: {
    emailUpdates: true,
    smsTracking: true,
    whatsAppAlerts: true,
    deliveryNotices: true,
    promotions: true,
  },
  addresses: [
    {
      id: "addr_owner_hq",
      fullName: "ABC EV PART Operations HQ",
      phone: "+977 9801122334",
      email: "admin@abcevpart.com.np",
      country: "Nepal",
      province: "Bagmati Province",
      district: "Kathmandu",
      city: "Kathmandu Metro",
      ward: "Ward 2",
      street: "Lazimpat Central Distribution Plaza",
      postalCode: "44600",
      deliveryInstructions: "Main Operations Bay",
      isDefault: true,
    },
  ],
}

export const PRESEEDED_ORDERS: Order[] = [
  {
    id: "UB-NP-902148",
    orderNumber: "UB-NP-902148",
    createdAt: "2026-10-26T14:30:00Z",
    items: [
      {
        id: "cart-init-1",
        productId: "apex-900-axial-flux-motor",
        name: "ABC EV Apex-900 Dual Axial Flux Motor Kit (720 kW / 1,150 Nm)",
        brand: "ABC EV Performance",
        image: "/images/subsystems/powertrain-motor.jpg",
        price: 485000,
        quantity: 1,
        variant: "Standard Black Anodized",
        sku: "ABC-MTR-900-BLK",
        voltage: "800V",
        subcategory: "Powertrain & Motors",
        availability: "In Stock",
        importEligibility: "Verified eligible for Nepal import",
        lineTotal: 485000,
      },
      {
        id: "cart-init-2",
        productId: "ccs2-to-nacs-ultra-adapter",
        name: "ApexCharge 250kW Liquid-Cooled CCS2 to NACS Supercharger Adapter",
        brand: "ApexCharge Tech",
        image:
          "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=88",
        price: 38500,
        quantity: 1,
        variant: "Gunmetal Gray",
        sku: "APX-ADP-250-GM",
        voltage: "900V",
        subcategory: "Charging & Wallboxes",
        availability: "In Stock",
        importEligibility: "Verified eligible for Nepal import",
        lineTotal: 38500,
      },
    ],
    subtotal: 523500,
    shippingFee: 250,
    customsDuty: 0,
    vat: 68055, // 13% Nepal VAT
    discount: 15000,
    totalPaid: 576805,
    appliedPromo: "ABCEVPART",
    deliveryAddress: DEFAULT_USER.addresses[0],
    shippingMethod: SHIPPING_METHODS[0],
    paymentMethod: "fonepay",
    paymentStatus: "Paid (Demo Simulation)",
    fulfillmentStatus: "In Transit",
    trackingNumber: "NP-EXP-88392104",
    carrier: "Express Nepal Courier",
    originHub: "Kathmandu Central Fulfillment Hub",
    destination: "Kathmandu, Nepal",
    estimatedDeliveryDate: "2026-11-02",
    isDemo: true,
  },
  {
    id: "UB-NP-883921",
    orderNumber: "UB-NP-883921",
    createdAt: "2026-10-12T09:15:00Z",
    items: [
      {
        id: "item-883921-1",
        productId: "volt-pulse-22kw-wallbox",
        name: "VoltPulse Pro 22kW Bi-Directional V2H / V2G Smart Home Wallbox",
        brand: "VoltPulse Systems",
        image: "/images/subsystems/charging-station.jpg",
        price: 128000,
        quantity: 1,
        variant: "Type 2 Tethered 7.5m",
        sku: "VP-WBX-22KW-T2",
        voltage: "400V",
        subcategory: "Charging & Wallboxes",
        availability: "In Stock",
        importEligibility: "Available for delivery in Nepal",
        lineTotal: 128000,
      },
    ],
    subtotal: 128000,
    shippingFee: 500,
    customsDuty: 0,
    vat: 16640,
    discount: 0,
    totalPaid: 145140,
    deliveryAddress: DEFAULT_USER.addresses[1],
    shippingMethod: SHIPPING_METHODS[1],
    paymentMethod: "card",
    paymentStatus: "Paid (Demo Simulation)",
    fulfillmentStatus: "Delivered",
    trackingNumber: "NP-EMS-77291034",
    carrier: "Nepal Post EMS",
    originHub: "Kathmandu Central Fulfillment Hub",
    destination: "Pokhara, Gandaki Province",
    estimatedDeliveryDate: "2026-10-19",
    isDemo: true,
  },
  {
    id: "UB-NP-820194",
    orderNumber: "UB-NP-820194",
    createdAt: "2026-09-18T16:45:00Z",
    items: [
      {
        id: "item-820194-1",
        productId: "brembo-carbon-ceramic-ev",
        name: "Brembo EV-R 420mm Carbon-Ceramic Regenerative Brake System",
        brand: "Brembo EV-R",
        image: "/images/subsystems/carbon-brakes.jpg",
        price: 275000,
        quantity: 1,
        variant: "Racing Yellow Monobloc",
        sku: "BRM-CCB-420-YEL",
        voltage: "400V",
        subcategory: "Brakes & Suspension",
        availability: "In Stock",
        importEligibility: "Available for delivery in Nepal",
        lineTotal: 275000,
      },
    ],
    subtotal: 275000,
    shippingFee: 250,
    customsDuty: 0,
    vat: 35750,
    discount: 25000,
    totalPaid: 286000,
    appliedPromo: "NEPAL2026",
    deliveryAddress: DEFAULT_USER.addresses[0],
    shippingMethod: SHIPPING_METHODS[0],
    paymentMethod: "esewa",
    paymentStatus: "Paid (Demo Simulation)",
    fulfillmentStatus: "Delivered",
    trackingNumber: "NP-EXP-66190248",
    carrier: "Express Nepal Courier",
    originHub: "Kathmandu Central Fulfillment Hub",
    destination: "Kathmandu, Bagmati Province",
    estimatedDeliveryDate: "2026-09-25",
    isDemo: true,
  },
]

// Generate rich tracking checkpoints for any order
export function generateTrackingCheckpoints(
  order: Order,
): TrackingCheckpoint[] {
  const isDelivered = order.fulfillmentStatus === "Delivered"
  const isOut = order.fulfillmentStatus === "Out for Delivery"
  const isInTransit = order.fulfillmentStatus === "In Transit" || isOut || isDelivered

  return [
    {
      id: "chk-1",
      title: "Order Confirmed & Payment Verified",
      location: "Kathmandu Central Hub, Nepal",
      timestamp: "Day 0 · 11:20 AM",
      completed: true,
      current: false,
      description: "Order placed successfully. Items allocated and reserved in warehouse inventory.",
      stage: "placed",
    },
    {
      id: "chk-2",
      title: "Inspected & Packed at Kathmandu Hub",
      location: order.originHub || "Kathmandu Central Warehouse",
      timestamp: "Day 1 · 09:30 AM",
      completed: isInTransit,
      current: !isInTransit,
      description: "Quality inspection completed and package sealed with tamper-proof security tape.",
      stage: "transit",
    },
    {
      id: "chk-3",
      title: "Dispatched with Domestic Courier",
      location: "Kathmandu Sorting Center",
      timestamp: "Day 1 · 02:45 PM",
      completed: isInTransit,
      current: isInTransit && !isOut && !isDelivered,
      description: `Handed over to ${order.carrier}. Tracking consignment number: ${order.trackingNumber}.`,
      stage: "transit",
    },
    {
      id: "chk-4",
      title: "In Transit to Regional Hub",
      location: `${order.deliveryAddress.province}, Nepal`,
      timestamp: "Day 2 · 08:15 AM",
      completed: isOut || isDelivered,
      current: false,
      description: `Shipment arrived at ${order.deliveryAddress.city} regional distribution center.`,
      stage: "transit",
    },
    {
      id: "chk-5",
      title: "Out for Doorstep Delivery",
      location: `${order.deliveryAddress.city}, ${order.deliveryAddress.province}`,
      timestamp: isOut || isDelivered ? "Day 2 · 10:30 AM" : `Estimated: ${order.estimatedDeliveryDate}`,
      completed: isOut || isDelivered,
      current: isOut,
      description: `Courier driver out for doorstep delivery. Recipient: ${order.deliveryAddress.fullName} (${order.deliveryAddress.phone}).`,
      stage: "out_for_delivery",
    },
    {
      id: "chk-6",
      title: "Delivered & Signed",
      location: `${order.deliveryAddress.street}, ${order.deliveryAddress.city}`,
      timestamp: isDelivered ? "Day 2 · 02:15 PM" : `Estimated Delivery: ${order.estimatedDeliveryDate}`,
      completed: isDelivered,
      current: false,
      description: isDelivered
        ? "Package successfully handed over at customer doorstep. Verified and signed."
        : "Final delivery pending at customer destination address in Nepal.",
      stage: "delivered",
    },
  ]
}

// Initial demo cart items to showcase ultra-premium UI immediately
export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: "cart-item-1",
    productId: "apex-900-axial-flux-motor",
    name: "ABC EV Apex-900 Dual Axial Flux Motor Kit (720 kW / 1,150 Nm)",
    brand: "ABC EV Performance",
    image: "/images/subsystems/powertrain-motor.jpg",
    price: 485000,
    quantity: 1,
    variant: "Standard Black Anodized",
    sku: "ABC-MTR-900-BLK",
    voltage: "800V",
    subcategory: "Powertrain & Motors",
    availability: "In Stock",
    importEligibility: "Verified in-stock in Kathmandu Hub",
  },
  {
    id: "cart-item-2",
    productId: "ccs2-to-nacs-ultra-adapter",
    name: "ApexCharge 250kW Liquid-Cooled CCS2 to NACS Supercharger Adapter",
    brand: "ApexCharge Tech",
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=88",
    price: 38500,
    quantity: 1,
    variant: "Gunmetal Gray",
    sku: "APX-ADP-250-GM",
    voltage: "900V",
    subcategory: "Charging & Wallboxes",
    availability: "In Stock",
    importEligibility: "Verified in-stock in Kathmandu Hub",
  },
]

// Available promo discount rules
export const VALID_PROMO_CODES: Record<string, {
  code: string
  percent?: number
  fixedNpr?: number
  freeShipping?: boolean
  description: string
}> = {
  ABCEVPART: {
    code: "ABCEVPART",
    percent: 15,
    description: "15% off official ABC EV PART launch discount",
  },
  UBUYNEPAL: {
    code: "UBUYNEPAL",
    percent: 10,
    description: "10% off entire order",
  },
  VOLT15: {
    code: "VOLT15",
    percent: 15,
    description: "15% off high-performance components",
  },
  FREESHIP: {
    code: "FREESHIP",
    freeShipping: true,
    description: "100% Free Doorstep Delivery across Nepal",
  },
  NEPAL2026: {
    code: "NEPAL2026",
    fixedNpr: 25000,
    description: "NPR 25,000 instant festival rebate",
  },
}

// Calculate transparent Nepal Order Totals
export function calculateLandedCost(
  items: CartItem[],
  destination: { province: NepalProvince; district: string } = {
    province: 'Bagmati Province',
    district: 'Kathmandu',
  },
  shippingMethod: ShippingMethod = SHIPPING_METHODS[0],
  appliedPromoCode: string | null = null,
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  if (items.length === 0) {
    return {
      subtotal: 0,
      shippingFee: 0,
      customsDuty: 0,
      vat: 0,
      discount: 0,
      payNowTotal: 0,
      payLaterTotal: 0,
      landedCostTotal: 0,
    }
  }

  // Domestic Nepal delivery
  let shippingFee = shippingMethod.rateNpr
  // Slight surcharge for remote provinces outside Bagmati / Gandaki
  if (
    destination.province === "Karnali Province" ||
    destination.province === "Sudurpashchim Province"
  ) {
    shippingFee += 250
  }

  // Domestic delivery only - no foreign customs duty
  const customsDuty = 0

  // 13% Nepal VAT (inclusive calculation)
  const vat = Math.round(subtotal * 0.13)

  // Discount calculation
  let discount = 0
  if (appliedPromoCode && VALID_PROMO_CODES[appliedPromoCode.toUpperCase()]) {
    const rule = VALID_PROMO_CODES[appliedPromoCode.toUpperCase()]
    if (rule.percent) {
      discount = Math.round(subtotal * (rule.percent / 100))
    } else if (rule.fixedNpr) {
      discount = Math.min(rule.fixedNpr, subtotal)
    } else if (rule.freeShipping) {
      discount = shippingFee
    }
  }

  // In Ubuy model, all taxes & duties are prepaid for hassle-free doorstep arrival
  const payNowTotal = Math.max(
    0,
    subtotal + shippingFee + customsDuty + vat - discount,
  )
  const payLaterTotal = 0 // Fully transparent prepaid customs!

  return {
    subtotal,
    shippingFee,
    customsDuty,
    vat,
    discount,
    payNowTotal,
    payLaterTotal,
    landedCostTotal: payNowTotal,
  }
}
