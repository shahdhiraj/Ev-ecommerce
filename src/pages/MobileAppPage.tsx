import React, { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router"
import {
  Smartphone,
  Tablet,
  Maximize2,
  Minimize2,
  QrCode,
  ArrowLeft,
  Search,
  Camera,
  Mic,
  Bell,
  MapPin,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Zap,
  ShoppingBag,
  Heart,
  Flame,
  Clock,
  ShieldCheck,
  Truck,
  Check,
  Plus,
  Minus,
  X,
  Share2,
  Gift,
  Award,
  CreditCard,
  Settings,
  HelpCircle,
  Headphones,
  SlidersHorizontal,
  Home,
  Grid,
  Tag,
  User,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Globe,
} from "lucide-react"
import { useCommerce } from "../lib/commerceContext"
import { catalogue, type Product } from "../data/catalog"
import { formatNpr } from "../lib/search"

type DeviceType = "iphone" | "samsung" | "canvas"
type TabType = "home" | "categories" | "deals" | "cart" | "profile"

export interface MobileAppPageProps {
  onSwitchToWebStore?: () => void
}

export function MobileAppPage({ onSwitchToWebStore }: MobileAppPageProps = {}) {
  const navigate = useNavigate()
  const commerce = useCommerce()

  const {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    totals,
    user,
    deliveryDestination,
    setDeliveryDestination,
    wishlist,
    toggleWishlist,
    notify,
  } = commerce

  // Simulator controls
  const [device, setDevice] = useState<DeviceType>("iphone")
  const [scale, setScale] = useState<number>(100)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem("ubuy-dark-mode") === "true"
    } catch {
      return false
    }
  })
  const [showQrModal, setShowQrModal] = useState(false)

  // Sync document root class for Swiss Minimalism dark mode
  useEffect(() => {
    try {
      localStorage.setItem("ubuy-dark-mode", String(isDarkMode))
      if (isDarkMode) {
        document.documentElement.classList.add("dark", "is-dark")
      } else {
        document.documentElement.classList.remove("dark", "is-dark")
      }
    } catch {}
  }, [isDarkMode])

  // Mobile App Internal Navigation
  const [activeTab, setActiveTab] = useState<TabType>("home")

  // App Features State
  const [currentTime, setCurrentTime] = useState("9:41")
  const [dynamicIslandExpanded, setDynamicIslandExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All")
  const [voltageFilter, setVoltageFilter] = useState<string>("All")

  // Modals & Bottom Sheets
  const [scannerOpen, setScannerOpen] = useState(false)
  const [voiceOpen, setVoiceOpen] = useState(false)
  const [locationSheetOpen, setLocationSheetOpen] = useState(false)
  const [notifSheetOpen, setNotifSheetOpen] = useState(false)
  const [quickBuyProduct, setQuickBuyProduct] = useState<Product | null>(null)
  const [quickBuyQty, setQuickBuyQty] = useState(1)
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null)
  const [storyMuted, setStoryMuted] = useState(false)

  // Flash deal countdown timer
  const [flashHours, setFlashHours] = useState(8)
  const [flashMins, setFlashMins] = useState(42)
  const [flashSecs, setFlashSecs] = useState(19)

  // Hero banner carousel
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0)

  // Scratch card revealed state
  const [scratchRevealed, setScratchRevealed] = useState(false)

  // Update clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      setCurrentTime(`${hours}:${minutes}`)
    }
    updateClock()
    const timer = setInterval(updateClock, 30000)
    return () => clearInterval(timer)
  }, [])

  // Flash countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setFlashSecs((s) => {
        if (s > 0) return s - 1
        setFlashMins((m) => {
          if (m > 0) return m - 1
          setFlashHours((h) => (h > 0 ? h - 1 : 24))
          return 59
        })
        return 59
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto rotate hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % 3)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  // Story reels data
  const stories = [
    {
      id: "flash-deal",
      title: "Flash 20%",
      tag: "Limited Offer",
      desc: "Save NPR 85,000 on Dual Axial Flux Kits this week only across Nepal.",
      image: "/images/hero/apex-900-dyno.jpg",
      productName: "VoltCraft Apex-900 Dual Axial Flux Motor Kit",
      price: 485000,
    },
    {
      id: "race-motors",
      title: "Axial 720kW",
      tag: "High-Voltage",
      desc: "800V Silicon Carbide direct-drive motorsport package dyno-verified.",
      image: "/images/subsystems/powertrain-motor.jpg",
      productName: "BorgWarner HVH-250 High Torque Drive",
      price: 340000,
    },
    {
      id: "blade-pack",
      title: "Blade BMS",
      tag: "800V Architecture",
      desc: "Cell-to-pack LFP safety chemistry with active thermal glycol cooling.",
      image: "/images/subsystems/battery-pack.jpg",
      productName: "QuantumCell 800V 96kWh Blade Battery Pack",
      price: 920000,
    },
    {
      id: "sic-inverter",
      title: "SiC Inverters",
      tag: "99.2% Efficiency",
      desc: "Dual Silicon Carbide switching stages for instant peak response.",
      image: "/images/subsystems/sic-inverter.jpg",
      productName: "ViperSiC 900V Dual Inverter Module",
      price: 310000,
    },
    {
      id: "fast-wallbox",
      title: "22kW Wallbox",
      tag: "Solar Sync",
      desc: "OCPP 2.0.1 compatible bidirectional charging with Nepal 3-phase support.",
      image: "/images/subsystems/charging-station.jpg",
      productName: "HyperWatt 22kW Bi-Directional V2G Wallbox",
      price: 185000,
    },
    {
      id: "nepal-transit",
      title: "Nepal 7 Prov",
      tag: "Nationwide",
      desc: "Express delivery across Kathmandu, Pokhara, Biratnagar, and all 7 provinces.",
      image: "/images/subsystems/carbon-brakes.jpg",
      productName: "EnduroBremse 420mm Carbon-Ceramic Brakes",
      price: 245000,
    },
  ]

  // Filter products for the app
  const filteredProducts = catalogue.filter((p) => {
    const matchesCategory =
      activeCategoryFilter === "All" ||
      p.subcategory.toLowerCase().includes(activeCategoryFilter.toLowerCase())
    const matchesVoltage =
      voltageFilter === "All" || p.voltage === voltageFilter
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesVoltage && matchesSearch
  })

  // Quick categories
  const quickCategories = [
    { name: "Motors", icon: <Zap size={18} />, sub: "Powertrain" },
    { name: "Batteries", icon: <Sparkles size={18} />, sub: "Battery & BMS" },
    { name: "Inverters", icon: <SlidersHorizontal size={18} />, sub: "Inverters" },
    { name: "Wallboxes", icon: <Truck size={18} />, sub: "Charging" },
    { name: "Brakes", icon: <ShieldCheck size={18} />, sub: "Brakes" },
    { name: "Telemetry", icon: <Award size={18} />, sub: "Cockpit" },
    { name: "Dyno Kits", icon: <Settings size={18} />, sub: "Powertrain" },
    { name: "Deals", icon: <Flame size={18} />, sub: "All" },
  ]

  // Province addresses for quick bottom sheet
  const nepalProvinces = [
    { name: "Bagmati Province", city: "Kathmandu Valley", hub: "Tribhuvan Hub" },
    { name: "Gandaki Province", city: "Pokhara Metro", hub: "Prithvi Hub" },
    { name: "Koshi Province", city: "Biratnagar", hub: "Morang Hub" },
    { name: "Lumbini Province", city: "Butwal / Bhairahawa", hub: "Gautam Buddha Hub" },
    { name: "Madhesh Province", city: "Birgunj / Janakpur", hub: "Parsa Hub" },
    { name: "Karnali Province", city: "Surkhet Valley", hub: "Birendranagar Hub" },
    { name: "Sudurpashchim", city: "Dhangadhi", hub: "Kailali Hub" },
  ]

  const handleQuickAdd = (product: Product) => {
    addToCart(product.name, { sku: product.id, quantity: 1 })
    notify(`Added ${product.name} to Cart`)
  }

  return (
    <div className={`mobile-simulator-layout ${isDarkMode ? "is-dark" : ""}`}>
      {/* ======================================================================
          SIMULATOR TOP CONTROL BAR (VISIBLE ON DESKTOP & TABLET)
          ====================================================================== */}
      <header className="simulator-top-bar">
        <div className="simulator-brand">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-xs uppercase tracking-wider font-semibold">
              Storefront
            </span>
          </Link>
          <div className="h-4 w-[1px] bg-white/20 mx-1" />
          <div className="flex items-center gap-2">
            <span className="text-orange-500 font-extrabold text-sm tracking-tight">
              ABC EV PART
            </span>
            <span className="simulator-badge">Mobile App UI</span>
          </div>
        </div>

        {/* Device Switcher & Scale Controls */}
        <div className="simulator-controls">
          <button
            type="button"
            className={`simulator-btn ${device === "iphone" ? "is-active" : ""}`}
            onClick={() => setDevice("iphone")}
            title="iPhone 16 Pro (Titanium Bezel)"
          >
            <Smartphone size={14} />
            <span className="hidden sm:inline">iPhone 16 Pro</span>
          </button>

          <button
            type="button"
            className={`simulator-btn ${device === "samsung" ? "is-active" : ""}`}
            onClick={() => setDevice("samsung")}
            title="Samsung Galaxy S24 Ultra"
          >
            <Tablet size={14} />
            <span className="hidden sm:inline">Galaxy S24</span>
          </button>

          <button
            type="button"
            className={`simulator-btn ${device === "canvas" ? "is-active" : ""}`}
            onClick={() => setDevice("canvas")}
            title="Full Screen Canvas Mode"
          >
            <Maximize2 size={14} />
            <span className="hidden sm:inline">Canvas</span>
          </button>

          <div className="h-4 w-[1px] bg-white/20 mx-1" />

          {/* Scale Switcher */}
          <button
            type="button"
            className={`simulator-btn ${scale === 85 ? "is-active" : ""}`}
            onClick={() => setScale(85)}
          >
            85%
          </button>
          <button
            type="button"
            className={`simulator-btn ${scale === 100 ? "is-active" : ""}`}
            onClick={() => setScale(100)}
          >
            100%
          </button>

          <div className="h-4 w-[1px] bg-white/20 mx-1" />

          {/* Theme Switcher */}
          <button
            type="button"
            className="simulator-btn"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle App Theme"
          >
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* QR Code preview on phone */}
          <button
            type="button"
            className="simulator-btn"
            onClick={() => setShowQrModal(true)}
            title="Scan QR Code to open on physical smartphone"
          >
            <QrCode size={14} />
            <span className="hidden md:inline">Open on Phone</span>
          </button>
        </div>
      </header>

      {/* ======================================================================
          SIMULATOR WORKSPACE & COMPANION PANEL
          ====================================================================== */}
      <main className="simulator-workspace">
        {/* Companion Feature Panel on Desktop */}
        <aside className="simulator-side-panel">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Live Native App Preview
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Experience our 120Hz-tuned native mobile architecture with interactive Dynamic Island, full-screen stories, 2-column EV catalog grid, and instant checkout.
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
              <span className="text-slate-300">Active Province:</span>
              <span className="font-bold text-orange-400">
                {deliveryDestination.province}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
              <span className="text-slate-300">Live Cart Items:</span>
              <span className="font-bold text-white">{cartCount} items</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
              <span className="text-slate-300">Dynamic Island:</span>
              <span className="text-emerald-400 font-semibold">GPS Transit Tracker</span>
            </div>
          </div>

          {/* Quick tab jump shortcuts */}
          <div className="pt-2 border-t border-white/10">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              App Screens
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("home")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition-all ${
                  activeTab === "home"
                    ? "bg-orange-500 text-white"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                🏠 Home Feed
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("categories")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition-all ${
                  activeTab === "categories"
                    ? "bg-orange-500 text-white"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                ⚡ Categories
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("deals")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition-all ${
                  activeTab === "deals"
                    ? "bg-orange-500 text-white"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                🔥 Flash Deals
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("cart")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition-all ${
                  activeTab === "cart"
                    ? "bg-orange-500 text-white"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                🛒 Mobile Cart ({cartCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`col-span-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition-all ${
                  activeTab === "profile"
                    ? "bg-orange-500 text-white"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                👤 Customer Account & Orders
              </button>
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Version: v2.4.0 Mobile</span>
            <span className="text-emerald-400 font-semibold">Online · 200 OK</span>
          </div>
        </aside>

        {/* ====================================================================
            THE SMARTPHONE DEVICE CHASSIS & SCREEN
            ==================================================================== */}
        <div
          className={`device-chassis device-chassis--${device}`}
          style={{ transform: scale !== 100 ? `scale(${scale / 100})` : undefined }}
        >
          <div className={`device-screen ${isDarkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
            {/* 1. OS Status Bar with Dynamic Island */}
            <div className={`app-os-bar ${isDarkMode ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}>
              <span className="app-os-time">{currentTime}</span>

              {/* Interactive Dynamic Island (iPhone style) */}
              {device === "iphone" && (
                <div
                  className={`dynamic-island ${dynamicIslandExpanded ? "is-expanded" : ""}`}
                  onClick={() => setDynamicIslandExpanded(!dynamicIslandExpanded)}
                  title="Click to toggle Dynamic Island"
                >
                  {dynamicIslandExpanded ? (
                    <div className="flex items-center justify-between w-full text-xs text-white px-1">
                      <div className="flex items-center gap-2">
                        <Truck size={14} className="text-orange-400 animate-bounce" />
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">
                            UB-NP-862372 in Transit
                          </div>
                          <div className="text-[11px] font-extrabold text-white">
                            Kathmandu Hub · 24m
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400">
                        GPS LIVE
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="dynamic-island-sensor" />
                      <div className="flex items-center gap-1.5 text-[10px] text-orange-400 font-bold pr-1">
                        <Zap size={11} className="fill-orange-400" />
                        <span>EV 800V</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Status Icons */}
              <div className="app-os-icons">
                <span className="text-[10px] font-bold tracking-tighter">5G</span>
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
                </svg>
                <div className="flex items-center gap-0.5 border border-current rounded-sm px-1 py-0.5 text-[9px] font-bold leading-none">
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* 2. Top App Navigation Header */}
            <header className={`mobile-app-header ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-100"}`}>
              <div className="mobile-app-topline">
                <button
                  type="button"
                  className={`mobile-location-btn ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-200" : ""}`}
                  onClick={() => setLocationSheetOpen(true)}
                >
                  <MapPin size={13} className="text-orange-500 shrink-0" />
                  <span className="truncate max-w-[170px]">
                    Deliver to: <strong>{deliveryDestination.district || "Kathmandu Valley"}</strong>
                  </span>
                  <ChevronDown size={11} className="text-slate-400" />
                </button>

                <div className="mobile-app-header-actions">
                  <button
                    type="button"
                    className={`mobile-header-icon-btn ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-300" : ""}`}
                    onClick={() => {
                      if (onSwitchToWebStore) {
                        onSwitchToWebStore()
                      } else {
                        sessionStorage.setItem("prefer-web-store", "true")
                        navigate("/")
                      }
                      notify("Switched to Full Web Storefront")
                    }}
                    title="Switch to Web Storefront"
                    aria-label="Switch to Web Storefront"
                  >
                    <Globe size={16} className="text-orange-500" />
                  </button>

                  <button
                    type="button"
                    className={`mobile-header-icon-btn ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-300" : ""}`}
                    onClick={() => setNotifSheetOpen(true)}
                    title="Notifications"
                  >
                    <Bell size={16} />
                    <span className="mobile-badge-count">3</span>
                  </button>

                  <button
                    type="button"
                    className={`mobile-header-icon-btn ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-300" : ""}`}
                    onClick={() => notify("Connecting to 24/7 Kathmandu EV Engineer Hotline...")}
                    title="Live Support"
                  >
                    <Headphones size={16} className="text-orange-500" />
                  </button>
                </div>
              </div>

              {/* Search Bar with Camera Scanner & Mic */}
              <div className={`mobile-app-search-bar ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"}`}>
                <Search size={15} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search 800V motors, LFP cells, SiC inverters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={isDarkMode ? "text-white placeholder:text-slate-500" : ""}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mobile-search-tool-btn text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  type="button"
                  className="mobile-search-tool-btn"
                  onClick={() => setScannerOpen(true)}
                  title="Scan EV Part QR / Barcode"
                >
                  <Camera size={15} />
                </button>
                <button
                  type="button"
                  className="mobile-search-tool-btn"
                  onClick={() => setVoiceOpen(true)}
                  title="Voice Search"
                >
                  <Mic size={15} />
                </button>
              </div>
            </header>

            {/* ================================================================
                3. SCROLLABLE TAB CONTENT VIEWS
                ================================================================ */}
            <div className="mobile-app-scroll-content">
              {/* TAB 1: HOME FEED */}
              {activeTab === "home" && (
                <>
                  {/* Story Highlights Bar */}
                  <div className={`mobile-stories-strip ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-100"}`}>
                    {stories.map((story, idx) => (
                      <div
                        key={story.id}
                        className="mobile-story-circle"
                        onClick={() => setActiveStoryIndex(idx)}
                      >
                        <div className="mobile-story-ring">
                          <div className="mobile-story-avatar">
                            <img src={story.image} alt={story.title} />
                          </div>
                        </div>
                        <span className={`mobile-story-label ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                          {story.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Promotional Hero Banner Carousel */}
                  <div className="mobile-hero-banner">
                    <img
                      src={
                        currentHeroSlide === 0
                          ? "/images/hero/apex-900-dyno.jpg"
                          : currentHeroSlide === 1
                          ? "/images/subsystems/powertrain-motor.jpg"
                          : "/images/subsystems/battery-pack.jpg"
                      }
                      alt="Promotional Banner"
                    />
                    <div className="mobile-hero-banner-content">
                      <span className="mobile-hero-tag">
                        <Zap size={11} className="fill-white" />
                        {currentHeroSlide === 0
                          ? "800V ARCHITECTURE"
                          : currentHeroSlide === 1
                          ? "NEPAL NATIONWIDE"
                          : "CELL-TO-PACK LFP"}
                      </span>

                      <h2 className="mobile-hero-title">
                        {currentHeroSlide === 0
                          ? "Apex-900 Dual Axial Flux Motor Kits"
                          : currentHeroSlide === 1
                          ? "Genuine EV Parts Across All 7 Provinces"
                          : "QuantumCell 96kWh 800V Battery Packs"}
                      </h2>

                      <div className="mobile-hero-footer">
                        <span className="text-xs font-bold text-orange-300">
                          {currentHeroSlide === 0
                            ? "From NPR 485,000"
                            : currentHeroSlide === 1
                            ? "13% VAT Included"
                            : "Dyno Certified"}
                        </span>
                        <button
                          type="button"
                          className="mobile-hero-btn"
                          onClick={() => {
                            addToCart("VoltCraft Apex-900 Dual Axial Flux Motor Kit")
                            notify("Added Apex-900 to Cart")
                          }}
                        >
                          <span>Explore</span>
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Category Action Circles */}
                  <div className={`mobile-quick-cats ${isDarkMode ? "bg-slate-900/60" : "bg-white"}`}>
                    {quickCategories.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        className="mobile-quick-cat-btn"
                        onClick={() => {
                          setActiveCategoryFilter(c.sub)
                          setActiveTab("categories")
                        }}
                      >
                        <div className="mobile-quick-cat-icon">{c.icon}</div>
                        <span className={`mobile-quick-cat-name ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                          {c.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Flash Deal 24h Countdown Widget */}
                  <div className="mobile-flash-deal-box">
                    <div className="mobile-flash-top">
                      <div className="mobile-flash-title">
                        <Flame size={16} className="text-orange-600 fill-orange-600 animate-pulse" />
                        <span>FLASH SALE · 24H</span>
                      </div>
                      <div className="mobile-flash-timer">
                        <span>{flashHours.toString().padStart(2, "0")}</span>
                        <strong className="text-orange-950">:</strong>
                        <span>{flashMins.toString().padStart(2, "0")}</span>
                        <strong className="text-orange-950">:</strong>
                        <span>{flashSecs.toString().padStart(2, "0")}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs mb-1.5 text-orange-950 font-bold">
                      <span>VoltCraft Apex-900 Motorsport Kit</span>
                      <span className="text-orange-600">Save 18%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-orange-200/80 rounded-full h-2 mb-2 overflow-hidden">
                      <div className="bg-orange-600 h-full rounded-full w-[82%]" />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-orange-900 font-semibold">
                      <span>🔥 82% Claimed (Only 3 left in Nepal Hub)</span>
                      <span className="font-extrabold text-orange-600">NPR 485,000</span>
                    </div>
                  </div>

                  {/* Nepal Trust Strip (2 Row Divided Grid) */}
                  <div className="px-3.5 mb-3">
                    <div className="clean-trust-grid">
                      <div className={`clean-trust-card ${isDarkMode ? "bg-slate-900 border-slate-800" : ""}`}>
                        <Truck size={18} className="text-orange-500" />
                        <div>
                          <strong className={isDarkMode ? "text-white" : ""}>Nepal Delivery Only</strong>
                          <small>All 7 provinces nationwide</small>
                        </div>
                      </div>
                      <div className={`clean-trust-card ${isDarkMode ? "bg-slate-900 border-slate-800" : ""}`}>
                        <ShieldCheck size={18} className="text-orange-500" />
                        <div>
                          <strong className={isDarkMode ? "text-white" : ""}>100% Authentic</strong>
                          <small>Genuine verified products</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Featured Products 2-Column Mobile App Grid */}
                  <section className="mobile-products-section">
                    <div className="mobile-sec-header">
                      <h3 className={`mobile-sec-title ${isDarkMode ? "text-white" : ""}`}>
                        Featured EV Components
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab("categories")}
                        className="mobile-sec-link"
                      >
                        View All ({filteredProducts.length}) →
                      </button>
                    </div>

                    <div className="mobile-app-grid">
                      {filteredProducts.slice(0, 8).map((product) => {
                        const isSaved = wishlist.has(product.id)
                        return (
                          <article
                            key={product.id}
                            className={`mobile-app-card ${isDarkMode ? "bg-slate-900 border-slate-800" : ""} cursor-pointer`}
                            onClick={() => {
                              setQuickBuyProduct(product)
                              setQuickBuyQty(1)
                            }}
                          >
                            <div className="mobile-app-card-img-wrap">
                              <button
                                type="button"
                                className="mobile-app-card-wish-btn"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleWishlist(product.id)
                                }}
                              >
                                <Heart
                                  size={15}
                                  className={isSaved ? "text-red-500 fill-red-500" : "text-slate-600"}
                                />
                              </button>
                              <img src={product.image} alt={product.name} />
                            </div>

                            <div className="mobile-app-card-body">
                              <span className="mobile-app-card-brand">{product.brand}</span>
                              <h4 className={`mobile-app-card-title ${isDarkMode ? "text-white" : ""}`} title={product.name}>
                                {product.name}
                              </h4>

                              <div className="mobile-app-card-price-row">
                                <span className={`mobile-app-card-price ${isDarkMode ? "text-orange-400" : ""}`}>
                                  {formatNpr(product.price)}
                                </span>
                                <button
                                  type="button"
                                  className="mobile-app-card-add-btn"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleQuickAdd(product)
                                  }}
                                  title="Add to cart"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  </section>
                </>
              )}

              {/* TAB 2: EXPLORE / CATEGORIES */}
              {activeTab === "categories" && (
                <div className="p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-base font-extrabold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      EV Parts Catalog
                    </h3>
                    <div className="flex gap-1.5">
                      {["All", "800V", "400V"].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setVoltageFilter(v)}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                            voltageFilter === v
                              ? "bg-orange-500 text-white"
                              : isDarkMode
                              ? "bg-slate-900 text-slate-400"
                              : "bg-white text-slate-600 border border-slate-200"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Horizontal Category Switcher Chips */}
                  <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
                    {["All", "Powertrain", "Battery", "Inverters", "Charging", "Brakes"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          activeCategoryFilter === cat
                            ? "bg-orange-500 text-white shadow-xs"
                            : isDarkMode
                            ? "bg-slate-900 text-slate-300 border border-slate-800"
                            : "bg-white text-slate-700 border border-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Category Results Grid */}
                  <div className="mobile-app-grid">
                    {filteredProducts.map((product) => (
                      <article
                        key={product.id}
                        className={`mobile-app-card ${isDarkMode ? "bg-slate-900 border-slate-800" : ""} cursor-pointer`}
                        onClick={() => {
                          setQuickBuyProduct(product)
                          setQuickBuyQty(1)
                        }}
                      >
                        <div className="mobile-app-card-img-wrap">
                          <img src={product.image} alt={product.name} />
                          <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {product.voltage}
                          </span>
                        </div>
                        <div className="mobile-app-card-body">
                          <span className="mobile-app-card-brand">{product.brand}</span>
                          <h4 className={`mobile-app-card-title ${isDarkMode ? "text-white" : ""}`}>
                            {product.name}
                          </h4>
                          <div className="mobile-app-card-price-row">
                            <span className="mobile-app-card-price">{formatNpr(product.price)}</span>
                            <button
                              type="button"
                              className="mobile-app-card-add-btn"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleQuickAdd(product)
                              }}
                              title="Add to cart"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: DEALS & SCRATCH CARD MINI-GAME */}
              {activeTab === "deals" && (
                <div className="p-3.5 space-y-3.5">
                  <div className="scratch-card-box">
                    <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">
                      <Gift size={12} /> App Exclusive Mini-Game
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Scratch to Reveal Discount Voucher
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Tap below to unlock up to NPR 5,000 instant discount on your order.
                    </p>

                    <div
                      className="scratch-card-canvas-wrap"
                      onClick={() => {
                        setScratchRevealed(true)
                        notify("Promo Code 'EVNEPAL2026' Unlocked!")
                      }}
                    >
                      {scratchRevealed ? (
                        <div className="space-y-1">
                          <div className="text-xs text-orange-200 uppercase font-bold">
                            Code: EVNEPAL2026
                          </div>
                          <div className="text-lg font-black text-white">
                            NPR 5,000 OFF
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles size={16} className="animate-spin" />
                          <span>TAP TO SCRATCH</span>
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Valid across all 7 provinces for next 48 hours.
                    </div>
                  </div>

                  {/* Active Vouchers List */}
                  <div className="space-y-2">
                    <h4 className={`text-xs font-extrabold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Available Coupons
                    </h4>

                    {[
                      { code: "KTMEXPRESS", title: "Free Express Shipping in Bagmati", disc: "NPR 1,500 Saved" },
                      { code: "SIC900V", title: "10% Off All Silicon Carbide Inverters", disc: "Up to NPR 35,000" },
                      { code: "NEPALVAT", title: "Zero Customs Clearance Fee", disc: "100% Waived" },
                    ].map((c) => (
                      <div
                        key={c.code}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-orange-500">{c.code}</div>
                          <div className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                            {c.title}
                          </div>
                          <div className="text-[11px] text-emerald-600 font-semibold">{c.disc}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => notify(`Copied code: ${c.code}`)}
                          className="px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs"
                        >
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SHOPPING CART */}
              {activeTab === "cart" && (
                <div className="p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-base font-extrabold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      Mobile Cart ({cartCount})
                    </h3>
                    <span className="text-xs text-slate-500">
                      Ship to: {deliveryDestination.province}
                    </span>
                  </div>

                  {cartItems.length === 0 ? (
                    <div className="py-12 text-center space-y-3">
                      <ShoppingBag size={42} className="mx-auto text-slate-300" />
                      <div className="text-sm font-bold text-slate-700">Your cart is empty</div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("home")}
                        className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs"
                      >
                        Browse EV Catalog
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3 rounded-xl border flex items-center gap-3 ${
                            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                          }`}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-xs font-bold truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                              {item.name}
                            </h4>
                            <div className="text-xs font-extrabold text-orange-500 mt-0.5">
                              {formatNpr(item.price)}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-xs font-bold">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-red-500 p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}

                      {/* Summary Breakdown */}
                      <div className={`p-3.5 rounded-xl border space-y-2 text-xs ${
                        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                      }`}>
                        <div className="flex justify-between text-slate-500">
                          <span>Subtotal</span>
                          <span className="font-bold">{formatNpr(totals.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>13% Nepal VAT</span>
                          <span className="font-bold text-emerald-600">Included</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Nationwide Shipping</span>
                          <span className="font-bold">
                            {totals.shippingFee === 0 ? "FREE" : formatNpr(totals.shippingFee)}
                          </span>
                        </div>
                        <div className="pt-2 border-t flex justify-between text-sm font-extrabold">
                          <span>Pay Now Total</span>
                          <span className="text-orange-500">{formatNpr(totals.payNowTotal)}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            notify("Redirecting to Nepal Secure Checkout...")
                            navigate("/checkout")
                          }}
                          className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 mt-2 shadow-xs cursor-pointer"
                        >
                          <span>Proceed to Checkout</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: PROFILE & REWARDS */}
              {activeTab === "profile" && (
                <div className="p-3.5 space-y-3">
                  <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
                    isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <div className="w-13 h-13 rounded-full bg-orange-500 text-white font-extrabold text-base flex items-center justify-center shadow-xs">
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className={`text-sm font-extrabold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                        {user.name}
                      </h4>
                      <p className="text-xs text-slate-400">{user.email}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                          Verified Buyer
                        </span>
                        <span className="text-[11px] font-bold text-orange-500">
                          1,450 EV Pts
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Active Orders Quick Card */}
                  <div className={`p-3.5 rounded-xl border space-y-2 ${
                    isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Active Orders (1)</span>
                      <Link to="/account/orders" className="text-orange-500">View All →</Link>
                    </div>
                    <div className="p-2.5 rounded-lg bg-orange-50/60 border border-orange-100 text-xs">
                      <div className="flex justify-between font-bold text-orange-950">
                        <span>UB-NP-862372</span>
                        <span className="text-orange-600">In Transit</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1">
                        Dispatched via Sundar Express with GPS tracking.
                      </div>
                    </div>
                  </div>

                  {/* App Settings List */}
                  <div className={`rounded-xl border divide-y overflow-hidden text-xs ${
                    isDarkMode ? "bg-slate-900 border-slate-800 divide-slate-800 text-slate-200" : "bg-white border-slate-200 divide-slate-100 text-slate-700"
                  }`}>
                    <button
                      type="button"
                      onClick={() => setLocationSheetOpen(true)}
                      className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50/50"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin size={15} className="text-orange-500" />
                        <span>Saved Addresses ({deliveryDestination.province})</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => notify("Payment methods: eSewa, Khalti, ConnectIPS active")}
                      className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50/50"
                    >
                      <div className="flex items-center gap-2.5">
                        <CreditCard size={15} className="text-orange-500" />
                        <span>Nepal Payment Methods (eSewa / Khalti)</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50/50"
                    >
                      <div className="flex items-center gap-2.5">
                        {isDarkMode ? <Sun size={15} className="text-orange-500" /> : <Moon size={15} className="text-orange-500" />}
                        <span>App Theme ({isDarkMode ? "Dark" : "Light"})</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">Toggle</span>
                    </button>

                    <Link
                      to="/owner"
                      className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50/50 block text-orange-600 font-bold"
                    >
                      <div className="flex items-center gap-2.5">
                        <Settings size={15} />
                        <span>Switch to Owner / Admin Portal</span>
                      </div>
                      <ChevronRight size={14} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        if (onSwitchToWebStore) {
                          onSwitchToWebStore()
                        } else {
                          sessionStorage.setItem("prefer-web-store", "true")
                          navigate("/")
                        }
                        notify("Switched to Full Web Storefront")
                      }}
                      className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50/50 text-slate-800 dark:text-slate-200 font-semibold"
                    >
                      <div className="flex items-center gap-2.5">
                        <Globe size={15} className="text-orange-500" />
                        <span>Switch to Full Web Storefront</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ================================================================
                4. NATIVE APP BOTTOM NAVIGATION BAR
                ================================================================ */}
            <nav className={`mobile-app-bottom-bar ${isDarkMode ? "bg-slate-950/95 border-slate-800" : ""}`}>
              <button
                type="button"
                className={`mobile-app-tab-item ${activeTab === "home" ? "is-active" : ""}`}
                onClick={() => setActiveTab("home")}
              >
                <div className="mobile-app-tab-icon-wrap">
                  <Home size={19} />
                </div>
                <span>Home</span>
              </button>

              <button
                type="button"
                className={`mobile-app-tab-item ${activeTab === "categories" ? "is-active" : ""}`}
                onClick={() => setActiveTab("categories")}
              >
                <div className="mobile-app-tab-icon-wrap">
                  <Grid size={19} />
                </div>
                <span>Catalog</span>
              </button>

              <button
                type="button"
                className={`mobile-app-tab-item ${activeTab === "deals" ? "is-active" : ""}`}
                onClick={() => setActiveTab("deals")}
              >
                <div className="mobile-app-tab-icon-wrap">
                  <Tag size={19} />
                </div>
                <span>Deals</span>
              </button>

              <button
                type="button"
                className={`mobile-app-tab-item ${activeTab === "cart" ? "is-active" : ""}`}
                onClick={() => setActiveTab("cart")}
              >
                <div className="mobile-app-tab-icon-wrap">
                  <ShoppingBag size={19} />
                  {cartCount > 0 && <span className="mobile-app-tab-badge">{cartCount}</span>}
                </div>
                <span>Cart</span>
              </button>

              <button
                type="button"
                className={`mobile-app-tab-item ${activeTab === "profile" ? "is-active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <div className="mobile-app-tab-icon-wrap">
                  <User size={19} />
                </div>
                <span>Account</span>
              </button>

              {/* iOS Home Indicator Gesture Bar */}
              <div className="mobile-app-home-indicator" />
            </nav>

            {/* ================================================================
                5. MODALS & BOTTOM SHEETS
                ================================================================ */}
            {/* Quick Buy & Component Specs Bottom Sheet */}
            {quickBuyProduct && (
              <>
                <div
                  className="mobile-bottom-sheet-backdrop"
                  onClick={() => setQuickBuyProduct(null)}
                />
                <div className={`mobile-bottom-sheet ${isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}>
                  <div className="mobile-sheet-drag-handle" />
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex gap-3 min-w-0">
                      <img
                        src={quickBuyProduct.image}
                        alt={quickBuyProduct.name}
                        className="w-18 h-18 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                          {quickBuyProduct.brand} · {quickBuyProduct.voltage}
                        </span>
                        <h4 className="text-xs font-bold leading-tight mt-0.5 line-clamp-2">
                          {quickBuyProduct.name}
                        </h4>
                        <div className="text-sm font-extrabold text-orange-600 mt-1">
                          {formatNpr(quickBuyProduct.price)}
                        </div>
                        <span className="text-[10px] text-slate-400">13% Nepal VAT Included</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuickBuyProduct(null)}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-3">
                    {quickBuyProduct.description}
                  </p>

                  {/* Quantity selector & Stock */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 dark:text-slate-200">Quantity</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">(In Stock, Tribhuvan Hub)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuickBuyQty(Math.max(1, quickBuyQty - 1))}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold text-slate-700 dark:text-white"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-6 text-center font-bold text-xs">{quickBuyQty}</span>
                      <button
                        type="button"
                        onClick={() => setQuickBuyQty(quickBuyQty + 1)}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold text-slate-700 dark:text-white"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Actions: Add to Cart & Instant Checkout */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(quickBuyProduct.name, { sku: quickBuyProduct.id, quantity: quickBuyQty })
                        notify(`Added ${quickBuyQty}x ${quickBuyProduct.name} to Cart`)
                        setQuickBuyProduct(null)
                      }}
                      className="py-2.5 px-3 rounded-xl border border-orange-500 text-orange-600 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-orange-50 dark:hover:bg-orange-950/40"
                    >
                      <ShoppingBag size={15} />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(quickBuyProduct.name, { sku: quickBuyProduct.id, quantity: quickBuyQty })
                        setQuickBuyProduct(null)
                        navigate("/checkout")
                      }}
                      className="py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Zap size={15} className="fill-white" />
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Delivery Location Picker Sheet */}
            {locationSheetOpen && (
              <>
                <div
                  className="mobile-bottom-sheet-backdrop"
                  onClick={() => setLocationSheetOpen(false)}
                />
                <div className={`mobile-bottom-sheet ${isDarkMode ? "bg-slate-900 text-white" : ""}`}>
                  <div className="mobile-sheet-drag-handle" />
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-extrabold">Choose Delivery Destination</h4>
                    <button
                      type="button"
                      onClick={() => setLocationSheetOpen(false)}
                      className="p-1 text-slate-400"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    Fast Nepal courier dispatch across all 7 provinces with 13% VAT clearance included.
                  </p>

                  <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                    {nepalProvinces.map((p) => {
                      const isSelected = deliveryDestination.province === p.name
                      return (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => {
                            setDeliveryDestination({
                              province: p.name as any,
                              district: p.city,
                            })
                            setLocationSheetOpen(false)
                            notify(`Delivery set to ${p.city}, ${p.name}`)
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                            isSelected
                              ? "border-orange-500 bg-orange-50/50 text-orange-950 font-bold"
                              : isDarkMode
                              ? "border-slate-800 bg-slate-950 text-slate-300"
                              : "border-slate-200 bg-white text-slate-700"
                          }`}
                        >
                          <div>
                            <div className="font-bold">{p.name}</div>
                            <div className="text-[11px] text-slate-500">{p.city} · {p.hub}</div>
                          </div>
                          {isSelected && <Check size={16} className="text-orange-500" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Camera Barcode Scanner Viewfinder Sheet */}
            {scannerOpen && (
              <>
                <div className="mobile-bottom-sheet-backdrop" onClick={() => setScannerOpen(false)} />
                <div className={`mobile-bottom-sheet ${isDarkMode ? "bg-slate-900 text-white" : ""}`}>
                  <div className="mobile-sheet-drag-handle" />
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-extrabold">EV Part Scanner</h4>
                    <button type="button" onClick={() => setScannerOpen(false)} className="p-1 text-slate-400">
                      <X size={18} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    Point camera at component barcode or dyno certificate QR code.
                  </p>

                  {/* Simulated Viewfinder */}
                  <div className="relative h-44 rounded-2xl bg-black overflow-hidden flex items-center justify-center mb-3">
                    <div className="w-32 h-32 border-2 border-orange-500 rounded-xl relative flex items-center justify-center">
                      <div className="w-full h-0.5 bg-orange-400 animate-pulse absolute" />
                      <span className="text-[10px] text-orange-300 font-bold">Scanning...</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setScannerOpen(false)
                      addToCart("VoltCraft Apex-900 Dual Axial Flux Motor Kit")
                      notify("Barcode Detected: VoltCraft Apex-900 Kit added to Cart!")
                    }}
                    className="w-full py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs"
                  >
                    Simulate Successful Scan (Apex-900)
                  </button>
                </div>
              </>
            )}

            {/* Voice Search Sheet */}
            {voiceOpen && (
              <>
                <div className="mobile-bottom-sheet-backdrop" onClick={() => setVoiceOpen(false)} />
                <div className={`mobile-bottom-sheet ${isDarkMode ? "bg-slate-900 text-white" : ""}`}>
                  <div className="mobile-sheet-drag-handle" />
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-extrabold">Voice Assistant</h4>
                    <button type="button" onClick={() => setVoiceOpen(false)} className="p-1 text-slate-400">
                      <X size={18} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 text-center">
                    Speak component name e.g. "800V silicon carbide inverter"...
                  </p>

                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center animate-pulse">
                      <Mic size={24} className="text-orange-500" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("800V Inverter")
                        setVoiceOpen(false)
                      }}
                      className="flex-1 py-2 rounded-xl bg-orange-50 text-orange-600 font-bold text-xs"
                    >
                      "800V Inverter"
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("Axial Flux")
                        setVoiceOpen(false)
                      }}
                      className="flex-1 py-2 rounded-xl bg-orange-50 text-orange-600 font-bold text-xs"
                    >
                      "Axial Flux Motor"
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Notification Drawer Sheet */}
            {notifSheetOpen && (
              <>
                <div className="mobile-bottom-sheet-backdrop" onClick={() => setNotifSheetOpen(false)} />
                <div className={`mobile-bottom-sheet ${isDarkMode ? "bg-slate-900 text-white" : ""}`}>
                  <div className="mobile-sheet-drag-handle" />
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-extrabold">Notifications (3)</h4>
                    <button type="button" onClick={() => setNotifSheetOpen(false)} className="p-1 text-slate-400">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {[
                      { title: "Kathmandu Hub Transit", desc: "Order UB-NP-862372 dispatched via Sundar Express with GPS.", time: "12m ago" },
                      { title: "Customs 13% VAT Cleared", desc: "420mm Carbon-Ceramic Brakes verified at Airport Hub.", time: "1h ago" },
                      { title: "Flash Sale Alert", desc: "20% off high-voltage motors active today across Nepal.", time: "3h ago" },
                    ].map((n, i) => (
                      <div key={i} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 text-xs">
                        <div className="font-bold text-slate-900">{n.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{n.desc}</div>
                        <div className="text-[10px] text-orange-500 font-bold mt-1">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Fullscreen Story Reel Viewer */}
            {activeStoryIndex !== null && (
              <div className="mobile-story-player">
                {/* Story Top Progress Bars */}
                <div className="mobile-story-progress-bar">
                  {stories.map((_, idx) => (
                    <div key={idx} className="mobile-story-seg">
                      {idx === activeStoryIndex && <div className="mobile-story-seg-fill" />}
                    </div>
                  ))}
                </div>

                {/* Header with Close and Sound */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-white">
                      <img src={stories[activeStoryIndex].image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold">{stories[activeStoryIndex].title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStoryMuted(!storyMuted)}
                      className="p-1 rounded-full bg-black/40 text-white"
                    >
                      {storyMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStoryIndex(null)}
                      className="p-1 rounded-full bg-black/40 text-white"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>

                {/* Story Content Visual */}
                <div className="flex-1 flex flex-col justify-end pb-8">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-orange-500 text-white text-[10px] font-extrabold uppercase tracking-wider mb-2 w-fit">
                    {stories[activeStoryIndex].tag}
                  </span>
                  <h3 className="text-lg font-black leading-tight text-white mb-2">
                    {stories[activeStoryIndex].productName}
                  </h3>
                  <p className="text-xs text-slate-200 mb-4 max-w-[90%]">
                    {stories[activeStoryIndex].desc}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      addToCart(stories[activeStoryIndex].productName)
                      setActiveStoryIndex(null)
                      notify(`Added ${stories[activeStoryIndex].productName} to Cart!`)
                    }}
                    className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg"
                  >
                    <ShoppingBag size={15} />
                    <span>Swipe Up · Add to Cart ({formatNpr(stories[activeStoryIndex].price)})</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ======================================================================
          QR CODE PREVIEW MODAL
          ====================================================================== */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold">Scan with Your Smartphone</h4>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Open your phone camera to test this mobile app UI live on your actual device.
            </p>

            <div className="bg-white p-4 rounded-xl inline-block mx-auto">
              {/* Clean vector QR code representation */}
              <svg className="w-44 h-44" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="#ffffff" />
                <path
                  d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M20,20 h10 v10 h-10 z"
                  fill="#0f172a"
                />
                <path
                  d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M70,20 h10 v10 h-10 z"
                  fill="#0f172a"
                />
                <path
                  d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M20,70 h10 v10 h-10 z"
                  fill="#0f172a"
                />
                <rect x="45" y="15" width="5" height="15" fill="#f58220" />
                <rect x="50" y="35" width="15" height="5" fill="#f58220" />
                <rect x="45" y="50" width="10" height="10" fill="#f58220" />
                <rect x="65" y="65" width="15" height="15" fill="#0f172a" />
                <rect x="70" y="50" width="5" height="10" fill="#0f172a" />
                <rect x="85" y="55" width="5" height="15" fill="#0f172a" />
                <rect x="55" y="80" width="20" height="5" fill="#0f172a" />
                <rect x="45" y="70" width="5" height="15" fill="#0f172a" />
              </svg>
            </div>

            <div className="text-xs font-mono bg-slate-950 p-2 rounded-lg text-orange-400 break-all">
              https://ev-ecommerce.vercel.app/app
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

