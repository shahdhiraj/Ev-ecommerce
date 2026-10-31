import { useEffect, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Boxes,
  Check,
  ChevronDown,
  Clock,
  Clock3,
  CreditCard,
  FileText,
  Globe,
  Heart,
  HelpCircle,
  KeyRound,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Package,
  PanelLeft,
  Plus,
  Rss,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  Sun,
  Trash2,
  TrendingUp,
  Truck,
  UserRound,
  Wrench,
  X,
  Zap,
} from "lucide-react"
import { Outlet, useLocation, useNavigate } from "react-router"
import { catalogue } from "../data/catalog"
import { useCommerce } from "../lib/commerceContext"
import { formatNpr, searchCatalogue, trackCommerceEvent } from "../lib/search"
import { AppLink, Button, Heading, IconButton, Input } from "./ui"

export type StorefrontContext = ReturnType<typeof useCommerce>
export type { WishlistEntry } from "../lib/commerceContext"

const categories = [
  "All Categories",
  "Powertrain & Motors",
  "Battery & BMS",
  "Inverters & SiC",
  "Charging & Wallboxes",
  "Brakes & Suspension",
  "Aero & Carbon",
  "Cockpit Telemetry",
]

const megaMenu: Record<string, string[][]> = {
  "Powertrain & Motors": [
    [
      "Motor Assemblies",
      "Axial Flux Dual Motors",
      "Radial Traction Motors",
      "Direct-Drive Reductions",
    ],
    [
      "Vehicle Platforms",
      "Tesla Model 3/Y Kits",
      "Porsche Taycan 800V",
      "Hyundai E-GMP Arch",
    ],
    [
      "High-Voltage Spec",
      "800V Architecture",
      "900V Track-Spec",
      "1,150 Nm Max Torque",
    ],
  ],
  "Battery & BMS": [
    [
      "Cell Modules",
      "Prismatic LFP Blade",
      "High-Density NMC Packs",
      "Solid-State Prototypes",
    ],
    [
      "Smart Electronics",
      "Active Balancing BMS",
      "Thermal Runaway Sensors",
      "CAN-FD Data Loggers",
    ],
    [
      "Standards",
      "UN 38.3 Hazmat Certified",
      "Zero Propagation Safe",
      "Nationwide Courier",
    ],
  ],
  "Inverters & SiC": [
    [
      "Power Silicon",
      "Silicon Carbide (SiC) Dual Inverters",
      "750A Phase Inverters",
      "DC-DC Converters",
    ],
    [
      "Thermal Control",
      "Direct Dielectric Chillers",
      "Low-Inductance Busbars",
      "MIL-SPEC Seals",
    ],
    [
      "Control Firmware",
      "Torque Vectoring ECU",
      "Launch Control Maps",
      "Dyno Profiles",
    ],
  ],
  "Charging & Wallboxes": [
    [
      "Charging Stations",
      "22kW AC Bi-Directional V2G",
      "Solar Sync Wallbox",
      "OCPP 2.0.1 Cloud",
    ],
    [
      "Fast Adapters",
      "CCS2 to NACS 250kW Ultra",
      "Mennekes Type 2 Cable",
      "Active Liquid-Cooled Guns",
    ],
  ],
  "Brakes & Suspension": [
    [
      "Ceramic Brakes",
      "420mm Carbon-Ceramic Rotors",
      "6-Piston Monobloc Calipers",
      "Titanium Backed Pads",
    ],
    [
      "Active Dampers",
      "Magnetic Adaptive Coilovers",
      "EV Spring Rates",
      "Chamber Caster Plates",
    ],
  ],
}

const searchSuggestions = [
  "800V Silicon Carbide Inverter",
  "Axial Flux Dual Motor Kit",
  "LFP Blade Battery Module",
  "CCS2 to NACS 250kW Adapter",
  "Carbon-Ceramic Regenerative Brakes",
]

export function StorefrontShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const commerce = useCommerce()

  const {
    cartItems,
    cartCount,
    removeFromCart,
    totals,
    user,
    isOwner,
    switchRole,
    products,
    orders,
    storeSettings,
    wishlistEntries,
    viewProduct,
    toast,
    notify,
    logout,
    sidebarCollapsed,
    toggleSidebar,
  } = commerce

  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("volt-recent-searches") || "[]")
    } catch {
      return []
    }
  })

  // Dashboard specific state
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem("ubuy-dark-mode") === "true"
    } catch {
      return false
    }
  })
  const [dashSearch, setDashSearch] = useState("")
  const [unreadNotifs, setUnreadNotifs] = useState(2)
  const [vatTransparency, setVatTransparency] = useState(true)
  const [soundAlerts, setSoundAlerts] = useState(true)
  const [selectedHub, setSelectedHub] = useState("Kathmandu Central Hub (Bagmati)")

  // Keyboard shortcut listeners (⌘K for search, ⌘B for sidebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        const input = document.getElementById("dash-search-input")
        if (input) input.focus()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  const [scrolled, setScrolled] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [suggestionIndex, setSuggestionIndex] = useState(-1)
  const [activeMega, setActiveMega] = useState("")

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q")
    if (location.pathname === "/search" && query !== null) setSearchValue(query)
  }, [location.pathname, location.search])

  const runSearch = (value: string) => {
    const query = value.trim()
    if (!query) return
    setSearchValue(query)
    setSearchFocused(false)
    setRecentSearches((current) => {
      const next = [
        query,
        ...current.filter((item) => item.toLowerCase() !== query.toLowerCase()),
      ].slice(0, 5)
      localStorage.setItem("volt-recent-searches", JSON.stringify(next))
      return next
    })
    trackCommerceEvent("search_submitted", { queryLength: query.length })
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    runSearch(dynamicSuggestions[suggestionIndex] || searchValue)
  }

  const handleSearchKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const navigableSuggestions = searchSuggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().includes(searchValue.toLowerCase()) ||
        !searchValue,
    )
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setSuggestionIndex((index) =>
        Math.min(index + 1, navigableSuggestions.length - 1),
      )
    }
    if (event.key === "ArrowUp") {
      event.preventDefault()
      setSuggestionIndex((index) => Math.max(index - 1, 0))
    }
    if (event.key === "Escape") setSearchFocused(false)
  }

  const dynamicSuggestions = searchSuggestions
    .filter(
      (suggestion) =>
        suggestion.toLowerCase().includes(searchValue.toLowerCase()) ||
        !searchValue,
    )
    .slice(0, 4)
  const matchingProducts = searchValue
    ? searchCatalogue(products || catalogue, searchValue)
        .slice(0, 3)
        .map(({ product }) => product)
    : []

  const isOwnerRoute =
    location.pathname.startsWith("/owner") ||
    location.pathname.startsWith("/admin")
  const isAccountRoute =
    location.pathname.startsWith("/account") ||
    location.pathname.startsWith("/track-order")
  const isDashboardRoute = isOwnerRoute || isAccountRoute

  if (isDashboardRoute) {
    // Current route active tab flags
    const isOwnerOverview = location.pathname === "/owner" || location.pathname === "/owner/"
    const isOwnerProducts = location.pathname.startsWith("/owner/products") || location.pathname.startsWith("/owner/catalog")
    const isOwnerOrders = location.pathname.startsWith("/owner/orders") || location.pathname.startsWith("/owner/fulfillment")
    const isOwnerSettings = location.pathname.startsWith("/owner/settings") || location.pathname.startsWith("/owner/content")

    const isCustomerOverview = location.pathname === "/account" || location.pathname === "/account/"
    const isCustomerOrders = location.pathname.startsWith("/account/orders")
    const isCustomerTracking =
      location.pathname.startsWith("/track-order") ||
      location.pathname.startsWith("/account/track")
    const isCustomerWishlist =
      location.pathname.startsWith("/account/wishlist") ||
      location.pathname.startsWith("/wishlist")
    const isCustomerSettings =
      location.pathname.startsWith("/account/settings") ||
      location.pathname.startsWith("/account/profile") ||
      location.pathname.startsWith("/account/addresses") ||
      location.pathname.startsWith("/account/security")

    const ordersInProgressCount = (orders || []).filter(
      (o) => o && o.fulfillmentStatus !== "Delivered",
    ).length

    return (
      <div className={`dash-app-layout ${isDarkMode ? "is-dark" : ""}`}>
        {/* BIG LEFT SIDEBAR (Matching reference image media_1793455843041_097fa8bf.jpg) */}
        <aside
          className={`dash-app-sidebar ${sidebarCollapsed ? "is-collapsed" : ""}`}
          aria-label="Dashboard Sidebar"
        >
          {/* Top Brand Header: Own Logo + Title + v2.0 badge */}
          <div className="dash-sidebar-brand-header">
            <AppLink to="/" className="dash-sidebar-brand-link" title="ABC EV PART Storefront">
              <span className="dash-sidebar-brand-box">
                <Zap size={19} className="fill-current text-white" />
              </span>
              <div className="dash-sidebar-brand-text">
                <div className="title">
                  ABC EV <span>PART</span>
                </div>
                <div className="sub">
                  {isOwnerRoute ? "Vendor Cloud" : "Customer Hub"}
                </div>
              </div>
            </AppLink>

            <span className="dash-version-pill hidden sm:inline-flex">v2.0</span>
          </div>

          {/* Navigation Items Scroll Area */}
          <div className="dash-sidebar-nav-scroll">
            {isOwnerRoute ? (
              <>
                <div className="dash-nav-category-title">DASHBOARD</div>
                <button
                  type="button"
                  className={`dash-sidebar-nav-item ${isOwnerOverview ? "is-active" : ""}`}
                  onClick={() => navigate("/owner")}
                  title="Overview & KPIs"
                >
                  <div className="dash-nav-item-left">
                    <BarChart3 size={17} className="dash-nav-item-icon" />
                    <span>Overview & KPIs</span>
                  </div>
                </button>

                <div className="dash-nav-category-title">MANAGEMENT & INVENTORY</div>
                <button
                  type="button"
                  className={`dash-sidebar-nav-item ${isOwnerProducts ? "is-active" : ""}`}
                  onClick={() => navigate("/owner/products")}
                  title="Products & Catalog"
                >
                  <div className="dash-nav-item-left">
                    <Boxes size={17} className="dash-nav-item-icon" />
                    <span>Products & Catalog</span>
                  </div>
                  <span className="dash-nav-count-badge">{(products || []).length}</span>
                </button>

                <button
                  type="button"
                  className={`dash-sidebar-nav-item ${isOwnerOrders ? "is-active" : ""}`}
                  onClick={() => navigate("/owner/orders")}
                  title="Order Fulfillment"
                >
                  <div className="dash-nav-item-left">
                    <Truck size={17} className="dash-nav-item-icon" />
                    <span>Order Fulfillment</span>
                  </div>
                  <span className="dash-nav-count-badge">{(orders || []).length}</span>
                </button>

                <button
                  type="button"
                  className={`dash-sidebar-nav-item ${isOwnerSettings ? "is-active" : ""}`}
                  onClick={() => navigate("/owner/settings")}
                  title="Store Settings & VAT"
                >
                  <div className="dash-nav-item-left">
                    <Settings size={17} className="dash-nav-item-icon" />
                    <span>Store Settings & VAT</span>
                  </div>
                </button>

                <div className="dash-nav-category-title">PORTAL SWITCH</div>
                <button
                  type="button"
                  className="dash-sidebar-nav-item"
                  onClick={() => {
                    switchRole("customer")
                    navigate("/account")
                  }}
                  title="Switch to Customer Portal"
                >
                  <div className="dash-nav-item-left">
                    <UserRound size={17} className="dash-nav-item-icon" />
                    <span>Customer Portal</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="dash-sidebar-nav-item"
                  onClick={() => navigate("/")}
                  title="Back to Live Storefront"
                >
                  <div className="dash-nav-item-left">
                    <ArrowLeft size={17} className="dash-nav-item-icon text-amber-500" />
                    <span className="font-bold text-amber-600">Back to Website</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <div className="dash-nav-category-title">CUSTOMER DASHBOARD</div>
                <button
                  type="button"
                  className={`dash-sidebar-nav-item ${isCustomerOverview ? "is-active" : ""}`}
                  onClick={() => navigate("/account")}
                  title="Overview & Spending"
                >
                  <div className="dash-nav-item-left">
                    <BarChart3 size={17} className="dash-nav-item-icon" />
                    <span>Overview & Spending</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`dash-sidebar-nav-item ${isCustomerOrders ? "is-active" : ""}`}
                  onClick={() => navigate("/account/orders")}
                  title="My Orders"
                >
                  <div className="dash-nav-item-left">
                    <Package size={17} className="dash-nav-item-icon" />
                    <span>My Orders</span>
                  </div>
                  <span className="dash-nav-count-badge">{(orders || []).length}</span>
                </button>

                <button
                  type="button"
                  className={`dash-sidebar-nav-item ${isCustomerTracking ? "is-active" : ""}`}
                  onClick={() => navigate("/track-order")}
                  title="Order Tracking"
                >
                  <div className="dash-nav-item-left">
                    <Truck size={17} className="dash-nav-item-icon" />
                    <span>Order Tracking</span>
                  </div>
                  {ordersInProgressCount > 0 && (
                    <span className="dash-nav-count-badge">{ordersInProgressCount}</span>
                  )}
                </button>

                <button
                  type="button"
                  className={`dash-sidebar-nav-item ${isCustomerWishlist ? "is-active" : ""}`}
                  onClick={() => navigate("/account/wishlist")}
                  title="Saved in Garage"
                >
                  <div className="dash-nav-item-left">
                    <Heart size={17} className="dash-nav-item-icon" />
                    <span>Saved in Garage</span>
                  </div>
                  {(wishlistEntries || []).length > 0 && (
                    <span className="dash-nav-count-badge">{(wishlistEntries || []).length}</span>
                  )}
                </button>

                <div className="dash-nav-category-title">ACCOUNT PREFERENCES</div>
                <button
                  type="button"
                  className={`dash-sidebar-nav-item ${isCustomerSettings ? "is-active" : ""}`}
                  onClick={() => navigate("/account/settings")}
                  title="Settings (Profile, Password, Addresses)"
                >
                  <div className="dash-nav-item-left">
                    <Settings size={17} className="dash-nav-item-icon" />
                    <span>Settings</span>
                  </div>
                </button>

                <div className="dash-nav-category-title">PORTAL SWITCH</div>
                <button
                  type="button"
                  className="dash-sidebar-nav-item"
                  onClick={() => {
                    switchRole("owner")
                    navigate("/owner")
                  }}
                  title="Switch to Store Owner Demo"
                >
                  <div className="dash-nav-item-left">
                    <Zap size={17} className="dash-nav-item-icon text-amber-500" />
                    <span>Store Owner Demo</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="dash-sidebar-nav-item"
                  onClick={() => navigate("/")}
                  title="Back to Website"
                >
                  <div className="dash-nav-item-left">
                    <ArrowLeft size={17} className="dash-nav-item-icon text-amber-500" />
                    <span className="font-bold text-amber-600">Back to Website</span>
                  </div>
                </button>
              </>
            )}

            {/* Bottom Footer Help */}
            <div className="dash-sidebar-footer-links">
              <button
                type="button"
                className="dash-sidebar-nav-item"
                onClick={() => navigate("/help")}
                title="Help Center"
              >
                <div className="dash-nav-item-left">
                  <HelpCircle size={15} className="dash-nav-item-icon" />
                  <span>Help Center</span>
                </div>
              </button>
              <button
                type="button"
                className="dash-sidebar-nav-item"
                onClick={() => navigate("/legal")}
                title="Documentation & Terms"
              >
                <div className="dash-nav-item-left">
                  <FileText size={15} className="dash-nav-item-icon" />
                  <span>Documentation</span>
                </div>
              </button>
            </div>
          </div>

          {/* Pinned Bottom User Profile Card (Moved to bottom side as requested) */}
          <div className="dash-sidebar-bottom-wrap">
            <div
              className="dash-sidebar-profile-card"
              onClick={() => navigate(isOwnerRoute ? "/owner/settings" : "/account/profile")}
              title={user.fullName || "User Profile"}
              role="button"
              tabIndex={0}
            >
              <div className="dash-sidebar-avatar">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="dash-profile-meta">
                <div className="name">{user.fullName || "Aayush Shrestha"}</div>
                <div className="email">{user.email || "aayush.shrestha@abcevpart.np"}</div>
                <div className="dash-profile-badge">
                  <Check size={10} />
                  <span>{isOwner ? "Owner & Vendor" : "Nepal Verified"}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT APP BODY WRAP: Top Navbar + Page Content */}
        <div className="dash-app-main-wrap">
          {/* Top Navbar */}
          <header className="dash-app-top-nav">
            {/* Left Controls: Top Collapse Button with brand orange color + Divider + Search */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className={`dash-sidebar-toggle-btn ${sidebarCollapsed ? "is-active" : ""}`}
                onClick={toggleSidebar}
                title={sidebarCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
                aria-label="Toggle Sidebar"
              >
                <PanelLeft size={18} />
              </button>

              <div className="dash-v-sep" />

              <div className="dash-nav-search-wrap">
                <Search size={15} className="dash-nav-search-icon" />
                <input
                  id="dash-search-input"
                  type="text"
                  className="dash-nav-search-input"
                  placeholder="Search products or orders... (⌘K)"
                  value={dashSearch}
                  onChange={(e) => setDashSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && dashSearch.trim()) {
                      runSearch(dashSearch)
                    }
                  }}
                />
                <kbd className="dash-nav-search-kbd">⌘K</kbd>
              </div>
            </div>

            {/* Right Controls: Theme toggle, Cart, Bell, Mail, Profile dropdown */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme toggle */}
              <button
                type="button"
                className="dash-icon-tool-btn"
                onClick={() => {
                  const nextMode = !isDarkMode
                  setIsDarkMode(nextMode)
                  localStorage.setItem("ubuy-dark-mode", String(nextMode))
                }}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun size={17} className="text-amber-400" />
                ) : (
                  <Moon size={17} />
                )}
              </button>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                className="dash-icon-tool-btn relative"
                onClick={() => setCartOpen(true)}
                title="View Cart"
                aria-label="View Cart"
              >
                <ShoppingBag size={17} />
                {cartCount > 0 && (
                  <span className="dash-cart-tool-badge">{cartCount}</span>
                )}
              </button>

              {/* Notification Bell with Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="dash-icon-tool-btn relative"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen)
                    setProfileDropdownOpen(false)
                  }}
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <Bell size={17} />
                  {unreadNotifs > 0 && <span className="ping-dot" />}
                </button>

                {notificationsOpen && (
                  <div className="dash-notif-dropdown">
                    <div className="dash-notif-header">
                      <h4>Notifications ({unreadNotifs})</h4>
                      <button
                        type="button"
                        className="dash-notif-clear-btn"
                        onClick={() => {
                          setUnreadNotifs(0)
                          notify("All notifications marked as read.")
                        }}
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="dash-notif-list">
                      <div className="dash-notif-item is-unread">
                        <div className="dash-notif-icon-box">
                          <Truck size={16} />
                        </div>
                        <div>
                          <div className="dash-notif-title">Kathmandu Hub Transit</div>
                          <div className="dash-notif-desc">Order UB-NP-862372 dispatched via Sundar Express with GPS tracking.</div>
                          <div className="dash-notif-time">12 mins ago</div>
                        </div>
                      </div>

                      <div className="dash-notif-item is-unread">
                        <div className="dash-notif-icon-box">
                          <ShieldCheck size={16} />
                        </div>
                        <div>
                          <div className="dash-notif-title">Customs 13% VAT Cleared</div>
                          <div className="dash-notif-desc">420mm Carbon-Ceramic Brakes verified at Tribhuvan Airport Hub.</div>
                          <div className="dash-notif-time">45 mins ago</div>
                        </div>
                      </div>

                      <div className="dash-notif-item">
                        <div className="dash-notif-icon-box">
                          <Package size={16} />
                        </div>
                        <div>
                          <div className="dash-notif-title">New EV Catalog Part Live</div>
                          <div className="dash-notif-desc">ABC EV PART Apex-900 Dual Axial Flux Motor added by Admin.</div>
                          <div className="dash-notif-time">2 hours ago</div>
                        </div>
                      </div>

                      <div className="dash-notif-item">
                        <div className="dash-notif-icon-box">
                          <Settings size={16} />
                        </div>
                        <div>
                          <div className="dash-notif-title">Store Announcement</div>
                          <div className="dash-notif-desc">Free nationwide shipping active on orders above NPR 100,000.</div>
                          <div className="dash-notif-time">5 hours ago</div>
                        </div>
                      </div>
                    </div>

                    <div className="dash-notif-footer">
                      <button
                        type="button"
                        className="dash-notif-view-all"
                        onClick={() => {
                          setNotificationsOpen(false)
                          navigate(isOwnerRoute ? "/owner/orders" : "/account/orders")
                        }}
                      >
                        View All Activity &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Support / Mail */}
              <button
                type="button"
                className="dash-icon-tool-btn hidden sm:grid"
                onClick={() => notify("Support channel active. Kathmandu Distribution Support: +977-1-4528990")}
                title="Support & Mail"
                aria-label="Support & Mail"
              >
                <Mail size={17} />
              </button>

              {/* Profile Avatar Trigger & Dropdown Menu */}
              <div className="relative">
                <button
                  type="button"
                  className="dash-user-profile-trigger"
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen)
                    setNotificationsOpen(false)
                  }}
                  aria-label="User Account Menu"
                >
                  <div className="dash-user-avatar-circle">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-slate-800">
                    {user.fullName.split(" ")[0]}
                  </span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="dash-profile-menu-dropdown">
                    <div className="dash-profile-menu-header">
                      <div className="text-sm font-bold text-slate-900">
                        {user.fullName}
                      </div>
                      <div className="text-xs text-slate-500 font-medium truncate">
                        {user.email}
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Check size={10} />
                        {isOwner ? "Store Owner & Vendor" : "Verified Customer (Platinum)"}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="dash-profile-menu-item"
                      onClick={() => {
                        setProfileDropdownOpen(false)
                        navigate(isOwnerRoute ? "/owner/settings" : "/account/settings")
                      }}
                    >
                      <Settings size={15} className="text-slate-400" />
                      <span>{isOwnerRoute ? "Vendor Profile & Hub" : "Account Settings"}</span>
                    </button>

                    <button
                      type="button"
                      className="dash-profile-menu-item"
                      onClick={() => {
                        setProfileDropdownOpen(false)
                        setSettingsModalOpen(true)
                      }}
                    >
                      <Settings size={15} className="text-slate-400" />
                      <span>Quick Settings</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      type="button"
                      className="dash-profile-menu-item"
                      onClick={() => {
                        setProfileDropdownOpen(false)
                        if (isOwner) {
                          switchRole("customer")
                          navigate("/account")
                        } else {
                          switchRole("owner")
                          navigate("/owner")
                        }
                      }}
                    >
                      <Zap size={15} className="text-amber-500" />
                      <span>{isOwner ? "Switch to Customer Portal" : "Switch to Store Owner Demo"}</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      type="button"
                      className="dash-profile-menu-item is-danger"
                      onClick={() => {
                        setProfileDropdownOpen(false)
                        logout()
                        navigate("/login")
                      }}
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="dash-app-content">
            <Outlet context={commerce} />
          </main>
        </div>

        {/* Floating Settings Gear Button in Bottom Right Corner */}
        <button
          type="button"
          className="dash-floating-settings-btn"
          onClick={() => setSettingsModalOpen(true)}
          title="Open Dashboard Settings"
          aria-label="Open Dashboard Settings"
        >
          <Settings size={22} />
        </button>

        {/* Quick Settings Modal */}
        {settingsModalOpen && (
          <div
            className="dash-settings-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSettingsModalOpen(false)
            }}
          >
            <div className="dash-settings-modal-card">
              <div className="dash-settings-modal-header">
                <h3>
                  <Settings size={18} className="text-amber-500" />
                  <span>Dashboard Preferences</span>
                </h3>
                <IconButton
                  label="Close"
                  onClick={() => setSettingsModalOpen(false)}
                >
                  <X size={18} />
                </IconButton>
              </div>

              <div>
                <div className="dash-settings-row">
                  <div>
                    <div className="dash-settings-row-label">Collapse Sidebar by Default</div>
                    <div className="dash-settings-row-sub">Compact icon-only rail (72px) for max screen width</div>
                  </div>
                  <button
                    type="button"
                    className={`dash-toggle-switch ${sidebarCollapsed ? "is-on" : ""}`}
                    onClick={toggleSidebar}
                  >
                    <span className="dash-toggle-thumb" />
                  </button>
                </div>

                <div className="dash-settings-row">
                  <div>
                    <div className="dash-settings-row-label">Nepal 13% VAT Calculation</div>
                    <div className="dash-settings-row-sub">Always show transparent Inland Revenue Department VAT</div>
                  </div>
                  <button
                    type="button"
                    className={`dash-toggle-switch ${vatTransparency ? "is-on" : ""}`}
                    onClick={() => setVatTransparency(!vatTransparency)}
                  >
                    <span className="dash-toggle-thumb" />
                  </button>
                </div>

                <div className="dash-settings-row">
                  <div>
                    <div className="dash-settings-row-label">Audio Dispatch Alerts</div>
                    <div className="dash-settings-row-sub">Audible sound on live courier updates & new orders</div>
                  </div>
                  <button
                    type="button"
                    className={`dash-toggle-switch ${soundAlerts ? "is-on" : ""}`}
                    onClick={() => setSoundAlerts(!soundAlerts)}
                  >
                    <span className="dash-toggle-thumb" />
                  </button>
                </div>

                <div className="dash-settings-row">
                  <div>
                    <div className="dash-settings-row-label">Dark Interface Mode</div>
                    <div className="dash-settings-row-sub">Night mode contrast for high-voltage telemetry</div>
                  </div>
                  <button
                    type="button"
                    className={`dash-toggle-switch ${isDarkMode ? "is-on" : ""}`}
                    onClick={() => {
                      const next = !isDarkMode
                      setIsDarkMode(next)
                      localStorage.setItem("ubuy-dark-mode", String(next))
                    }}
                  >
                    <span className="dash-toggle-thumb" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <label className="dash-settings-row-label block mb-1">
                    Primary Regional Distribution Hub
                  </label>
                  <select
                    className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                    value={selectedHub}
                    onChange={(e) => setSelectedHub(e.target.value)}
                  >
                    <option>Kathmandu Central Hub (Bagmati)</option>
                    <option>Pokhara Western Distribution Center (Gandaki)</option>
                    <option>Biratnagar Industrial Hub (Koshi)</option>
                    <option>Butwal Logistics Station (Lumbini)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSettingsModalOpen(false)
                    notify("Dashboard preferences saved.")
                  }}
                >
                  Save & Apply
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="app-shell">
      {/* Modern Luxury Sticky Header */}
      <header className={`modern-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="container modern-header__inner">
          {/* Brand */}
          <div className="modern-header__brand">
            <IconButton
              className="mobile-menu-button hidden max-md:inline-flex md:hidden"
              label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={22} />
            </IconButton>

            <AppLink
              aria-label="ABC EV PART"
              className="clean-brand"
              to="/"
            >
              <span className="clean-brand__mark">
                <Zap size={18} className="fill-current text-white" />
              </span>
              <span className="clean-brand__name">
                ABC EV <span>PART</span>
              </span>
            </AppLink>
          </div>

          {/* Clean Modern Search Bar */}
          <div className="clean-search-wrap">
            <form className="clean-search-bar" onSubmit={handleSearch}>
              <Search
                aria-hidden="true"
                size={18}
                className="clean-search-icon"
              />
              <Input
                aria-autocomplete="list"
                aria-controls="search-suggestions"
                aria-expanded={searchFocused}
                aria-label="Search products"
                autoComplete="off"
                name="search"
                onBlur={() =>
                  window.setTimeout(() => setSearchFocused(false), 160)
                }
                onChange={(event) => {
                  setSearchValue(event.target.value)
                  setSuggestionIndex(-1)
                }}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleSearchKey}
                placeholder="Search products, brands, or categories..."
                role="combobox"
                value={searchValue}
              />
              {searchValue && (
                <IconButton
                  className="clean-search-clear"
                  label="Clear search"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setSearchValue("")
                    setSuggestionIndex(-1)
                  }}
                >
                  <X size={15} />
                </IconButton>
              )}
            </form>

            {searchFocused && (
              <div
                className="clean-search-dropdown"
                id="search-suggestions"
                role="listbox"
              >
                {recentSearches.length > 0 && (
                  <div className="search-dropdown-section">
                    <div className="search-dropdown-heading">
                      Recent Searches
                    </div>
                    <div className="recent-pills">
                      {recentSearches.slice(0, 3).map((recent) => (
                        <button
                          key={recent}
                          onMouseDown={() => runSearch(recent)}
                          type="button"
                          className="recent-pill"
                        >
                          <Clock3 size={13} /> {recent}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="search-dropdown-section">
                  <div className="search-dropdown-heading">
                    Popular Components
                  </div>
                  {dynamicSuggestions.map((suggestion, index) => (
                    <button
                      aria-selected={suggestionIndex === index}
                      className={`search-suggest-item ${
                        suggestionIndex === index ? "is-selected" : ""
                      }`}
                      key={suggestion}
                      onMouseDown={() => runSearch(suggestion)}
                      role="option"
                      type="button"
                    >
                      <Search size={15} />
                      <span>{suggestion}</span>
                      <ArrowRight size={14} className="suggest-arrow" />
                    </button>
                  ))}
                </div>

                {matchingProducts.length > 0 && (
                  <div className="search-dropdown-section">
                    <div className="search-dropdown-heading">
                      Matching Parts
                    </div>
                    {matchingProducts.map((product) => (
                      <button
                        className="search-product-item"
                        key={product.id}
                        onMouseDown={() => {
                          viewProduct(product.id)
                          navigate(`/product/${product.id}`)
                          setSearchFocused(false)
                        }}
                        type="button"
                      >
                        <img alt="" src={product.image} />
                        <div>
                          <strong>{product.name}</strong>
                          <span>
                            {product.brand} · {product.voltage} ·{" "}
                            {formatNpr(product.price)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Clean Modern Actions */}
          <div className="modern-header__actions">
            {/* Minimal Clean Authentication & Account Actions */}
            {!user.isAuthenticated ? (
              <button
                className={`header-action-btn ${
                  location.pathname === "/login" || location.pathname === "/signin" ? "is-active" : ""
                }`}
                onClick={() => navigate("/login")}
                type="button"
                title="Sign in to your account"
              >
                <LogIn size={18} className="text-amber-500" />
                <span className="btn-label font-bold text-slate-800">Sign In</span>
              </button>
            ) : (
              <>
                {isOwner && (
                  <button
                    className={`header-action-btn header-action-btn--owner ${
                      location.pathname.startsWith("/owner") || location.pathname.startsWith("/admin")
                        ? "is-active"
                        : ""
                    }`}
                    onClick={() => navigate("/owner")}
                    type="button"
                    title="Store Owner Admin Hub"
                  >
                    <ShieldCheck size={18} className="text-amber-500" />
                    <span className="btn-label">Owner Hub</span>
                  </button>
                )}

                <button
                  className={`header-action-btn ${
                    location.pathname.startsWith("/account") ? "is-active" : ""
                  }`}
                  onClick={() => navigate("/account")}
                  type="button"
                  title="My Account"
                >
                  <UserRound size={18} />
                  <span className="btn-label font-bold">
                    {user.fullName.split(" ")[0]}
                  </span>
                </button>
              </>
            )}

            <button
              className={`header-action-btn ${
                location.pathname === "/wishlist" ? "is-active" : ""
              }`}
              onClick={() => navigate("/wishlist")}
              type="button"
            >
              <Heart size={20} />
              <span className="btn-label">Wishlist</span>
              {wishlistEntries.length > 0 && (
                <span className="modern-badge">{wishlistEntries.length}</span>
              )}
            </button>

            <button
              className={`header-action-btn header-action-btn--cart ${
                location.pathname === "/cart" ? "is-active" : ""
              }`}
              onClick={() => setCartOpen(true)}
              type="button"
            >
              <ShoppingBag size={20} />
              <span className="btn-label">Cart</span>
              {cartCount > 0 && (
                <span className="modern-badge modern-badge--orange">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Clean Minimalist Category Navigation */}
        <nav
          aria-label="Categories"
          className="clean-nav"
          onMouseLeave={() => setActiveMega("")}
        >
          <div className="container clean-nav__inner">
            {categories.map((category) => {
              const isAll = category === "All Categories"
              const linkTo = isAll
                ? "/categories"
                : `/search?subcategory=${encodeURIComponent(category)}`
              const hasMega = Boolean(megaMenu[category])

              return (
                <AppLink
                  className={`clean-nav__item ${isAll ? "is-lead" : ""}`}
                  key={category}
                  onFocus={() => setActiveMega(hasMega ? category : "")}
                  onMouseEnter={() => setActiveMega(hasMega ? category : "")}
                  to={linkTo}
                >
                  {isAll && <Zap size={14} className="lead-icon" />}
                  {category}
                  {hasMega && <ChevronDown size={13} className="nav-chevron" />}
                </AppLink>
              )
            })}
          </div>

          {/* Sleek Mega Menu */}
          {activeMega && megaMenu[activeMega] && (
            <div className="clean-mega-menu">
              <div className="container clean-mega-menu__inner">
                <div className="mega-columns">
                  {megaMenu[activeMega].map(([title, ...links]) => (
                    <div key={title} className="mega-col">
                      <h6>{title}</h6>
                      {links.map((link) => (
                        <AppLink
                          key={link}
                          to={`/search?q=${encodeURIComponent(link)}`}
                        >
                          {link}
                        </AppLink>
                      ))}
                    </div>
                  ))}
                </div>
                <AppLink
                  className="mega-featured-card"
                  to={`/search?subcategory=${encodeURIComponent(activeMega)}`}
                >
                  <img
                    alt=""
                    src={
                      activeMega === "Battery & BMS"
                        ? "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
                        : activeMega === "Charging & Wallboxes"
                          ? "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=600&q=80"
                          : "https://images.unsplash.com/photo-1558441719-8b489c63f77a?auto=format&fit=crop&w=600&q=80"
                    }
                  />
                  <div>
                    <span>Technical Architecture</span>
                    <strong>
                      Explore {activeMega} Specs <span>→</span>
                    </strong>
                  </div>
                </AppLink>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Outlet with Full Commerce Context */}
      <main>
        <Outlet context={commerce} />
      </main>

      {/* Clean Modern 5-Column Luxury Footer */}
      <footer className="clean-footer">
        <div className="container clean-footer__grid">
          {/* Column 1: Brand & Overview */}
          <div className="footer-brand-col">
            <AppLink className="clean-brand clean-brand--footer" to="/">
              <span className="clean-brand__mark">
                <Zap size={18} className="fill-current text-white" />
              </span>
              <span className="clean-brand__name">
                ABC EV <span>PART</span>
              </span>
            </AppLink>
            <p className="footer-desc">
              Nepal's premier store for authentic EV performance parts, power electronics, and verified components with nationwide doorstep delivery.
            </p>
            <div className="footer-socials">
              <IconButton label="Feed">
                <Rss size={16} />
              </IconButton>
              <IconButton label="Discord">
                <MessageCircle size={16} />
              </IconButton>
              <IconButton label="Share">
                <Share2 size={16} />
              </IconButton>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="footer-links-col">
            <h6>Shop</h6>
            <AppLink to="/categories">All Categories</AppLink>
            <AppLink to="/search?subcategory=Powertrain+%26+Motors">
              Powertrain & Motors
            </AppLink>
            <AppLink to="/search?subcategory=Power+Electronics+%26+Inverters">
              Inverters & Electronics
            </AppLink>
            <AppLink to="/search?subcategory=Battery+%26+BMS">
              Battery Systems
            </AppLink>
            <AppLink to="/search?subcategory=Charging+%26+Wallboxes">
              Charging Stations
            </AppLink>
            <AppLink to="/deals">Special Offers & Deals</AppLink>
          </div>

          {/* Column 3: Support */}
          <div className="footer-links-col">
            <h6>Support</h6>
            <AppLink to="/help">Help Center</AppLink>
            <AppLink to="/help/shipping">Delivery Information</AppLink>
            <AppLink to="/help/pricing">13% VAT & Invoicing</AppLink>
            <AppLink to="/help/returns">Returns & Warranty</AppLink>
            <AppLink to="/contact">Contact Support</AppLink>
          </div>

          {/* Column 4: Account */}
          <div className="footer-links-col">
            <h6>Account</h6>
            <AppLink to="/account">My Account</AppLink>
            <AppLink to="/account/orders">My Orders</AppLink>
            <AppLink to="/track-order">Track Order</AppLink>
            <AppLink to="/wishlist">Saved Wishlist</AppLink>
            <AppLink to="/cart">Shopping Cart</AppLink>
          </div>

          {/* Column 5: Company */}
          <div className="footer-links-col">
            <h6>Company</h6>
            <AppLink to="/about">About ABC EV PART</AppLink>
            <AppLink to="/contact">Lazimpat Hub (KTM)</AppLink>
            <AppLink to="/privacy">Privacy Policy</AppLink>
            <AppLink to="/terms">Terms of Service</AppLink>
            <AppLink to="/account">Security & 2FA</AppLink>
          </div>
        </div>

        <div className="container clean-footer__bottom">
          <span>
            © 2026 ABC EV PART Inc. All rights reserved.
          </span>
          <span>
            Prices in NPR (रु) · 13% Nepal VAT included · Delivery within Nepal only
          </span>
        </div>
      </footer>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="overlay" onMouseDown={() => setMenuOpen(false)}>
          <aside
            aria-label="Mobile navigation"
            className="drawer drawer--left"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="drawer__header">
              <AppLink className="clean-brand" to="/">
                <span className="clean-brand__mark">
                  <Zap size={16} />
                </span>
                <span className="clean-brand__name">
                  ABC EV <span>PART</span>
                </span>
              </AppLink>
              <IconButton
                label="Close navigation"
                onClick={() => setMenuOpen(false)}
              >
                <X size={20} />
              </IconButton>
            </div>
            <div className="mobile-nav">
              <span className="mobile-nav__label">Shop Categories</span>
              <AppLink onClick={() => setMenuOpen(false)} to="/categories">
                All Categories <span>→</span>
              </AppLink>
              {categories.slice(1).map((category) => (
                <AppLink
                  key={category}
                  onClick={() => setMenuOpen(false)}
                  to={`/search?subcategory=${encodeURIComponent(category)}`}
                >
                  {category} <span>→</span>
                </AppLink>
              ))}

              <span className="mobile-nav__label">Customer Journey</span>
              <AppLink onClick={() => setMenuOpen(false)} to="/cart">
                Shopping Cart ({cartCount}) <span>→</span>
              </AppLink>
              <AppLink onClick={() => setMenuOpen(false)} to="/checkout">
                Checkout <span>→</span>
              </AppLink>
              <AppLink onClick={() => setMenuOpen(false)} to="/wishlist">
                Wishlist ({wishlistEntries.length}) <span>→</span>
              </AppLink>
              <AppLink onClick={() => setMenuOpen(false)} to="/account">
                My Account & Orders <span>→</span>
              </AppLink>
              <AppLink onClick={() => setMenuOpen(false)} to="/track-order">
                Track Order <span>→</span>
              </AppLink>
              <AppLink onClick={() => setMenuOpen(false)} to="/help">
                Help Center <span>→</span>
              </AppLink>
              <AppLink onClick={() => setMenuOpen(false)} to="/contact">
                Contact Support <span>→</span>
              </AppLink>
            </div>
          </aside>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="overlay" onMouseDown={() => setCartOpen(false)}>
          <aside
            aria-label="Shopping Cart"
            className="drawer drawer--right"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="drawer__header">
              <span>Shopping Cart ({cartCount})</span>
              <IconButton label="Close cart" onClick={() => setCartOpen(false)}>
                <X size={20} />
              </IconButton>
            </div>

            {cartItems.length ? (
              <div className="cart-preview">
                <p>Items ready for doorstep delivery across Nepal</p>
                <div className="drawer-cart-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="drawer-item-row">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="drawer-item-thumb"
                      />
                      <div className="drawer-item-info">
                        <strong>{item.name}</strong>
                        <span>
                          {item.quantity} × {formatNpr(item.price)}
                        </span>
                      </div>
                      <button
                        className="drawer-item-remove"
                        onClick={() => removeFromCart(item.id)}
                        type="button"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="drawer-subtotal-block">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Subtotal:</span>
                    <strong>{formatNpr(totals.subtotal)}</strong>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mb-3">
                    <span>13% Nepal VAT (Included):</span>
                    <span>{formatNpr(totals.vat)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-slate-900 border-t pt-2">
                    <span>Total Amount:</span>
                    <span className="text-amber-600">
                      {formatNpr(totals.payNowTotal)}
                    </span>
                  </div>
                </div>

                <div className="drawer-actions-stack">
                  <Button
                    size="lg"
                    variant="primary"
                    onClick={() => {
                      setCartOpen(false)
                      navigate("/checkout")
                    }}
                  >
                    Proceed to Checkout ({formatNpr(totals.payNowTotal)})
                  </Button>

                  <Button
                    size="md"
                    variant="secondary"
                    onClick={() => {
                      setCartOpen(false)
                      navigate("/cart")
                    }}
                  >
                    View & Edit Full Cart
                  </Button>
                </div>
                <small className="block text-center mt-2 text-slate-400">
                  Nationwide doorstep delivery across Nepal with 13% VAT included.
                </small>
              </div>
            ) : (
              <div className="empty-state">
                <span>
                  <ShoppingBag size={28} />
                </span>
                <Heading>Your shopping cart is empty</Heading>
                <p>
                  Explore authentic automotive performance parts, electronics, and accessories ready for fast delivery in Nepal.
                </p>
                <Button
                  onClick={() => {
                    setCartOpen(false)
                    navigate("/search")
                  }}
                >
                  Explore Catalog
                </Button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Account / Technician Portal Modal */}
      {accountOpen && (
        <div
          className="overlay overlay--center"
          onMouseDown={() => setAccountOpen(false)}
        >
          <section
            aria-modal="true"
            className="modal"
            role="dialog"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="drawer__header">
              <span>Technician Portal</span>
              <IconButton
                label="Close dialog"
                onClick={() => setAccountOpen(false)}
              >
                <X size={20} />
              </IconButton>
            </div>
            <div className="modal__content">
              <span className="modal-icon">
                <Zap />
              </span>
              <Heading>ABC EV PART Certified Engineering Network</Heading>
              <p>
                Access high-voltage schematics, firmware updates, dyno
                calibration maps, and warranty registration.
              </p>
              <Button
                onClick={() => {
                  setAccountOpen(false)
                  navigate("/account")
                }}
              >
                Open Customer Portal
              </Button>
            </div>
          </section>
        </div>
      )}

      {toast && (
        <div aria-live="polite" className="toast">
          <span>⚡</span>
          {toast}
        </div>
      )}
    </div>
  )
}
