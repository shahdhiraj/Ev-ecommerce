import { useState, useMemo, useEffect } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Boxes,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  DollarSign,
  Edit2,
  ExternalLink,
  Eye,
  FileText,
  FileUp,
  Filter,
  Image,
  Layers,
  ListPlus,
  MapPin,
  Package,
  PanelLeft,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Trash2,
  TrendingUp,
  Truck,
  Upload,
  User,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react"
import { useLocation, useNavigate } from "react-router"
import { AppLink, Badge, Button, Heading, IconButton, Input } from "../components/ui"
import { useCommerce } from "../lib/commerceContext"
import { NEPAL_PROVINCES, type Order, type NepalProvince } from "../lib/commerceStore"
import { formatNpr } from "../lib/search"
import type { Product } from "../data/catalog"

type OwnerTab = "overview" | "products" | "orders" | "settings"

const PRESET_IMAGES = [
  { label: "High-Voltage Motor", url: "/images/subsystems/powertrain-motor.jpg" },
  { label: "SiC Power Inverter", url: "/images/subsystems/sic-inverter.jpg" },
  { label: "Battery Pack & BMS", url: "/images/subsystems/battery-pack.jpg" },
  { label: "Carbon-Ceramic Brakes", url: "/images/subsystems/carbon-brakes.jpg" },
  { label: "22kW Wallbox Charger", url: "/images/subsystems/charging-station.jpg" },
  { label: "Carbon Underbody Aero", url: "/images/subsystems/carbon-aero.jpg" },
]

const SUBCATEGORIES = [
  "Powertrain & Motors",
  "Battery & BMS",
  "Inverters & SiC",
  "Charging & Wallboxes",
  "Brakes & Suspension",
  "Aero & Carbon",
  "Cockpit Telemetry",
]

const VOLTAGES = ["400V", "800V", "900V", "12V"] as const

export function OwnerDashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    user,
    isOwner,
    switchRole,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    storeSettings,
    updateStoreSettings,
    notify,
    sidebarCollapsed,
    toggleSidebar,
  } = useCommerce()

  // Determine active tab from URL path
  const getTabFromPath = (): OwnerTab => {
    const path = location.pathname
    if (path.includes("/products") || path.includes("/catalog")) return "products"
    if (path.includes("/orders") || path.includes("/fulfillment")) return "orders"
    if (path.includes("/settings") || path.includes("/content")) return "settings"
    return "overview"
  }

  const [activeTab, setActiveTab] = useState<OwnerTab>(getTabFromPath())

  useEffect(() => {
    setActiveTab(getTabFromPath())
  }, [location.pathname])

  const handleTabClick = (tab: OwnerTab) => {
    setActiveTab(tab)
    if (tab === "overview") navigate("/owner")
    else if (tab === "products") navigate("/owner/products")
    else if (tab === "orders") navigate("/owner/orders")
    else if (tab === "settings") navigate("/owner/settings")
  }

  // Products filtering & search
  const [productSearch, setProductSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")

  // Upload Product Modal State (Enhanced with Own Image, Specifications, Descriptions)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadTab, setUploadTab] = useState<"basic" | "media" | "description" | "specs" | "fitment">("basic")

  // Basic Details
  const [newTitle, setNewTitle] = useState("")
  const [newBrand, setNewBrand] = useState("ABC EV Performance")
  const [newSubcategory, setNewSubcategory] = useState(SUBCATEGORIES[0])
  const [newVoltage, setNewVoltage] = useState<"400V" | "800V" | "900V" | "12V">("800V")
  const [newPrice, setNewPrice] = useState("185000")
  const [newStockStatus, setNewStockStatus] = useState<"In Stock" | "Out of Stock" | "Custom Order">("In Stock")
  const [newStockCount, setNewStockCount] = useState("8")
  const [newSku, setNewSku] = useState("ABC-800V-AX900-NP")
  const [newRegion, setNewRegion] = useState<Product["region"]>("Europe")

  // Media & Own Image Upload
  const [newImageUrl, setNewImageUrl] = useState(PRESET_IMAGES[0].url)
  const [ownImageFileName, setOwnImageFileName] = useState<string | null>(null)
  const [ownImageFileSize, setOwnImageFileSize] = useState<string | null>(null)
  const [galleryImages, setGalleryImages] = useState<string[]>([
    PRESET_IMAGES[1].url,
    PRESET_IMAGES[2].url,
  ])
  const [imageInputMode, setImageInputMode] = useState<"upload" | "preset" | "url">("upload")
  const [customUrlInput, setCustomUrlInput] = useState("")

  // Descriptions & Features
  const [newTagline, setNewTagline] = useState("High-efficiency 800V dual axial flux traction motor for high-performance EV builds in Nepal.")
  const [newDescription, setNewDescription] = useState(
    "Engineered with advanced high-temperature neodymium magnets and direct liquid-glycol stator cooling. Delivers sustained peak power of 720 kW and instant 1,150 Nm torque. Fully certified with ISO 26262 ASIL-D functional safety and backed by official Nepal factory warranty."
  )
  const [featuresList, setFeaturesList] = useState<string[]>([
    "800V Silicon Carbide (SiC) MOSFET Architecture",
    "98.9% Peak Motor Inverter Efficiency",
    "Integrated Liquid-Glycol Cooling Jacket (IP67)",
    "ISO 26262 ASIL-D Functional Safety Verified",
    "Direct Bolt-On Subframe Mount for Custom EV Conversions",
  ])
  const [newFeatureText, setNewFeatureText] = useState("")

  // Specifications Key-Value Builder
  const [specsList, setSpecsList] = useState<{ key: string; value: string }[]>([
    { key: "Nominal Operating Voltage", value: "800V DC (Range: 620V - 900V)" },
    { key: "Peak Power Output", value: "720 kW (965 hp)" },
    { key: "Continuous Power", value: "480 kW (644 hp)" },
    { key: "Max Torque", value: "1,150 Nm (Instant)" },
    { key: "Max Rotor Speed", value: "18,500 RPM" },
    { key: "Cooling Method", value: "Liquid Water-Glycol (50/50 mix, 25 L/min)" },
    { key: "Total Weight", value: "38.5 kg" },
    { key: "Ingress Protection", value: "IP67 / IP6K9K Waterproof" },
    { key: "Certification", value: "ISO 26262 ASIL-D, CE, UN ECE R100" },
    { key: "Nepal VAT", value: "13% Included in Listed Price" },
  ])
  const [newSpecKey, setNewSpecKey] = useState("")
  const [newSpecValue, setNewSpecValue] = useState("")

  // Vehicle Compatibility & Included Items
  const [compatList, setCompatList] = useState<string[]>([
    "Universal 800V EV Conversions",
    "Porsche Taycan & Audi e-tron GT Architecture",
    "Hyundai Ioniq 5 / Kia EV6 E-GMP Platform",
    "Custom High-Voltage Track Prototypes",
  ])
  const [newCompatText, setNewCompatText] = useState("")

  const [includedList, setIncludedList] = useState<string[]>([
    "High-voltage Amphenol connector harness",
    "Stator temperature sensor wiring loom",
    "Precision CNC aluminum mounting brackets",
    "Factory dyno calibration report",
    "Nepal IRD 13% Tax Invoice with Official Stamp",
  ])
  const [newIncludedText, setNewIncludedText] = useState("")
  const [newWarranty, setNewWarranty] = useState("3 Years / 100,000 km Official Factory Warranty")

  // File Upload Handlers for Own Image
  const handleOwnImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      notify("Please select a valid image file (PNG, JPG, WEBP, or SVG).")
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setNewImageUrl(dataUrl)
      setOwnImageFileName(file.name)
      setOwnImageFileSize(`${(file.size / 1024).toFixed(1)} KB`)
      notify(`Loaded own image "${file.name}" successfully!`)
    }
    reader.readAsDataURL(file)
  }

  const handleAddGalleryImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setGalleryImages((prev) => [...prev, dataUrl])
      notify(`Added gallery image "${file.name}"!`)
    }
    reader.readAsDataURL(file)
  }

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return
    setFeaturesList((prev) => [...prev, newFeatureText.trim()])
    setNewFeatureText("")
  }

  const handleRemoveFeature = (idx: number) => {
    setFeaturesList((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleAddSpec = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) {
      notify("Please provide both specification metric and value.")
      return
    }
    setSpecsList((prev) => [...prev, { key: newSpecKey.trim(), value: newSpecValue.trim() }])
    setNewSpecKey("")
    setNewSpecValue("")
  }

  const handleRemoveSpec = (idx: number) => {
    setSpecsList((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleAddCompat = () => {
    if (!newCompatText.trim()) return
    setCompatList((prev) => [...prev, newCompatText.trim()])
    setNewCompatText("")
  }

  const handleRemoveCompat = (idx: number) => {
    setCompatList((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleAddIncluded = () => {
    if (!newIncludedText.trim()) return
    setIncludedList((prev) => [...prev, newIncludedText.trim()])
    setNewIncludedText("")
  }

  const handleRemoveIncluded = (idx: number) => {
    setIncludedList((prev) => prev.filter((_, i) => i !== idx))
  }

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editPrice, setEditPrice] = useState("")
  const [editStockStatus, setEditStockStatus] = useState<"In Stock" | "Out of Stock" | "Custom Order">("In Stock")

  // Orders filtering & tracking
  const [orderFilter, setOrderFilter] = useState<string>("all")
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null)
  const [customTrackingInput, setCustomTrackingInput] = useState<Record<string, string>>({})

  // Store Content Settings Form State
  const [announcementText, setAnnouncementText] = useState(storeSettings.announcementText)
  const [hubAddress, setHubAddress] = useState(storeSettings.hubLocation)
  const [supportPhone, setSupportPhone] = useState(storeSettings.supportPhone)
  const [supportWhatsapp, setSupportWhatsapp] = useState(storeSettings.supportWhatsapp)
  const [vatRate, setVatRate] = useState(String(storeSettings.vatRatePercentage))
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(String(storeSettings.freeDeliveryThresholdNpr))

  // Calculated Stats
  const stats = useMemo(() => {
    const grossSales = orders.reduce((sum, o) => sum + (o.totalPaid || 0), 0)
    const inTransitCount = orders.filter((o) => o.fulfillmentStatus === "In Transit" || o.fulfillmentStatus === "Dispatched from Kathmandu Hub").length
    const deliveredCount = orders.filter((o) => o.fulfillmentStatus === "Delivered").length
    const processingCount = orders.filter((o) => o.fulfillmentStatus === "Processing" || o.fulfillmentStatus === "Order Placed").length
    const totalVatCollected = Math.round(grossSales * 0.13)
    return {
      grossSales,
      inTransitCount,
      deliveredCount,
      processingCount,
      totalVatCollected,
      totalOrders: orders.length,
      totalProducts: products.length,
    }
  }, [orders, products])

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.brand.toLowerCase().includes(productSearch.toLowerCase())
      const matchCategory = categoryFilter === "all" || p.subcategory === categoryFilter
      const matchStock =
        stockFilter === "all" ||
        (stockFilter === "in_stock" && p.availability === "In Stock") ||
        (stockFilter === "out_of_stock" && p.availability === "Out of Stock")
      return matchSearch && matchCategory && matchStock
    })
  }, [products, productSearch, categoryFilter, stockFilter])

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (orderFilter === "all") return orders
    return orders.filter((o) => o.fulfillmentStatus.toLowerCase().includes(orderFilter.toLowerCase()))
  }, [orders, orderFilter])

  // Handlers
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) {
      notify("Please provide a product title.")
      return
    }
    const priceNum = Number(newPrice) || 100000

    // Construct specifications dictionary
    const specRecord: Record<string, string | null> = {}
    specsList.forEach((s) => {
      if (s.key.trim()) specRecord[s.key.trim()] = s.value.trim()
    })

    const newProd = addProduct({
      name: newTitle.trim(),
      brand: newBrand.trim(),
      category: "EV Parts",
      subcategory: newSubcategory,
      voltage: newVoltage,
      price: priceNum,
      availability: newStockStatus,
      image: newImageUrl,
      description:
        newDescription.trim() ||
        newTagline.trim() ||
        `Authentic high-performance ${newSubcategory} component verified for Nepal EV builds. Complete with official warranty and 13% Nepal VAT.`,
      attributes:
        featuresList.length > 0
          ? featuresList
          : [`${newVoltage} Architecture`, "Nepal Delivery Ready", "13% VAT Inclusive"],
      region: newRegion,
      productType: newSubcategory,
      rating: 5.0,
      createdAt: Date.now(),
      popularity: 98,
      detail: {
        model: newSku.trim() || `${newBrand.replace(/\s+/g, "")}-${Date.now().toString().slice(-4)}`,
        gallery: [newImageUrl, ...galleryImages].filter(Boolean),
        variants: [
          {
            id: "std",
            label: "Standard Edition",
            color: "#151b2d",
            sku: newSku.trim() || `SKU-${Date.now()}`,
            available: newStockStatus !== "Out of Stock",
          },
        ],
        importEligibility: "Verified eligible",
        specifications: specRecord,
        compatibility:
          compatList.length > 0
            ? compatList
            : ["Universal 800V EV Conversions", "Custom High-Voltage Track Prototypes"],
        includedItems:
          includedList.length > 0
            ? includedList
            : [
                "High-voltage connection harness",
                "Factory dyno calibration report",
                "Nepal IRD 13% Tax Invoice with Official Stamp",
              ],
        warranty: newWarranty,
      },
    })

    setUploadModalOpen(false)
    setNewTitle("")
    notify(`Product "${newProd.name}" published with custom images & specifications!`)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    const priceNum = Number(editPrice) || editingProduct.price || 100000
    updateProduct(editingProduct.id, {
      price: priceNum,
      availability: editStockStatus,
    })
    setEditingProduct(null)
  }

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateStoreSettings({
      announcementText,
      hubLocation: hubAddress,
      supportPhone,
      supportWhatsapp,
      vatRatePercentage: Number(vatRate) || 13,
      freeDeliveryThresholdNpr: Number(freeDeliveryThreshold) || 100000,
    })
  }

  // Permission Gate Screen if logged in as customer
  if (!isOwner) {
    return (
      <div className="ubuy-owner-gate container">
        <div className="owner-gate-card">
          <div className="owner-gate-icon">
            <ShieldCheck size={36} className="text-amber-500" />
          </div>
          <Heading as="h1" className="owner-gate-title">
            Store Owner & Vendor Portal
          </Heading>
          <p className="owner-gate-sub">
            This area requires Store Owner / Vendor permissions. You are currently viewing as{" "}
            <strong>{user.fullName}</strong> (<span className="text-amber-600">{user.email}</span>, Role: Customer).
          </p>

          <div className="owner-gate-features">
            <div className="feature-item">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Upload new EV products & set NPR prices with 13% Nepal VAT</span>
            </div>
            <div className="feature-item">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Manage & update customer order fulfillment statuses</span>
            </div>
            <div className="feature-item">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Assign Nepal courier tracking numbers (DHL, Aramex, Sundar Express)</span>
            </div>
            <div className="feature-item">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Configure store announcement bar & VAT rules</span>
            </div>
          </div>

          <div className="owner-gate-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                switchRole("owner")
              }}
            >
              <Zap size={18} /> Switch to Store Owner Demo Mode
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/account")}
            >
              Back to Customer Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ubuy-dash-shell">
      {/* Main Content Area */}
      <div className="dash-main-area">
        {/* Top Dashboard Header Bar */}
        <div className="dash-header-bar">
          <div className="dash-header-left">
            <Heading as="h1">
              {activeTab === "overview" && "Store Operations & Performance"}
              {activeTab === "products" && "Products & Catalog Hub"}
              {activeTab === "orders" && "Order Fulfillment & Logistics"}
              {activeTab === "settings" && "Store Settings & Content"}
            </Heading>
            <p>
              Operating as <strong>{user.fullName || "ABC EV PART Owner"}</strong> · Kathmandu Central Distribution Hub · 13% Nepal VAT Verified
            </p>
          </div>
          <div className="dash-header-right">
            <div className="dash-date-pill">
              <Clock size={14} className="text-amber-500" />
              <span>Sun, 31 Oct 2026</span>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setUploadModalOpen(true)}
            >
              <Plus size={15} /> Upload Product
            </Button>
          </div>
        </div>

          {/* TAB 1: OVERVIEW & KPIS */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-6">
              {/* 4 Financial & Operational Metric Cards (Fogo/Oripio style) */}
              <div className="dash-kpis-grid">
                {/* Highlighted Gross Revenue Card */}
                <div className="dash-kpi-card-modern dash-kpi-card-modern--highlight">
                  <div className="dash-kpi-top">
                    <span className="dash-kpi-label">Gross Revenue (NPR)</span>
                    <span className="dash-kpi-trend-pill trend-up-white">
                      <TrendingUp size={12} /> +18.4%
                    </span>
                  </div>
                  <strong className="dash-kpi-val">{formatNpr(stats.grossSales)}</strong>
                  <span className="dash-kpi-sub">
                    Includes 13% Nepal VAT ({formatNpr(stats.totalVatCollected)})
                  </span>
                </div>

                {/* Total Orders */}
                <div className="dash-kpi-card-modern">
                  <div className="dash-kpi-top">
                    <span className="dash-kpi-label">Total Orders</span>
                    <div className="dash-kpi-icon-box text-blue-600 bg-blue-50">
                      <Package size={20} />
                    </div>
                  </div>
                  <strong className="dash-kpi-val">{stats.totalOrders}</strong>
                  <span className="dash-kpi-sub text-slate-500">
                    {stats.processingCount} pending · {stats.deliveredCount} delivered
                  </span>
                </div>

                {/* Dispatched / In Transit */}
                <div className="dash-kpi-card-modern">
                  <div className="dash-kpi-top">
                    <span className="dash-kpi-label">In Transit Dispatch</span>
                    <div className="dash-kpi-icon-box text-amber-600 bg-amber-50">
                      <Truck size={20} />
                    </div>
                  </div>
                  <strong className="dash-kpi-val">{stats.inTransitCount}</strong>
                  <span className="dash-kpi-sub text-amber-600 font-medium">
                    Active courier consignments
                  </span>
                </div>

                {/* Listed Store Products */}
                <div className="dash-kpi-card-modern">
                  <div className="dash-kpi-top">
                    <span className="dash-kpi-label">Catalog Products</span>
                    <div className="dash-kpi-icon-box text-purple-600 bg-purple-50">
                      <Boxes size={20} />
                    </div>
                  </div>
                  <strong className="dash-kpi-val">{stats.totalProducts}</strong>
                  <span className="dash-kpi-sub text-purple-600 font-medium">
                    100% genuine · verified stock
                  </span>
                </div>
              </div>

              {/* Analytics Split Grid: Interactive SVG Chart + Regional Reach */}
              <div className="dash-analytics-split">
                {/* Left: SVG Dual-Curve Area Chart (Fogo & Boltz style) */}
                <div className="dash-chart-card">
                  <div className="dash-chart-header">
                    <div>
                      <h2 className="dash-chart-title">Revenue & Order Volume Over Time</h2>
                      <p className="dash-chart-sub">2026 monthly delivery cycles from Kathmandu Hub</p>
                    </div>
                    <div className="dash-chart-legend">
                      <span className="flex items-center gap-1.5">
                        <span className="dash-legend-dot bg-amber-500" />
                        <span>Revenue (NPR)</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="dash-legend-dot bg-blue-500" />
                        <span>Dispatches</span>
                      </span>
                    </div>
                  </div>

                  <div className="dash-svg-wrapper">
                    <svg viewBox="0 0 640 220" className="dash-svg-chart" aria-label="Revenue chart">
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f58220" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#f58220" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
                      <line x1="40" y1="35" x2="620" y2="35" stroke="#f1f5f9" strokeDasharray="4 4" />
                      <line x1="40" y1="80" x2="620" y2="80" stroke="#f1f5f9" strokeDasharray="4 4" />
                      <line x1="40" y1="125" x2="620" y2="125" stroke="#f1f5f9" strokeDasharray="4 4" />
                      <line x1="40" y1="170" x2="620" y2="170" stroke="#f1f5f9" strokeDasharray="4 4" />

                      {/* Y-axis labels */}
                      <text x="10" y="38" fill="#94a3b8" fontSize="10" fontWeight="600">600k</text>
                      <text x="10" y="83" fill="#94a3b8" fontSize="10" fontWeight="600">400k</text>
                      <text x="10" y="128" fill="#94a3b8" fontSize="10" fontWeight="600">200k</text>
                      <text x="25" y="173" fill="#94a3b8" fontSize="10" fontWeight="600">0</text>

                      {/* Area Fill for Order Dispatches */}
                      <path
                        d="M 50,165 C 130,160 190,148 260,135 C 330,122 390,130 460,110 C 530,90 570,80 610,65 L 610,170 L 50,170 Z"
                        fill="url(#orderGrad)"
                      />
                      {/* Line Curve for Order Dispatches */}
                      <path
                        d="M 50,165 C 130,160 190,148 260,135 C 330,122 390,130 460,110 C 530,90 570,80 610,65"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Area Fill for Revenue */}
                      <path
                        d="M 50,150 C 130,140 190,120 260,105 C 330,90 390,95 460,70 C 530,50 570,45 610,25 L 610,170 L 50,170 Z"
                        fill="url(#revenueGrad)"
                      />
                      {/* Line Curve for Revenue */}
                      <path
                        d="M 50,150 C 130,140 190,120 260,105 C 330,90 390,95 460,70 C 530,50 570,45 610,25"
                        fill="none"
                        stroke="#f58220"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Coordinate Dots */}
                      <circle cx="50" cy="150" r="4" fill="#f58220" />
                      <circle cx="260" cy="105" r="4" fill="#f58220" />
                      <circle cx="460" cy="70" r="4" fill="#f58220" />
                      
                      {/* Active Highlight Coordinate & Tooltip (Fogo style) */}
                      <circle cx="610" cy="25" r="6" fill="#f58220" stroke="#ffffff" strokeWidth="2.5" />
                      <g transform="translate(480, 5)">
                        <rect x="0" y="0" width="125" height="26" rx="8" fill="#0f172a" />
                        <text x="62" y="17" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="700">
                          Today: NPR 548,300
                        </text>
                      </g>

                      {/* X-axis Month labels */}
                      <text x="50" y="195" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">May</text>
                      <text x="160" y="195" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">Jun</text>
                      <text x="260" y="195" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">Jul</text>
                      <text x="360" y="195" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">Aug</text>
                      <text x="460" y="195" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">Sep</text>
                      <text x="605" y="195" textAnchor="middle" fill="#f58220" fontSize="11" fontWeight="700">Oct (Today)</text>
                    </svg>
                  </div>
                </div>

                {/* Right: Nepal Regional Reach Provincial Distribution */}
                <div className="dash-chart-card">
                  <div className="dash-chart-header">
                    <div>
                      <h2 className="dash-chart-title">Nepal Regional Reach</h2>
                      <p className="dash-chart-sub">Doorstep delivery across all 7 provinces</p>
                    </div>
                  </div>

                  <div className="provinces-list">
                    {NEPAL_PROVINCES.map((provObj) => {
                      const provName = provObj.province
                      const count = orders.filter(
                        (o) => o.deliveryAddress?.province === provName,
                      ).length
                      return (
                        <div key={provName} className="province-row">
                          <div className="province-name">
                            <MapPin size={13} className="text-amber-500" />
                            <span>{provName}</span>
                          </div>
                          <div className="province-meta">
                            <span className="province-count">{count} order(s)</span>
                            <div className="province-bar">
                              <div
                                className="province-bar-fill"
                                style={{
                                  width: `${Math.min(100, Math.max(15, count * 25))}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Buyer Orders & Logistics Status Table (Fogo / Oripio style) */}
              <div className="dash-table-card">
                <div className="dash-table-header-row">
                  <div>
                    <h2 className="dash-chart-title">Recent Buyer Orders & Logistics Status</h2>
                    <p className="dash-chart-sub">Directly update fulfillment from Kathmandu Central Logistics Hub</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTabClick("orders")}
                  >
                    View All Orders <ArrowRight size={14} />
                  </Button>
                </div>

                <table className="dash-table-modern">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer & Destination</th>
                      <th>Total Amount</th>
                      <th>Fulfillment Status</th>
                      <th>Quick Status Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => {
                      const isDelivered = order.fulfillmentStatus === "Delivered"
                      const isInTransit = order.fulfillmentStatus === "In Transit" || order.fulfillmentStatus === "Dispatched from Kathmandu Hub"
                      
                      return (
                        <tr key={order.id}>
                          <td>
                            <strong>{order.orderNumber}</strong>
                            <div className="text-xs text-slate-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td>
                            <div className="font-semibold text-slate-900">
                              {order.deliveryAddress?.fullName || "Aayush Shrestha"}
                            </div>
                            <div className="text-xs text-slate-500">
                              {order.deliveryAddress?.city}, {order.deliveryAddress?.province}
                            </div>
                          </td>
                          <td>
                            <strong>{formatNpr(order.totalPaid)}</strong>
                            <div className="text-xs text-slate-400">
                              {order.items.length} item(s) · 13% VAT inc
                            </div>
                          </td>
                          <td>
                            <span
                              className={`dash-status-pill ${
                                isDelivered
                                  ? "status--delivered"
                                  : isInTransit
                                  ? "status--in-transit"
                                  : "status--processing"
                              }`}
                            >
                              <span className="dash-status-dot" />
                              {order.fulfillmentStatus}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <select
                                className="status-dropdown text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white cursor-pointer font-medium"
                                value={order.fulfillmentStatus}
                                onChange={(e) =>
                                  updateOrderStatus(
                                    order.id,
                                    e.target.value as Order["fulfillmentStatus"],
                                  )
                                }
                              >
                                <option value="Order Placed">Order Placed</option>
                                <option value="Processing">Processing</option>
                                <option value="Dispatched from Kathmandu Hub">
                                  Dispatched (Kathmandu)
                                </option>
                                <option value="In Transit">In Transit</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedInvoiceOrder(order)}
                                title="View 13% Nepal VAT Tax Invoice"
                              >
                                <Printer size={13} /> VAT Bill
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

      {/* TAB 2: PRODUCTS & CATALOG MANAGEMENT */}
      {activeTab === "products" && (
        <div className="owner-tab-panel">
          <div className="products-control-bar">
            <div className="products-search-wrap">
              <Search size={16} className="search-icon" />
              <Input
                placeholder="Search products by title or brand..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>

            <div className="products-filters-group">
              <select
                className="filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Subcategories</option>
                {SUBCATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                className="filter-select"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="all">All Inventory</option>
                <option value="in_stock">In Stock Only</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>

              <Button
                variant="primary"
                onClick={() => setUploadModalOpen(true)}
              >
                <Plus size={16} /> Upload New Product
              </Button>
            </div>
          </div>

          {/* Product Items Table */}
          <div className="owner-table-card">
            <table className="owner-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Subcategory</th>
                  <th>Voltage</th>
                  <th>Price (NPR)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <div className="product-table-cell">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="product-table-thumb"
                        />
                        <div>
                          <strong className="product-table-name">
                            {prod.name}
                          </strong>
                          <span className="product-table-brand">
                            {prod.brand}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="table-pill">{prod.subcategory}</span>
                    </td>
                    <td>
                      <span className="table-voltage-badge">{prod.voltage}</span>
                    </td>
                    <td>
                      <strong>{formatNpr(prod.price)}</strong>
                      <div className="text-xs text-emerald-600">13% VAT Inc.</div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`stock-toggle-btn ${
                          prod.availability === "In Stock" ? "is-instock" : "is-out"
                        }`}
                        onClick={() => {
                          const nextStatus =
                            prod.availability === "In Stock"
                              ? "Out of Stock"
                              : "In Stock"
                          updateProduct(prod.id, { availability: nextStatus })
                        }}
                      >
                        {prod.availability}
                      </button>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        <IconButton
                          label="Edit product"
                          onClick={() => {
                            setEditingProduct(prod)
                            setEditPrice(String(prod.price || ""))
                            setEditStockStatus(prod.availability)
                          }}
                        >
                          <Edit2 size={16} />
                        </IconButton>
                        <IconButton
                          label="Delete product"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Remove "${prod.name}" from the store catalog?`,
                              )
                            ) {
                              deleteProduct(prod.id)
                            }
                          }}
                        >
                          <Trash2 size={16} className="text-rose-500" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDER FULFILLMENT & LOGISTICS */}
      {activeTab === "orders" && (
        <div className="owner-tab-panel">
          {/* Order Status Filter Chips */}
          <div className="orders-filter-chips">
            {[
              { id: "all", label: "All Orders" },
              { id: "order placed", label: "Order Placed" },
              { id: "processing", label: "Processing" },
              { id: "dispatched", label: "Dispatched from Kathmandu" },
              { id: "in transit", label: "In Transit" },
              { id: "delivered", label: "Delivered" },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                className={`order-chip-btn ${orderFilter === chip.id ? "is-active" : ""}`}
                onClick={() => setOrderFilter(chip.id)}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Orders Cards Stack */}
          <div className="orders-stack">
            {filteredOrders.map((order) => (
              <article key={order.id} className="owner-order-card">
                <div className="order-card-header">
                  <div className="order-main-meta">
                    <span className="order-num-tag">{order.orderNumber}</span>
                    <span className="order-timestamp">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="order-header-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedInvoiceOrder(order)}
                    >
                      <Printer size={14} /> 13% VAT Tax Invoice
                    </Button>
                    <Badge
                      tone={
                        order.fulfillmentStatus === "Delivered"
                          ? "success"
                          : order.fulfillmentStatus === "In Transit" ||
                            order.fulfillmentStatus === "Dispatched from Kathmandu Hub"
                          ? "brand"
                          : "neutral"
                      }
                    >
                      {order.fulfillmentStatus}
                    </Badge>
                  </div>
                </div>

                <div className="order-card-body">
                  {/* Buyer & Destination */}
                  <div className="order-column">
                    <span className="order-column-title">
                      Customer & Nepal Delivery Address
                    </span>
                    <strong className="text-slate-900">
                      {order.deliveryAddress?.fullName || "Aayush Shrestha"}
                    </strong>
                    <div className="text-sm text-slate-600">
                      Phone: {order.deliveryAddress?.phone || "+977 9841234567"}
                    </div>
                    <div className="text-sm text-slate-600">
                      {order.deliveryAddress?.streetAddress}, {order.deliveryAddress?.city}
                    </div>
                    <div className="text-xs text-amber-700 font-medium">
                      {order.deliveryAddress?.province} · {order.deliveryAddress?.district}
                    </div>
                  </div>

                  {/* Purchased Items */}
                  <div className="order-column items-col">
                    <span className="order-column-title">Purchased Items</span>
                    <div className="order-items-scroll">
                      {order.items.map((item) => (
                        <div key={item.id} className="order-item-chip">
                          <img src={item.image} alt={item.name} />
                          <div>
                            <span className="order-item-title">{item.name}</span>
                            <span className="order-item-meta">
                              Qty: {item.quantity} · {formatNpr(item.price)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial & Status Update */}
                  <div className="order-column controls-col">
                    <span className="order-column-title">
                      Payment & Fulfillment Status
                    </span>
                    <div className="order-total-highlight">
                      Paid: {formatNpr(order.totalPaid)}
                      <span className="text-xs font-normal text-slate-500 ml-1">
                        (VAT & Shipping Inc.)
                      </span>
                    </div>

                    <div className="status-control-box">
                      <label htmlFor={`status-${order.id}`} className="text-xs font-semibold text-slate-700">
                        Update Fulfillment:
                      </label>
                      <select
                        id={`status-${order.id}`}
                        className="status-dropdown status-dropdown--wide"
                        value={order.fulfillmentStatus}
                        onChange={(e) =>
                          updateOrderStatus(
                            order.id,
                            e.target.value as Order["fulfillmentStatus"],
                          )
                        }
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Processing">Processing at Kathmandu Hub</option>
                        <option value="Dispatched from Kathmandu Hub">
                          Dispatched from Kathmandu Hub
                        </option>
                        <option value="In Transit">In Transit (Domestic Courier)</option>
                        <option value="Delivered">Delivered to Doorstep</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Tracking Number Input */}
                    <div className="tracking-control-box">
                      <label className="text-xs text-slate-500">
                        Consignment / Tracking:
                      </label>
                      <div className="tracking-input-row">
                        <Input
                          placeholder="e.g. DHL-NP-883921"
                          value={
                            customTrackingInput[order.id] !== undefined
                              ? customTrackingInput[order.id]
                              : order.trackingNumber || ""
                          }
                          onChange={(e) =>
                            setCustomTrackingInput((prev) => ({
                              ...prev,
                              [order.id]: e.target.value,
                            }))
                          }
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            const newTracking = customTrackingInput[order.id]
                            if (newTracking) {
                              updateOrderStatus(
                                order.id,
                                order.fulfillmentStatus,
                                newTracking,
                              )
                            }
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STORE SETTINGS & ANNOUNCEMENTS */}
      {activeTab === "settings" && (
        <div className="owner-tab-panel">
          <div className="settings-container">
            <div className="settings-header">
              <Heading as="h2" className="settings-title">
                Store Policy & Content Management
              </Heading>
              <p className="settings-sub">
                Control the announcement bar, VAT rates, and Kathmandu logistics center details.
              </p>
            </div>

            <form className="settings-form" onSubmit={handleSettingsSubmit}>
              <div className="settings-field">
                <label htmlFor="announcement-input">Store Announcement Bar Text</label>
                <Input
                  id="announcement-input"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. Nepal Delivery Only · 100% Authentic with 13% Nepal VAT Included"
                />
                <span className="field-hint">
                  Visible to all customers at the top of every page.
                </span>
              </div>

              <div className="settings-grid-2">
                <div className="settings-field">
                  <label htmlFor="vat-rate-input">Nepal VAT Rate (%)</label>
                  <Input
                    id="vat-rate-input"
                    type="number"
                    value={vatRate}
                    onChange={(e) => setVatRate(e.target.value)}
                  />
                  <span className="field-hint">Standard Nepal IRD VAT is 13%.</span>
                </div>

                <div className="settings-field">
                  <label htmlFor="free-ship-input">Free Delivery Threshold (NPR)</label>
                  <Input
                    id="free-ship-input"
                    type="number"
                    value={freeDeliveryThreshold}
                    onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                  />
                  <span className="field-hint">
                    Orders above this value receive complimentary domestic transit.
                  </span>
                </div>
              </div>

              <div className="settings-field">
                <label htmlFor="hub-addr-input">Logistics Hub & Inspection Depot</label>
                <Input
                  id="hub-addr-input"
                  value={hubAddress}
                  onChange={(e) => setHubAddress(e.target.value)}
                />
                <span className="field-hint">
                  Primary intake & dispatch point for incoming international air cargo.
                </span>
              </div>

              <div className="settings-grid-2">
                <div className="settings-field">
                  <label htmlFor="support-phone">Customer Hotline Phone</label>
                  <Input
                    id="support-phone"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                  />
                </div>

                <div className="settings-field">
                  <label htmlFor="support-whatsapp">Viber / WhatsApp Support</label>
                  <Input
                    id="support-whatsapp"
                    value={supportWhatsapp}
                    onChange={(e) => setSupportWhatsapp(e.target.value)}
                  />
                </div>
              </div>

              <div className="settings-actions">
                <Button variant="primary" size="lg" type="submit">
                  <Check size={18} /> Save Store Configuration
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>

      {/* MODAL 1: UPLOAD NEW PRODUCT (ENHANCED WITH OWN IMAGE, RICH DESCRIPTION & SPECIFICATIONS) */}
      {uploadModalOpen && (
        <div className="owner-modal-backdrop" onClick={() => setUploadModalOpen(false)}>
          <div
            className="owner-modal-content owner-modal-content--expanded"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header pb-3 border-b border-slate-100 mb-4">
              <div>
                <Heading as="h2" className="modal-title flex items-center gap-2">
                  <Upload size={22} className="text-amber-500" />
                  Upload New High-Voltage Product
                </Heading>
                <p className="modal-sub">
                  Upload authentic photos, write customized specifications, and publish live to the ABC EV PART storefront.
                </p>
              </div>
              <IconButton label="Close modal" onClick={() => setUploadModalOpen(false)}>
                <X size={20} />
              </IconButton>
            </div>

            {/* Upload Step Tabs */}
            <div className="upload-modal-tabs">
              {[
                { id: "basic", label: "1. Basic & Pricing", icon: Tag },
                { id: "media", label: "2. Own Image & Media", icon: Camera },
                { id: "description", label: "3. Description & Features", icon: FileText },
                { id: "specs", label: "4. Technical Specifications", icon: Wrench },
                { id: "fitment", label: "5. Fitment & Box Items", icon: Package },
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = uploadTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`upload-tab-btn ${isActive ? "is-active" : ""}`}
                    onClick={() => setUploadTab(tab.id as typeof uploadTab)}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            <form className="modal-form flex-1 overflow-y-auto" onSubmit={handleUploadSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 7 Columns: Active Tab Form Fields */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  {/* TAB 1: BASIC INFO & PRICING */}
                  {uploadTab === "basic" && (
                    <div className="flex flex-col gap-4">
                      <div className="modal-field">
                        <label htmlFor="prod-title" className="font-bold text-xs text-slate-800">
                          Product Title / Name *
                        </label>
                        <Input
                          id="prod-title"
                          required
                          placeholder="e.g. ABC EV HyperFlux 800V Axial Traction Motor"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                        />
                      </div>

                      <div className="modal-grid-2">
                        <div className="modal-field">
                          <label htmlFor="prod-brand" className="font-bold text-xs text-slate-800">
                            Brand / Manufacturer *
                          </label>
                          <Input
                            id="prod-brand"
                            required
                            placeholder="e.g. ABC EV Performance"
                            value={newBrand}
                            onChange={(e) => setNewBrand(e.target.value)}
                          />
                        </div>

                        <div className="modal-field">
                          <label htmlFor="prod-subcat" className="font-bold text-xs text-slate-800">
                            Subcategory *
                          </label>
                          <select
                            id="prod-subcat"
                            className="modal-select"
                            value={newSubcategory}
                            onChange={(e) => setNewSubcategory(e.target.value)}
                          >
                            {SUBCATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="modal-grid-3">
                        <div className="modal-field">
                          <label htmlFor="prod-voltage" className="font-bold text-xs text-slate-800">
                            Voltage Architecture
                          </label>
                          <select
                            id="prod-voltage"
                            className="modal-select"
                            value={newVoltage}
                            onChange={(e) => setNewVoltage(e.target.value as (typeof VOLTAGES)[number])}
                          >
                            {VOLTAGES.map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="modal-field">
                          <label htmlFor="prod-price" className="font-bold text-xs text-slate-800">
                            Price in NPR (13% VAT inc.) *
                          </label>
                          <Input
                            id="prod-price"
                            type="number"
                            required
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                          />
                        </div>

                        <div className="modal-field">
                          <label htmlFor="prod-stock" className="font-bold text-xs text-slate-800">
                            Stock Availability
                          </label>
                          <select
                            id="prod-stock"
                            className="modal-select"
                            value={newStockStatus}
                            onChange={(e) => setNewStockStatus(e.target.value as (typeof newStockStatus))}
                          >
                            <option value="In Stock">In Stock</option>
                            <option value="Custom Order">Custom Order</option>
                            <option value="Out of Stock">Out of Stock</option>
                          </select>
                        </div>
                      </div>

                      <div className="modal-grid-3">
                        <div className="modal-field">
                          <label htmlFor="prod-stock-count" className="font-bold text-xs text-slate-800">
                            Units at Kathmandu Hub
                          </label>
                          <Input
                            id="prod-stock-count"
                            type="number"
                            value={newStockCount}
                            onChange={(e) => setNewStockCount(e.target.value)}
                          />
                        </div>

                        <div className="modal-field">
                          <label htmlFor="prod-sku" className="font-bold text-xs text-slate-800">
                            Catalog SKU / Part No.
                          </label>
                          <Input
                            id="prod-sku"
                            value={newSku}
                            onChange={(e) => setNewSku(e.target.value)}
                            placeholder="e.g. VC-800V-AX900-NP"
                          />
                        </div>

                        <div className="modal-field">
                          <label htmlFor="prod-region" className="font-bold text-xs text-slate-800">
                            Country of Origin
                          </label>
                          <select
                            id="prod-region"
                            className="modal-select"
                            value={newRegion}
                            onChange={(e) => setNewRegion(e.target.value as Product["region"])}
                          >
                            {["Europe", "USA", "Japan", "UK", "Korea", "China", "Australia"].map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Nepal 13% VAT Calculation Breakdown Box */}
                      <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={18} className="text-amber-600 flex-shrink-0" />
                          <div>
                            <strong className="text-slate-900 block font-bold">13% Nepal VAT Compliant</strong>
                            <span className="text-slate-600 text-[11px]">
                              Base Value: रु {Math.round((Number(newPrice) || 0) / 1.13).toLocaleString()} + 13% VAT: रु{" "}
                              {((Number(newPrice) || 0) - Math.round((Number(newPrice) || 0) / 1.13)).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-amber-700 bg-white px-2.5 py-1 rounded-md border border-amber-200">
                          {formatNpr(Number(newPrice) || 0)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: OWN IMAGE & MEDIA UPLOAD */}
                  {uploadTab === "media" && (
                    <div className="flex flex-col gap-4">
                      {/* Image Source Mode Selector */}
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold text-slate-700 mr-2">Image Source:</span>
                        {[
                          { id: "upload", label: "📁 Upload from Computer", desc: "Choose file" },
                          { id: "preset", label: "🖼️ Preset 3D EV Renders", desc: "Select render" },
                          { id: "url", label: "🌐 Web Image URL", desc: "Paste direct URL" },
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setImageInputMode(m.id as typeof imageInputMode)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                              imageInputMode === m.id
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>

                      {/* MODE A: Upload from Computer File */}
                      {imageInputMode === "upload" && (
                        <div className="flex flex-col gap-3">
                          <input
                            type="file"
                            id="own-product-file-input"
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            onChange={handleOwnImageUpload}
                            className="hidden"
                          />

                          <label
                            htmlFor="own-product-file-input"
                            className="upload-dropzone group block cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                              <FileUp size={24} />
                            </div>
                            <strong className="text-xs font-bold text-slate-800 block">
                              Click to Browse or Drag & Drop Product Image
                            </strong>
                            <span className="text-[11px] text-slate-500 block mt-1">
                              Supports high-resolution PNG, JPG, WEBP, or SVG up to 10MB
                            </span>
                          </label>

                          {ownImageFileName && (
                            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                                <div className="min-w-0">
                                  <strong className="text-slate-900 font-bold block truncate">
                                    {ownImageFileName}
                                  </strong>
                                  <span className="text-slate-500 text-[10px]">
                                    Loaded file · {ownImageFileSize}
                                  </span>
                                </div>
                              </div>
                              <label
                                htmlFor="own-product-file-input"
                                className="text-xs font-bold text-amber-600 hover:underline cursor-pointer flex-shrink-0"
                              >
                                Replace File
                              </label>
                            </div>
                          )}
                        </div>
                      )}

                      {/* MODE B: Preset EV Render Thumbnails */}
                      {imageInputMode === "preset" && (
                        <div className="flex flex-col gap-2">
                          <span className="text-xs text-slate-500">
                            Select one of our studio-grade high-voltage subsystem 3D renders:
                          </span>
                          <div className="preset-images-grid">
                            {PRESET_IMAGES.map((preset) => (
                              <button
                                key={preset.url}
                                type="button"
                                className={`preset-thumb-btn ${newImageUrl === preset.url ? "is-selected" : ""}`}
                                onClick={() => {
                                  setNewImageUrl(preset.url)
                                  setOwnImageFileName(null)
                                }}
                              >
                                <img src={preset.url} alt={preset.label} />
                                <span>{preset.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* MODE C: Direct Web URL */}
                      {imageInputMode === "url" && (
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-slate-700">Custom Image Web URL</label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="https://images.unsplash.com/... or CDN link"
                              value={customUrlInput}
                              onChange={(e) => setCustomUrlInput(e.target.value)}
                              className="text-xs"
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => {
                                if (customUrlInput.trim()) {
                                  setNewImageUrl(customUrlInput.trim())
                                  setOwnImageFileName("Web URL Image")
                                  notify("Custom image URL applied!")
                                }
                              }}
                            >
                              Apply
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Additional Gallery Photos Section */}
                      <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <strong className="text-xs font-bold text-slate-800">
                            Secondary Gallery Photos ({galleryImages.length})
                          </strong>
                          <input
                            type="file"
                            id="gallery-file-input"
                            accept="image/*"
                            onChange={handleAddGalleryImageFile}
                            className="hidden"
                          />
                          <label
                            htmlFor="gallery-file-input"
                            className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer flex items-center gap-1"
                          >
                            <Plus size={14} /> Add Gallery Angle
                          </label>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {galleryImages.map((img, idx) => (
                            <div
                              key={idx}
                              className="relative w-16 h-16 rounded-lg border border-slate-200 overflow-hidden group bg-slate-50"
                            >
                              <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setGalleryImages((prev) => prev.filter((_, i) => i !== idx))}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove photo"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CUSTOM DESCRIPTION & FEATURES */}
                  {uploadTab === "description" && (
                    <div className="flex flex-col gap-4">
                      <div className="modal-field">
                        <label htmlFor="prod-tagline" className="font-bold text-xs text-slate-800">
                          Short Hero Tagline / Hook
                        </label>
                        <Input
                          id="prod-tagline"
                          placeholder="e.g. Next-generation 800V dual axial flux traction motor for hyper-performance builds."
                          value={newTagline}
                          onChange={(e) => setNewTagline(e.target.value)}
                        />
                      </div>

                      <div className="modal-field">
                        <label htmlFor="prod-desc" className="font-bold text-xs text-slate-800">
                          Comprehensive Engineering Overview & Specs
                        </label>
                        <textarea
                          id="prod-desc"
                          className="modal-textarea text-xs"
                          rows={4}
                          placeholder="Describe rotor geometry, magnetic flux density, liquid-glycol stator jacket, and Nepal operating capabilities..."
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                        />
                      </div>

                      {/* Key Features Bullet List */}
                      <div className="modal-field">
                        <label className="font-bold text-xs text-slate-800">
                          Key Feature Highlights ({featuresList.length})
                        </label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {featuresList.map((feat, idx) => (
                            <span key={idx} className="feature-tag-chip">
                              <span>{feat}</span>
                              <button type="button" onClick={() => handleRemoveFeature(idx)}>
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Input
                            placeholder="Add feature e.g. 98.9% Peak Efficiency or Liquid-Cooled IP67"
                            value={newFeatureText}
                            onChange={(e) => setNewFeatureText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAddFeature()
                              }
                            }}
                            className="text-xs"
                          />
                          <Button type="button" variant="secondary" onClick={handleAddFeature}>
                            <Plus size={14} /> Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: TECHNICAL SPECIFICATIONS BUILDER */}
                  {uploadTab === "specs" && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <strong className="text-xs font-bold text-slate-800 block">
                            Technical Specifications Table ({specsList.length} metrics)
                          </strong>
                          <span className="text-[11px] text-slate-500">
                            Displayed on the live product detail page and comparative tables.
                          </span>
                        </div>
                      </div>

                      <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                        <table className="spec-edit-table">
                          <thead>
                            <tr>
                              <th>Metric Label</th>
                              <th>Specification Value</th>
                              <th style={{ width: "40px" }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {specsList.map((spec, idx) => (
                              <tr key={idx}>
                                <td>
                                  <input
                                    type="text"
                                    value={spec.key}
                                    onChange={(e) => {
                                      const val = e.target.value
                                      setSpecsList((prev) =>
                                        prev.map((item, i) => (i === idx ? { ...item, key: val } : item))
                                      )
                                    }}
                                    className="w-full text-xs font-medium text-slate-800 bg-transparent border-none focus:outline-none"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={spec.value}
                                    onChange={(e) => {
                                      const val = e.target.value
                                      setSpecsList((prev) =>
                                        prev.map((item, i) => (i === idx ? { ...item, value: val } : item))
                                      )
                                    }}
                                    className="w-full text-xs font-semibold text-slate-900 bg-transparent border-none focus:outline-none"
                                  />
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSpec(idx)}
                                    className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                                    title="Delete metric"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Add New Specification Row */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row gap-2">
                        <Input
                          placeholder="Metric (e.g. Max RPM)"
                          value={newSpecKey}
                          onChange={(e) => setNewSpecKey(e.target.value)}
                          className="text-xs sm:w-1/2"
                        />
                        <Input
                          placeholder="Value (e.g. 18,500 RPM)"
                          value={newSpecValue}
                          onChange={(e) => setNewSpecValue(e.target.value)}
                          className="text-xs sm:w-1/2"
                        />
                        <Button type="button" variant="primary" size="sm" onClick={handleAddSpec}>
                          <Plus size={14} /> Add
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: COMPATIBILITY & IN THE BOX */}
                  {uploadTab === "fitment" && (
                    <div className="flex flex-col gap-4">
                      {/* Vehicle Compatibility */}
                      <div className="modal-field">
                        <label className="font-bold text-xs text-slate-800">
                          Compatible Vehicle Platforms ({compatList.length})
                        </label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {compatList.map((c, idx) => (
                            <span key={idx} className="feature-tag-chip">
                              <span>{c}</span>
                              <button type="button" onClick={() => handleRemoveCompat(idx)}>
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add vehicle (e.g. Porsche Taycan or Custom 800V EV)"
                            value={newCompatText}
                            onChange={(e) => setNewCompatText(e.target.value)}
                            className="text-xs"
                          />
                          <Button type="button" variant="secondary" onClick={handleAddCompat}>
                            <Plus size={14} /> Add
                          </Button>
                        </div>
                      </div>

                      {/* Included Items in Box */}
                      <div className="modal-field">
                        <label className="font-bold text-xs text-slate-800">
                          Package Box Contents ({includedList.length})
                        </label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {includedList.map((item, idx) => (
                            <span key={idx} className="feature-tag-chip">
                              <span>{item}</span>
                              <button type="button" onClick={() => handleRemoveIncluded(idx)}>
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add item (e.g. High-Voltage Wire Loom or Dyno Certificate)"
                            value={newIncludedText}
                            onChange={(e) => setNewIncludedText(e.target.value)}
                            className="text-xs"
                          />
                          <Button type="button" variant="secondary" onClick={handleAddIncluded}>
                            <Plus size={14} /> Add
                          </Button>
                        </div>
                      </div>

                      {/* Warranty Terms */}
                      <div className="modal-field">
                        <label htmlFor="prod-warranty" className="font-bold text-xs text-slate-800">
                          Official Warranty Terms
                        </label>
                        <Input
                          id="prod-warranty"
                          value={newWarranty}
                          onChange={(e) => setNewWarranty(e.target.value)}
                          placeholder="e.g. 3 Years / 100,000 km Official Factory Warranty"
                          className="text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Right 5 Columns: Live Real-Time Storefront Card Preview */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sticky top-0 shadow-xs">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Eye size={14} className="text-amber-500" /> Live Storefront Card Preview
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {newStockStatus}
                      </span>
                    </div>

                    {/* Storefront Card Simulation */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                      {/* Image Preview */}
                      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                        <img
                          src={newImageUrl}
                          alt="Storefront preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = PRESET_IMAGES[0].url
                          }}
                        />
                        <div className="absolute top-2 left-2 flex gap-1">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                            {newVoltage}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white">
                            {newSubcategory.split("&")[0].trim()}
                          </span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-3.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          {newBrand || "Brand"}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mt-0.5">
                          {newTitle || "Product Name will appear here"}
                        </h4>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Price (13% VAT inc.)</span>
                            <strong className="text-sm font-black text-slate-900">
                              {formatNpr(Number(newPrice) || 0)}
                            </strong>
                          </div>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            {newStockCount} in Kathmandu
                          </span>
                        </div>

                        {/* Top 2 Features Preview */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col gap-1">
                          {featuresList.slice(0, 2).map((feat, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-600 truncate">
                              <Check size={10} className="text-amber-500 flex-shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-[10px] text-slate-500 leading-tight">
                      ℹ️ When published, this component will immediately be searchable across the entire catalogue and featured on the live storefront.
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="modal-actions mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <Button type="button" variant="secondary" onClick={() => setUploadModalOpen(false)}>
                  Cancel
                </Button>

                <div className="flex items-center gap-2">
                  {uploadTab !== "basic" && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        const tabs = ["basic", "media", "description", "specs", "fitment"] as const
                        const currIdx = tabs.indexOf(uploadTab)
                        if (currIdx > 0) setUploadTab(tabs[currIdx - 1])
                      }}
                    >
                      Previous
                    </Button>
                  )}

                  {uploadTab !== "fitment" ? (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => {
                        const tabs = ["basic", "media", "description", "specs", "fitment"] as const
                        const currIdx = tabs.indexOf(uploadTab)
                        if (currIdx < tabs.length - 1) setUploadTab(tabs[currIdx + 1])
                      }}
                    >
                      Next Step <ArrowRight size={14} />
                    </Button>
                  ) : (
                    <Button type="submit" variant="primary">
                      <Upload size={16} /> Publish Product to Storefront
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT PRODUCT */}
      {editingProduct && (
        <div
          className="owner-modal-backdrop"
          onClick={() => setEditingProduct(null)}
        >
          <div
            className="owner-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <Heading as="h2" className="modal-title">
                  Edit Product: {editingProduct.name}
                </Heading>
                <p className="modal-sub">
                  Update price or toggle stock availability instantly.
                </p>
              </div>
              <IconButton
                label="Close modal"
                onClick={() => setEditingProduct(null)}
              >
                <X size={20} />
              </IconButton>
            </div>

            <form className="modal-form" onSubmit={handleEditSubmit}>
              <div className="modal-field">
                <label htmlFor="edit-price-input">Price in NPR (13% VAT inc.)</label>
                <Input
                  id="edit-price-input"
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
              </div>

              <div className="modal-field">
                <label htmlFor="edit-avail-select">Stock Availability</label>
                <select
                  id="edit-avail-select"
                  className="modal-select"
                  value={editStockStatus}
                  onChange={(e) =>
                    setEditStockStatus(
                      e.target.value as (typeof editStockStatus),
                    )
                  }
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Custom Order">Custom Order</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div className="modal-actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  <Check size={16} /> Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: 13% NEPAL VAT TAX INVOICE PREVIEW */}
      {selectedInvoiceOrder && (
        <div
          className="owner-modal-backdrop"
          onClick={() => setSelectedInvoiceOrder(null)}
        >
          <div
            className="owner-modal-content invoice-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <Heading as="h2" className="modal-title">
                  Nepal IRD Tax Invoice (13% VAT Breakdown)
                </Heading>
                <p className="modal-sub">
                  Official bill of supply for order #{selectedInvoiceOrder.orderNumber}
                </p>
              </div>
              <IconButton
                label="Close"
                onClick={() => setSelectedInvoiceOrder(null)}
              >
                <X size={20} />
              </IconButton>
            </div>

            <div className="invoice-preview-sheet">
              {/* Header */}
              <div className="invoice-head">
                <div>
                  <div className="invoice-seller-name">ABC EV PART Nepal Pvt. Ltd.</div>
                  <div className="text-xs text-slate-500">
                    Kathmandu Central Hub, Ward 3, Bagmati Province
                  </div>
                  <div className="text-xs text-slate-700 font-semibold">
                    PAN / VAT No: 601928374
                  </div>
                </div>
                <div className="text-right">
                  <div className="invoice-num">
                    Invoice #{selectedInvoiceOrder.orderNumber}
                  </div>
                  <div className="text-xs text-slate-500">
                    Date:{" "}
                    {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-emerald-600 font-medium">
                    Payment: Paid in Full
                  </div>
                </div>
              </div>

              <div className="invoice-divider" />

              {/* Customer */}
              <div className="invoice-customer">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Billed To
                </span>
                <strong className="text-sm block text-slate-900">
                  {selectedInvoiceOrder.deliveryAddress?.fullName || "Aayush Shrestha"}
                </strong>
                <span className="text-xs text-slate-600 block">
                  {selectedInvoiceOrder.deliveryAddress?.streetAddress},{" "}
                  {selectedInvoiceOrder.deliveryAddress?.city}
                </span>
                <span className="text-xs text-slate-600 block">
                  {selectedInvoiceOrder.deliveryAddress?.province},{" "}
                  {selectedInvoiceOrder.deliveryAddress?.district}
                </span>
                <span className="text-xs text-slate-600 block">
                  Phone: {selectedInvoiceOrder.deliveryAddress?.phone || "+977 9841234567"}
                </span>
              </div>

              {/* Line Items */}
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Qty</th>
                    <th>Unit Price (NPR)</th>
                    <th>Total (NPR)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoiceOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{formatNpr(item.price)}</td>
                      <td>{formatNpr(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="invoice-totals-box">
                <div className="invoice-total-row">
                  <span>Subtotal:</span>
                  <span>{formatNpr(selectedInvoiceOrder.subtotal)}</span>
                </div>
                <div className="invoice-total-row">
                  <span>Standard Nepal VAT (13%):</span>
                  <span>{formatNpr(selectedInvoiceOrder.vat)}</span>
                </div>
                <div className="invoice-total-row">
                  <span>Domestic Courier Transit:</span>
                  <span>
                    {selectedInvoiceOrder.shippingFee === 0
                      ? "FREE"
                      : formatNpr(selectedInvoiceOrder.shippingFee)}
                  </span>
                </div>
                {selectedInvoiceOrder.discount > 0 && (
                  <div className="invoice-total-row text-emerald-600">
                    <span>Promotional Discount:</span>
                    <span>-{formatNpr(selectedInvoiceOrder.discount)}</span>
                  </div>
                )}
                <div className="invoice-total-row grand-total">
                  <strong>Grand Total Paid (NPR):</strong>
                  <strong>{formatNpr(selectedInvoiceOrder.totalPaid)}</strong>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <Button
                variant="primary"
                onClick={() => {
                  window.print()
                }}
              >
                <Printer size={16} /> Print Official VAT Tax Invoice
              </Button>
              <Button
                variant="secondary"
                onClick={() => setSelectedInvoiceOrder(null)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

