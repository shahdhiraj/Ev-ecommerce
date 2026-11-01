import { useState, useEffect } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  Clock,
  CreditCard,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  Heart,
  HelpCircle,
  KeyRound,
  LogOut,
  MapPin,
  Package,
  PanelLeft,
  Plus,
  Printer,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Trash2,
  TrendingUp,
  Truck,
  User,
  UserRound,
  X,
  Zap,
} from "lucide-react"
import { useLocation, useNavigate } from "react-router"
import {
  AppLink,
  Badge,
  Button,
  Heading,
  IconButton,
  Input,
} from "../components/ui"
import { useCommerce } from "../lib/commerceContext"
import {
  NEPAL_PROVINCES,
  type NepalAddress,
  type NepalProvince,
} from "../lib/commerceStore"
import { formatNpr } from "../lib/search"

type AccountTab = "overview" | "settings"
type SettingsTab = "profile" | "password" | "addresses" | "notifications"

export function AccountPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    user,
    isOwner,
    switchRole,
    orders,
    wishlistEntries,
    cartItems,
    addToCart,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    logout,
    notify,
    sidebarCollapsed,
    toggleSidebar,
  } = useCommerce()

  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all")
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<any | null>(null)

  // Determine whether this route belongs to settings
  const isSettingsRoute =
    location.pathname.includes("/settings") ||
    location.pathname.includes("/profile") ||
    location.pathname.includes("/addresses") ||
    location.pathname.includes("/security") ||
    location.pathname.includes("/notifications") ||
    location.pathname.includes("/preferences")

  const getSettingsSubTab = (): SettingsTab => {
    if (location.pathname.includes("/security")) return "password"
    if (location.pathname.includes("/addresses")) return "addresses"
    if (location.pathname.includes("/notifications") || location.pathname.includes("/preferences"))
      return "notifications"
    return "profile"
  }

  const [activeTab, setActiveTab] = useState<AccountTab>(
    isSettingsRoute ? "settings" : "overview"
  )
  const [settingsTab, setSettingsTab] = useState<SettingsTab>(getSettingsSubTab())

  useEffect(() => {
    const isSettings =
      location.pathname.includes("/settings") ||
      location.pathname.includes("/profile") ||
      location.pathname.includes("/addresses") ||
      location.pathname.includes("/security") ||
      location.pathname.includes("/notifications") ||
      location.pathname.includes("/preferences")

    setActiveTab(isSettings ? "settings" : "overview")
    if (isSettings) {
      setSettingsTab(getSettingsSubTab())
    }
  }, [location.pathname])

  const handleSettingsTabSwitch = (tab: SettingsTab) => {
    setSettingsTab(tab)
    if (tab === "profile") navigate("/account/profile", { replace: true })
    else if (tab === "password") navigate("/account/security", { replace: true })
    else if (tab === "addresses") navigate("/account/addresses", { replace: true })
    else if (tab === "notifications") navigate("/account/settings", { replace: true })
  }

  // Profile Form State
  const [profileName, setProfileName] = useState(user.fullName)
  const [profileEmail, setProfileEmail] = useState(user.email)
  const [profilePhone, setProfilePhone] = useState(user.phone)
  const [profileAltPhone, setProfileAltPhone] = useState("+977 9801234567")
  const [profilePan, setProfilePan] = useState("609823412")
  const [profileWard, setProfileWard] = useState("Ward 03, Lazimpat, Kathmandu")

  // Notification Preferences State
  const [notifSms, setNotifSms] = useState(user.notifications?.smsTracking ?? true)
  const [notifWhatsApp, setNotifWhatsApp] = useState(user.notifications?.whatsAppAlerts ?? true)
  const [notifEmail, setNotifEmail] = useState(user.notifications?.emailUpdates ?? true)
  const [notifPromo, setNotifPromo] = useState(user.notifications?.promotions ?? false)

  // Address Modal State
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addrName, setAddrName] = useState("")
  const [addrProvince, setAddrProvince] =
    useState<NepalProvince>("Bagmati Province")
  const [addrDistrict, setAddrDistrict] = useState("Kathmandu")
  const [addrCity, setAddrCity] = useState("Kathmandu")
  const [addrWard, setAddrWard] = useState("Ward 2")
  const [addrStreet, setAddrStreet] = useState("")
  const [addrPostal, setAddrPostal] = useState("44600")
  const [addrPhone, setAddrPhone] = useState(user.phone)
  const [addrInstructions, setAddrInstructions] = useState("")

  // Security Form State
  const [currentPwd, setCurrentPwd] = useState("")
  const [newPwd, setNewPwd] = useState("")
  const [confirmPwd, setConfirmPwd] = useState("")
  const [showCurrentPwd, setShowCurrentPwd] = useState(false)
  const [showNewPwd, setShowNewPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)

  const handleTabChange = (tab: AccountTab) => {
    setActiveTab(tab)
    if (tab === "overview") navigate("/account")
    else navigate(`/account/${tab}`)
  }

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({
      fullName: profileName,
      email: profileEmail,
      phone: profilePhone,
    })
    notify("Personal profile settings saved successfully!")
  }

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({
      notifications: {
        emailUpdates: notifEmail,
        smsTracking: notifSms,
        whatsAppAlerts: notifWhatsApp,
        deliveryNotices: true,
        promotions: notifPromo,
      },
    })
    notify("Notification preferences saved successfully!")
  }

  const openNewAddressModal = () => {
    setEditingAddressId(null)
    setAddrName(user.fullName)
    setAddrProvince("Bagmati Province")
    setAddrDistrict("Kathmandu")
    setAddrCity("Kathmandu Metro")
    setAddrWard("Ward 3")
    setAddrStreet("")
    setAddrPostal("44600")
    setAddrPhone(user.phone)
    setAddrInstructions("")
    setAddressModalOpen(true)
  }

  const openEditAddressModal = (addr: NepalAddress) => {
    setEditingAddressId(addr.id)
    setAddrName(addr.fullName)
    setAddrProvince(addr.province)
    setAddrDistrict(addr.district)
    setAddrCity(addr.city)
    setAddrWard(addr.ward)
    setAddrStreet(addr.street)
    setAddrPostal(addr.postalCode)
    setAddrPhone(addr.phone)
    setAddrInstructions(addr.deliveryInstructions || "")
    setAddressModalOpen(true)
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!addrStreet.trim()) {
      alert("Please enter a street address.")
      return
    }

    if (editingAddressId) {
      updateAddress(editingAddressId, {
        fullName: addrName,
        province: addrProvince,
        district: addrDistrict,
        city: addrCity,
        ward: addrWard,
        street: addrStreet,
        postalCode: addrPostal,
        phone: addrPhone,
        deliveryInstructions: addrInstructions,
      })
    } else {
      addAddress({
        fullName: addrName,
        phone: addrPhone,
        email: user.email,
        country: "Nepal",
        province: addrProvince,
        district: addrDistrict,
        city: addrCity,
        ward: addrWard,
        street: addrStreet,
        postalCode: addrPostal,
        deliveryInstructions: addrInstructions,
        isDefault: user.addresses.length === 0,
      })
    }
    setAddressModalOpen(false)
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPwd !== confirmPwd) {
      alert("New passwords do not match.")
      return
    }
    notify("Account security credentials updated successfully.")
    setCurrentPwd("")
    setNewPwd("")
    setConfirmPwd("")
  }

  const handleSignOut = () => {
    logout()
    navigate("/login")
  }

  const ordersInProgress = orders.filter(
    (o) => o.fulfillmentStatus !== "Delivered",
  )
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPaid || 0), 0)
  const defaultAddress =
    user.addresses.find((a) => a.isDefault) || user.addresses[0]

  return (
    <div className="ubuy-dash-shell">
      {/* Main Content Area */}
      <div className="dash-main-area">
        {/* Top Dashboard Header Bar - Clean Minimal Page Title */}
        <div className="dash-header-bar">
          <div className="dash-header-left">
            <Heading as="h1">
              {activeTab === "overview" && "Customer Dashboard"}
              {activeTab === "settings" && "Account Settings"}
            </Heading>
            <p>
              {activeTab === "overview" && "Overview of your vehicle build spending, active shipments, and garage orders"}
              {activeTab === "settings" && "Manage your profile edit, password security, saved delivery destinations, and alerts"}
            </p>
          </div>
          <div className="dash-header-right">
            <div className="dash-date-pill">
              <Clock size={14} className="text-amber-500" />
              <span>Sun, 31 Oct 2026</span>
            </div>
            {activeTab === "overview" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/search")}
              >
                <ShoppingBag size={15} /> Browse Catalog
              </Button>
            )}
            {activeTab === "settings" && settingsTab === "addresses" && (
              <Button variant="primary" size="sm" onClick={openNewAddressModal}>
                <Plus size={15} /> Add Address
              </Button>
            )}
          </div>
        </div>

        {/* Customer Account Top Navigation Tabs Bar */}
        <div className="dash-top-tabs-bar" role="tablist" aria-label="Customer account views">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "overview"}
            className={`dash-tab-pill ${activeTab === "overview" ? "is-active" : ""}`}
            onClick={() => {
              setActiveTab("overview")
              navigate("/account")
            }}
          >
            <Package size={15} />
            <span>Orders & Activity</span>
            <span className="dash-tab-badge">{orders.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "settings"}
            className={`dash-tab-pill ${activeTab === "settings" ? "is-active" : ""}`}
            onClick={() => {
              setActiveTab("settings")
              navigate("/account/settings")
            }}
          >
            <UserRound size={15} />
            <span>Profile & Security</span>
          </button>
        </div>

        {/* Clean Minimal Horizontal Settings Navigation Tabs */}
        {activeTab === "settings" && (
          <div className="flex items-center gap-2 border-b border-slate-200/90 pb-3 mb-6 overflow-x-auto">
            <button
              type="button"
              onClick={() => handleSettingsTabSwitch("profile")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                settingsTab === "profile"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <UserRound size={15} />
              <span>Profile Edit</span>
            </button>

            <button
              type="button"
              onClick={() => handleSettingsTabSwitch("password")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                settingsTab === "password"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <KeyRound size={15} />
              <span>Password & Security</span>
            </button>

            <button
              type="button"
              onClick={() => handleSettingsTabSwitch("addresses")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                settingsTab === "addresses"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <MapPin size={15} />
              <span>Saved Addresses</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  settingsTab === "addresses"
                    ? "bg-amber-600 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {user.addresses.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSettingsTabSwitch("notifications")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                settingsTab === "notifications"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Bell size={15} />
              <span>Alerts & Notifications</span>
            </button>
          </div>
        )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-6">
              {/* 4 Summary Metric Cards (Modern Unified Design) */}
              <div className="dash-kpis-grid">
                <div
                  className="dash-kpi-card-modern dash-kpi-card-modern--highlight cursor-pointer"
                  onClick={() => navigate("/account/orders")}
                >
                  <div className="dash-kpi-top">
                    <span className="dash-kpi-label">Total Spent (NPR)</span>
                    <span className="dash-kpi-trend-pill trend-up-white">
                      <ShieldCheck size={12} /> 13% VAT inc
                    </span>
                  </div>
                  <strong className="dash-kpi-val">{formatNpr(totalSpent)}</strong>
                  <span className="dash-kpi-sub">
                    Across {orders.length} verified Nepal shipments
                  </span>
                </div>

                <div
                  className="dash-kpi-card-modern cursor-pointer"
                  onClick={() => navigate("/track-order")}
                >
                  <div className="dash-kpi-top">
                    <span className="dash-kpi-label">Orders in Transit</span>
                    <div className="dash-kpi-icon-box text-amber-600 bg-amber-50">
                      <Truck size={20} />
                    </div>
                  </div>
                  <strong className="dash-kpi-val">{ordersInProgress.length}</strong>
                  <span className="dash-kpi-sub text-amber-600 font-medium">
                    Kathmandu Express active
                  </span>
                </div>

                <div
                  className="dash-kpi-card-modern cursor-pointer"
                  onClick={() => navigate("/wishlist")}
                >
                  <div className="dash-kpi-top">
                    <span className="dash-kpi-label">Saved in Garage</span>
                    <div className="dash-kpi-icon-box text-rose-600 bg-rose-50">
                      <Heart size={20} />
                    </div>
                  </div>
                  <strong className="dash-kpi-val">{wishlistEntries.length}</strong>
                  <span className="dash-kpi-sub text-slate-500">
                    High-voltage components
                  </span>
                </div>

                <div
                  className="dash-kpi-card-modern cursor-pointer"
                  onClick={() => handleTabChange("addresses")}
                >
                  <div className="dash-kpi-top">
                    <span className="dash-kpi-label">Saved Addresses</span>
                    <div className="dash-kpi-icon-box text-emerald-600 bg-emerald-50">
                      <MapPin size={20} />
                    </div>
                  </div>
                  <strong className="dash-kpi-val">{user.addresses.length}</strong>
                  <span className="dash-kpi-sub text-emerald-600 font-medium">
                    Doorstep delivery ready
                  </span>
                </div>
              </div>

              {/* Analytics Split Grid: Interactive SVG Chart + Saved Delivery Hubs */}
              <div className="dash-analytics-split">
                {/* Left: Interactive SVG Chart */}
                <div className="dash-chart-card">
                  <div className="dash-chart-header">
                    <div>
                      <h2 className="dash-chart-title">Build Spending & Logistics Activity</h2>
                      <p className="dash-chart-sub">2026 delivery cycles across Nepal provinces</p>
                    </div>
                    <div className="dash-chart-legend">
                      <span className="flex items-center gap-1.5">
                        <span className="dash-legend-dot bg-amber-500" />
                        <span>Spend (NPR)</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="dash-legend-dot bg-emerald-500" />
                        <span>Delivered</span>
                      </span>
                    </div>
                  </div>

                  <div className="dash-svg-wrapper">
                    <svg viewBox="0 0 640 220" className="dash-svg-chart" aria-label="Customer order curve">
                      <defs>
                        <linearGradient id="custSpendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f58220" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#f58220" stopOpacity="0.0" />
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

                      {/* Area Fill for Customer Spending */}
                      <path
                        d="M 50,155 C 130,145 190,125 260,110 C 330,95 390,100 460,75 C 530,55 570,45 610,30 L 610,170 L 50,170 Z"
                        fill="url(#custSpendGrad)"
                      />
                      {/* Line Curve for Customer Spending */}
                      <path
                        d="M 50,155 C 130,145 190,125 260,110 C 330,95 390,100 460,75 C 530,55 570,45 610,30"
                        fill="none"
                        stroke="#f58220"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Coordinate Dots */}
                      <circle cx="50" cy="155" r="4" fill="#f58220" />
                      <circle cx="260" cy="110" r="4" fill="#f58220" />
                      <circle cx="460" cy="75" r="4" fill="#f58220" />
                      <circle cx="610" cy="30" r="6" fill="#f58220" stroke="#ffffff" strokeWidth="2.5" />

                      {/* Active Tooltip */}
                      <g transform="translate(480, 8)">
                        <rect x="0" y="0" width="125" height="26" rx="8" fill="#0f172a" />
                        <text x="62" y="17" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="700">
                          Latest: NPR 548,300
                        </text>
                      </g>

                      {/* X-axis labels */}
                      <text x="50" y="195" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">May</text>
                      <text x="160" y="195" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">Jun</text>
                      <text x="260" y="195" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">Jul</text>
                      <text x="360" y="195" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">Aug</text>
                      <text x="460" y="195" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">Sep</text>
                      <text x="605" y="195" textAnchor="middle" fill="#f58220" fontSize="11" fontWeight="700">Oct (Active)</text>
                    </svg>
                  </div>
                </div>

                {/* Right: Saved Nepal Delivery Hubs & Addresses */}
                <div className="dash-chart-card">
                  <div className="dash-chart-header">
                    <div>
                      <h2 className="dash-chart-title">Nepal Delivery Hubs</h2>
                      <p className="dash-chart-sub">Doorstep addresses verified for air/courier delivery</p>
                    </div>
                    <button
                      type="button"
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                      onClick={() => handleTabChange("addresses")}
                    >
                      Manage ({user.addresses.length})
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-amber-600 mt-0.5">
                          <MapPin size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <strong className="text-xs font-bold text-slate-900 truncate">
                              {addr.fullName}
                            </strong>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                            {addr.street}, {addr.ward}
                          </p>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            {addr.city}, {addr.province} · {addr.phone}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Orders & Delivery Status Table (Matching Owner Dashboard) */}
              <div className="dash-table-card">
                <div className="dash-table-header-row">
                  <div>
                    <h2 className="dash-chart-title">Recent Orders & Delivery Status</h2>
                    <p className="dash-chart-sub">Track consignments, print 13% Nepal VAT tax invoices, and re-order</p>
                  </div>
                  <AppLink to="/account/orders" className="view-all-link flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700">
                    View All Orders <ArrowRight size={14} />
                  </AppLink>
                </div>

                {/* Filter Chips */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                  {[
                    { id: "all", label: "All Orders" },
                    { id: "in transit", label: "In Transit" },
                    { id: "delivered", label: "Delivered" },
                    { id: "processing", label: "Processing" },
                  ].map((chip) => (
                    <button
                      key={chip.id}
                      type="button"
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors font-medium cursor-pointer ${
                        orderStatusFilter === chip.id
                          ? "bg-slate-900 text-white border-slate-900 font-bold"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                      onClick={() => setOrderStatusFilter(chip.id)}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                <table className="dash-table-modern">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Delivery Destination</th>
                      <th>Total Amount</th>
                      <th>Fulfillment Status</th>
                      <th>Order Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter((order) => {
                        if (orderStatusFilter === "all") return true
                        return order.fulfillmentStatus.toLowerCase().includes(orderStatusFilter.toLowerCase())
                      })
                      .slice(0, 5)
                      .map((order) => {
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
                                {order.deliveryAddress?.city}, {order.deliveryAddress?.province}
                              </div>
                              <div className="text-xs text-slate-500">
                                {order.items.length} item(s): {order.items[0]?.name.slice(0, 32)}...
                              </div>
                            </td>
                            <td>
                              <strong>{formatNpr(order.totalPaid)}</strong>
                              <div className="text-xs text-slate-400">
                                13% Nepal VAT Inc.
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
                              <div className="flex flex-wrap items-center gap-1.5">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() =>
                                    navigate(`/track-order/${order.orderNumber}`)
                                  }
                                >
                                  <Truck size={13} /> Track
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setInvoiceModalOrder(order)}
                                >
                                  <Printer size={13} /> 13% VAT Bill
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => {
                                    order.items.forEach((it) => {
                                      addToCart(it.name, {
                                        quantity: it.quantity,
                                        variant: it.variant,
                                        sku: it.sku,
                                      })
                                    })
                                    notify(`Added ${order.items.length} item(s) to Cart!`)
                                  }}
                                >
                                  <RotateCcw size={13} /> Buy Again
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

          {/* TAB 2: SETTINGS (PROFILE, PASSWORD, ADDRESSES, NOTIFICATIONS TABS INSIDE) */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-6">
              {/* SUBTAB 1: PROFILE EDIT */}
              {settingsTab === "profile" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 max-w-2xl shadow-xs">
                  <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-100">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                      {user.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "AS"}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 m-0">
                        {user.fullName}
                      </h2>
                      <p className="text-xs text-slate-500 m-0">{user.email}</p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mt-1.5 border border-amber-200/60">
                        <ShieldCheck size={12} /> Nepal Verified Account
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleProfileSave} className="space-y-4">
                    <div>
                      <label htmlFor="p-name" className="block text-xs font-bold text-slate-700 mb-1">
                        Full Legal Name
                      </label>
                      <Input
                        id="p-name"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        required
                        className="w-full text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="p-email" className="block text-xs font-bold text-slate-700 mb-1">
                          Email Address
                        </label>
                        <Input
                          id="p-email"
                          type="email"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          required
                          className="w-full text-xs"
                        />
                      </div>

                      <div>
                        <label htmlFor="p-phone" className="block text-xs font-bold text-slate-700 mb-1">
                          Nepal Mobile Phone
                        </label>
                        <Input
                          id="p-phone"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          required
                          className="w-full text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="p-alt-phone" className="block text-xs font-bold text-slate-700 mb-1">
                          Alternate Courier Phone
                        </label>
                        <Input
                          id="p-alt-phone"
                          value={profileAltPhone}
                          onChange={(e) => setProfileAltPhone(e.target.value)}
                          className="w-full text-xs"
                        />
                      </div>

                      <div>
                        <label htmlFor="p-pan" className="block text-xs font-bold text-slate-700 mb-1">
                          13% VAT PAN No. (Optional for Tax Credit)
                        </label>
                        <Input
                          id="p-pan"
                          value={profilePan}
                          onChange={(e) => setProfilePan(e.target.value)}
                          placeholder="e.g. 609823412"
                          className="w-full text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="p-ward" className="block text-xs font-bold text-slate-700 mb-1">
                        Default Delivery Hub & Ward
                      </label>
                      <Input
                        id="p-ward"
                        value={profileWard}
                        onChange={(e) => setProfileWard(e.target.value)}
                        className="w-full text-xs"
                      />
                    </div>

                    <div className="pt-3 flex items-center gap-3">
                      <Button type="submit" variant="primary" size="md" className="font-bold">
                        Save Profile Changes
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        onClick={() => navigate("/account")}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* SUBTAB 2: PASSWORD & SECURITY */}
              {settingsTab === "password" && (
                <div className="flex flex-col gap-6 max-w-2xl">
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      Change Account Password
                    </h3>
                    <p className="text-xs text-slate-500 mb-5">
                      Update your password to keep your ABC EV PART build orders and payment accounts secure.
                    </p>

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label htmlFor="sec-cur" className="block text-xs font-bold text-slate-700 mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <Input
                            id="sec-cur"
                            type={showCurrentPwd ? "text" : "password"}
                            required
                            placeholder="••••••••••••"
                            value={currentPwd}
                            onChange={(e) => setCurrentPwd(e.target.value)}
                            className="w-full text-xs pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none p-0 cursor-pointer"
                          >
                            {showCurrentPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="sec-new" className="block text-xs font-bold text-slate-700 mb-1">
                            New Password
                          </label>
                          <div className="relative">
                            <Input
                              id="sec-new"
                              type={showNewPwd ? "text" : "password"}
                              required
                              placeholder="Min. 8 characters"
                              value={newPwd}
                              onChange={(e) => setNewPwd(e.target.value)}
                              className="w-full text-xs pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPwd(!showNewPwd)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none p-0 cursor-pointer"
                            >
                              {showNewPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="sec-conf" className="block text-xs font-bold text-slate-700 mb-1">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <Input
                              id="sec-conf"
                              type={showConfirmPwd ? "text" : "password"}
                              required
                              placeholder="Re-enter new password"
                              value={confirmPwd}
                              onChange={(e) => setConfirmPwd(e.target.value)}
                              className="w-full text-xs pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none p-0 cursor-pointer"
                            >
                              {showConfirmPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button type="submit" variant="primary" size="md" className="font-bold">
                          Update Password
                        </Button>
                      </div>
                    </form>
                  </div>

                  {/* Two Factor Authentication Card */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-0.5">
                          Two-Factor Authentication (2FA)
                        </h3>
                        <p className="text-xs text-slate-500 m-0">
                          Require an SMS OTP confirmation when placing orders or altering delivery addresses.
                        </p>
                      </div>
                      <Button
                        variant={twoFactorEnabled ? "secondary" : "primary"}
                        size="sm"
                        onClick={() => {
                          setTwoFactorEnabled(!twoFactorEnabled)
                          notify(`2FA ${!twoFactorEnabled ? "Enabled" : "Disabled"}`)
                        }}
                        className="shrink-0"
                      >
                        {twoFactorEnabled ? "2FA Active" : "Enable 2FA"}
                      </Button>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
                    <h3 className="text-sm font-bold text-slate-900 mb-3">
                      Active Login Sessions
                    </h3>
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <Smartphone size={20} className="text-slate-600" />
                        <div>
                          <strong className="block text-xs text-slate-800">
                            Windows PC · Chrome Browser (Current Session)
                          </strong>
                          <span className="text-[11px] text-slate-500">
                            Kathmandu, Nepal · Verified IP: 202.51.88.XX
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        Active Now
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: SAVED ADDRESSES */}
              {settingsTab === "addresses" && (
                <div className="flex flex-col gap-6">
                  <div className="address-book-grid">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`address-book-card ${addr.isDefault ? "is-default" : ""}`}
                      >
                        <div className="addr-card-head">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-amber-500" />
                            <strong>{addr.fullName}</strong>
                          </div>
                          {addr.isDefault && <span className="default-pill">Default</span>}
                        </div>

                        <div className="addr-card-body">
                          <p>{addr.street}, {addr.ward}</p>
                          <p>{addr.city}, {addr.district}</p>
                          <p>{addr.province}, Nepal</p>
                          <p className="phone-line">{addr.phone}</p>
                          {addr.deliveryInstructions && (
                            <p className="instruction-line">Note: {addr.deliveryInstructions}</p>
                          )}
                        </div>

                        <div className="addr-card-actions">
                          {!addr.isDefault && (
                            <button
                              className="action-link-btn"
                              onClick={() => setDefaultAddress(addr.id)}
                              type="button"
                            >
                              Set as Default
                            </button>
                          )}
                          <button
                            className="action-icon-btn"
                            onClick={() => openEditAddressModal(addr)}
                            type="button"
                            title="Edit address"
                          >
                            <Edit2 size={15} />
                          </button>
                          {user.addresses.length > 1 && (
                            <button
                              className="action-icon-btn text-rose-600"
                              onClick={() => {
                                if (confirm("Delete this address?")) deleteAddress(addr.id)
                              }}
                              type="button"
                              title="Delete address"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBTAB 4: ALERTS & NOTIFICATIONS */}
              {settingsTab === "notifications" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 max-w-2xl shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    Dispatch & Notification Preferences
                  </h3>
                  <p className="text-xs text-slate-500 mb-6">
                    Configure real-time courier updates, WhatsApp dispatch alerts, and official tax invoice receipts.
                  </p>

                  <form onSubmit={handleSaveNotifications} className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <div className="text-xs font-bold text-slate-800">WhatsApp Dispatch Tracking</div>
                        <div className="text-[11px] text-slate-500">Receive live GPS courier tracker link via WhatsApp</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifWhatsApp}
                        onChange={(e) => setNotifWhatsApp(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <div className="text-xs font-bold text-slate-800">SMS Doorstep Pre-Call</div>
                        <div className="text-[11px] text-slate-500">Automatic SMS notification 15 minutes before driver arrival</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifSms}
                        onChange={(e) => setNotifSms(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Email VAT Invoices & Receipts</div>
                        <div className="text-[11px] text-slate-500">Automatically attach 13% Nepal VAT tax invoice PDF on dispatch</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifEmail}
                        onChange={(e) => setNotifEmail(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <div className="text-xs font-bold text-slate-800">New EV Parts & Performance Releases</div>
                        <div className="text-[11px] text-slate-500">Notify when new high-voltage inverters, motors, or batteries arrive in Nepal</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifPromo}
                        onChange={(e) => setNotifPromo(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                    </div>

                    <div className="pt-3">
                      <Button type="submit" variant="primary" size="md" className="font-bold">
                        Save Notification Preferences
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
      </div>

      {/* Address Edit/Add Modal */}
      {addressModalOpen && (
        <div
          className="overlay overlay--center"
          onMouseDown={() => setAddressModalOpen(false)}
        >
          <div
            aria-modal="true"
            className="modal address-modal"
            role="dialog"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <Heading as="h3">
                {editingAddressId ? "Edit Address" : "Add New Nepal Address"}
              </Heading>
              <IconButton
                label="Close dialog"
                onClick={() => setAddressModalOpen(false)}
              >
                <X size={20} />
              </IconButton>
            </div>

            <form onSubmit={handleAddressSubmit} className="modal-content">
              <div className="form-group">
                <label>Recipient Name</label>
                <Input
                  value={addrName}
                  onChange={(e) => setAddrName(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Province</label>
                  <select
                    className="select"
                    value={addrProvince}
                    onChange={(e) =>
                      setAddrProvince(e.target.value as NepalProvince)
                    }
                  >
                    {NEPAL_PROVINCES.map((p) => (
                      <option key={p.province} value={p.province}>
                        {p.province}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>District</label>
                  <Input
                    value={addrDistrict}
                    onChange={(e) => setAddrDistrict(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>City / Metro</label>
                  <Input
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Ward No.</label>
                  <Input
                    value={addrWard}
                    onChange={(e) => setAddrWard(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <Input
                    value={addrPostal}
                    onChange={(e) => setAddrPostal(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Street Address / Locality / Landmark</label>
                <Input
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <Input
                  value={addrPhone}
                  onChange={(e) => setAddrPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Delivery Instructions (Gate codes, directions)</label>
                <Input
                  value={addrInstructions}
                  onChange={(e) => setAddrInstructions(e.target.value)}
                  placeholder="e.g. Leave with gate security"
                />
              </div>

              <div className="modal-actions mt-4 flex gap-3">
                <Button type="submit" variant="primary">
                  Save Address
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setAddressModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 13% Nepal VAT Tax Invoice Modal */}
      {invoiceModalOrder && (
        <div
          className="owner-modal-backdrop"
          onClick={() => setInvoiceModalOrder(null)}
        >
          <div
            className="owner-modal-content invoice-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <Heading as="h2" className="modal-title">
                  Official Nepal VAT Tax Invoice
                </Heading>
                <p className="modal-sub">
                  Bill of supply for order #{invoiceModalOrder.orderNumber} · 13% Nepal VAT Included
                </p>
              </div>
              <IconButton
                label="Close"
                onClick={() => setInvoiceModalOrder(null)}
              >
                <X size={20} />
              </IconButton>
            </div>

            <div className="invoice-preview-sheet">
              <div className="invoice-head">
                <div>
                  <div className="invoice-seller-name">ABC EV PART Nepal Pvt. Ltd.</div>
                  <div className="text-xs text-slate-500">
                    Kathmandu Central Logistics Hub, Bagmati Province
                  </div>
                  <div className="text-xs text-slate-700 font-semibold">
                    Nepal IRD PAN / VAT: 601928374
                  </div>
                </div>
                <div className="text-right">
                  <div className="invoice-num">
                    Tax Bill #{invoiceModalOrder.orderNumber}
                  </div>
                  <div className="text-xs text-slate-500">
                    Date: {new Date(invoiceModalOrder.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-emerald-600 font-medium">
                    Status: {invoiceModalOrder.paymentStatus || "Paid in Full"}
                  </div>
                </div>
              </div>

              <div className="invoice-divider" />

              <div className="invoice-customer">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Consignee / Buyer
                </span>
                <strong className="text-sm block text-slate-900">
                  {invoiceModalOrder.deliveryAddress?.fullName || user.fullName}
                </strong>
                <span className="text-xs text-slate-600 block">
                  {invoiceModalOrder.deliveryAddress?.streetAddress},{" "}
                  {invoiceModalOrder.deliveryAddress?.city},{" "}
                  {invoiceModalOrder.deliveryAddress?.province}
                </span>
                <span className="text-xs text-slate-600 block">
                  Contact: {invoiceModalOrder.deliveryAddress?.phone || user.phone}
                </span>
              </div>

              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>EV Component</th>
                    <th>Qty</th>
                    <th>Price (NPR)</th>
                    <th>Total (NPR)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceModalOrder.items.map((it: any) => (
                    <tr key={it.id}>
                      <td>{it.name}</td>
                      <td>{it.quantity}</td>
                      <td>{formatNpr(it.price)}</td>
                      <td>{formatNpr(it.price * it.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="invoice-totals-box">
                <div className="invoice-total-row">
                  <span>Subtotal:</span>
                  <span>{formatNpr(invoiceModalOrder.subtotal)}</span>
                </div>
                <div className="invoice-total-row">
                  <span>Standard 13% Nepal VAT:</span>
                  <span>{formatNpr(invoiceModalOrder.vat)}</span>
                </div>
                <div className="invoice-total-row">
                  <span>Doorstep Courier Fee:</span>
                  <span>
                    {invoiceModalOrder.shippingFee === 0
                      ? "FREE (Included)"
                      : formatNpr(invoiceModalOrder.shippingFee)}
                  </span>
                </div>
                <div className="invoice-total-row grand-total">
                  <strong>Total Paid (NPR):</strong>
                  <strong>{formatNpr(invoiceModalOrder.totalPaid)}</strong>
                </div>
              </div>
            </div>

            <div className="modal-actions mt-4 flex gap-3">
              <Button
                variant="primary"
                onClick={() => {
                  window.print()
                }}
              >
                <Printer size={16} /> Print Tax Bill
              </Button>
              <Button
                variant="secondary"
                onClick={() => setInvoiceModalOrder(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
