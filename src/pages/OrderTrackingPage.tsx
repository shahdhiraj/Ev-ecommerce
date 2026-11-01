import { useEffect, useState } from "react"
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  HelpCircle,
  MapPin,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  Truck,
  Zap,
} from "lucide-react"
import { useNavigate, useParams } from "react-router"
import {
  AppLink,
  Badge,
  Button,
  Heading,
  Input,
  Select,
} from "../components/ui"
import { useCommerce } from "../lib/commerceContext"
import { generateTrackingCheckpoints, type Order } from "../lib/commerceStore"
import { formatNpr } from "../lib/search"

export function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { orders, getOrderById, notify } = useCommerce()

  const [lookupQuery, setLookupQuery] = useState(orderId || "")
  const [selectedOrder, setSelectedOrder] = useState<Order>(() => {
    if (orderId) {
      const match = getOrderById(orderId)
      if (match) return match
    }
    return orders[0]
  })

  const [trackingAlertSubscribed, setTrackingAlertSubscribed] = useState(false)

  // Update selected order if URL parameter changes
  useEffect(() => {
    if (orderId) {
      const match = getOrderById(orderId)
      if (match) {
        setSelectedOrder(match)
        setLookupQuery(orderId)
      }
    }
  }, [orderId, orders])

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = lookupQuery.trim()
    if (!query) return

    const matched = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === query.toLowerCase() ||
        o.trackingNumber.toLowerCase() === query.toLowerCase(),
    )

    if (matched) {
      setSelectedOrder(matched)
      navigate(`/track-order/${matched.orderNumber}`)
    } else {
      alert(
        `No order found matching "${query}". Please check your order reference.`,
      )
    }
  }

  const checkpoints = generateTrackingCheckpoints(selectedOrder)
  const isDelivered = selectedOrder.fulfillmentStatus === "Delivered"

  return (
    <div className="ubuy-tracking-page container">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="ubuy-breadcrumbs">
        <AppLink to="/">Home</AppLink>
        <ChevronRight size={14} className="crumb-sep" />
        <AppLink to="/account">My Account</AppLink>
        <ChevronRight size={14} className="crumb-sep" />
        <span className="crumb-active">Order Tracking</span>
      </nav>

      {/* Page Header */}
      <div className="tracking-header-row">
        <div>
          <Heading as="h1">Order Tracking</Heading>
          <p className="tracking-subtext">
            Track real-time courier dispatch and doorstep delivery progress across Nepal.
          </p>
        </div>

        {/* Live Tracking Status */}
        <div className="tracking-demo-pill">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>Live Tracking — Verified Nepal Courier Logistics</span>
        </div>
      </div>

      {/* Lookup & Quick Selector Bar */}
      <div className="tracking-lookup-bar">
        <form className="tracking-search-form" onSubmit={handleLookupSubmit}>
          <div className="lookup-input-wrap">
            <Search size={17} className="lookup-search-icon" />
            <Input
              placeholder="Enter Order Reference (e.g. UB-NP-902148) or Tracking No..."
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
            />
          </div>
          <Button size="md" variant="primary" type="submit">
            Track Order
          </Button>
        </form>

        {/* Order Quick Dropdown */}
        {orders.length > 0 && (
          <div className="quick-order-picker">
            <span className="quick-picker-label">
              Switch between your active orders:
            </span>
            <select
              className="select select-compact"
              value={selectedOrder.orderNumber}
              onChange={(e) => {
                const match = orders.find(
                  (o) => o.orderNumber === e.target.value,
                )
                if (match) {
                  setSelectedOrder(match)
                  navigate(`/track-order/${match.orderNumber}`)
                }
              }}
            >
              {orders.map((o) => (
                <option key={o.id} value={o.orderNumber}>
                  {o.orderNumber} ({o.fulfillmentStatus}) —{" "}
                  {o.deliveryAddress.city}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Active Shipment Overview Card */}
      <section className="shipment-overview-card">
        <div className="overview-main-head">
          <div className="overview-title-meta">
            <span className="overview-label">Consignment Reference</span>
            <h2 className="overview-order-id">{selectedOrder.orderNumber}</h2>
            <div className="overview-carrier-line">
              <span className="carrier-badge">{selectedOrder.carrier}</span>
              <span className="airway-bill">
                Tracking No: <strong>{selectedOrder.trackingNumber}</strong>
              </span>
            </div>
          </div>

          <div className="overview-status-badge-wrap">
            <Badge
              tone={
                isDelivered
                  ? "success"
                  : selectedOrder.fulfillmentStatus === "In Transit"
                    ? "brand"
                    : "neutral"
              }
            >
              {selectedOrder.fulfillmentStatus}
            </Badge>
            <div className="last-scan-time">
              <Clock size={13} className="text-slate-400" />
              <span>Last Updated: 28 mins ago</span>
            </div>
          </div>
        </div>

        {/* Origin to Destination Route Bar */}
        <div className="logistics-route-bar">
          <div className="route-step route-step--origin">
            <div className="route-circle">
              <Package size={16} />
            </div>
            <div className="route-info">
              <span className="route-label">Origin Hub</span>
              <strong className="route-city">{selectedOrder.originHub || "Kathmandu Hub"}</strong>
              <small className="route-note">Dispatched from warehouse</small>
            </div>
          </div>

          <div className="route-transit-line">
            <div className="airplane-flight-icon">
              <Truck size={18} />
            </div>
            <span className="transit-line-text">
              Domestic Courier Transit
            </span>
          </div>

          <div className="route-step route-step--destination">
            <div className="route-circle">
              <MapPin size={16} />
            </div>
            <div className="route-info">
              <span className="route-label">Destination Address</span>
              <strong className="route-city">
                {selectedOrder.deliveryAddress.city},{" "}
                {selectedOrder.deliveryAddress.province}
              </strong>
              <small className="route-note">
                Recipient: {selectedOrder.deliveryAddress.fullName}
              </small>
            </div>
          </div>
        </div>

        {/* Milestone Meta Stats */}
        <div className="shipment-stats-grid">
          <div className="stat-box">
            <span className="stat-caption">Estimated Doorstep Delivery</span>
            <strong className="stat-val text-emerald-700">
              {isDelivered
                ? "Delivered & Signed"
                : selectedOrder.estimatedDeliveryDate}
            </strong>
          </div>
          <div className="stat-box">
            <span className="stat-caption">Nepal 13% VAT Status</span>
            <strong className="stat-val text-slate-800">
              100% Included · Tax Invoice Issued
            </strong>
          </div>
          <div className="stat-box">
            <span className="stat-caption">Delivery Scope</span>
            <strong className="stat-val text-slate-800">
              All 7 Provinces in Nepal
            </strong>
          </div>
          <div className="stat-box">
            <span className="stat-caption">Courier Dispatch Service</span>
            <strong className="stat-val text-slate-800">
              {selectedOrder.shippingMethod.name}
            </strong>
          </div>
        </div>
      </section>

      {/* Two Column Layout: Timeline and Details */}
      <div className="tracking-details-grid">
        {/* Left Column: Vertical Milestone Timeline */}
        <div className="tracking-timeline-column">
          <div className="timeline-card">
            <div className="timeline-head-row">
              <Heading as="h2">Delivery Transit Timeline</Heading>
              <button
                className="refresh-timeline-btn"
                onClick={() =>
                  notify(
                    "Tracking status refreshed with latest courier updates",
                  )
                }
                type="button"
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            <div className="vertical-timeline-flow">
              {checkpoints.map((checkpoint, index) => {
                return (
                  <div
                    key={checkpoint.id}
                    className={`timeline-milestone ${
                      checkpoint.completed ? "is-completed" : ""
                    } ${checkpoint.current ? "is-current" : ""}`}
                  >
                    <div className="timeline-marker">
                      <div className="marker-dot">
                        {checkpoint.completed ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <div className="inner-dot" />
                        )}
                      </div>
                      {index < checkpoints.length - 1 && (
                        <div className="marker-line" />
                      )}
                    </div>

                    <div className="timeline-content">
                      <div className="milestone-title-row">
                        <h3 className="milestone-title">{checkpoint.title}</h3>
                        <span className="milestone-time">
                          {checkpoint.timestamp}
                        </span>
                      </div>
                      <div className="milestone-location">
                        <MapPin size={13} className="text-amber-500" />
                        <span>{checkpoint.location}</span>
                      </div>
                      <p className="milestone-desc">{checkpoint.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Nepal Delivery & Package Details */}
        <aside className="tracking-sidebar-column">
          {/* Nepal Delivery & Tax Details */}
          <div className="tracking-side-card">
            <div className="side-card-head">
              <ShieldCheck size={18} className="text-amber-500" />
              <Heading as="h3">Nepal Doorstep Delivery</Heading>
            </div>

            <p className="side-card-text">
              Direct delivery dispatched to{" "}
              <strong>
                {selectedOrder.deliveryAddress.city},{" "}
                {selectedOrder.deliveryAddress.province}
              </strong>.
            </p>

            <div className="customs-specs-list">
              <div className="spec-row">
                <span>Delivery Scope</span>
                <strong>Nepal (All 7 Provinces)</strong>
              </div>
              <div className="spec-row">
                <span>Inland Revenue VAT</span>
                <strong className="text-emerald-700">13% VAT Included</strong>
              </div>
              <div className="spec-row">
                <span>Doorstep Delivery Fee</span>
                <strong className="text-emerald-700">
                  {selectedOrder.shippingFee === 0
                    ? "Free Delivery"
                    : formatNpr(selectedOrder.shippingFee)}
                </strong>
              </div>
              <div className="spec-row">
                <span>Recipient Contact</span>
                <strong>{selectedOrder.deliveryAddress.phone}</strong>
              </div>
            </div>

            <AppLink to="/help/shipping" className="customs-link-btn">
              Read Nepal Delivery Guide <ArrowRight size={13} />
            </AppLink>
          </div>

          {/* SMS Notifications */}
          <div className="tracking-side-card">
            <div className="side-card-head">
              <Bell size={18} className="text-amber-500" />
              <Heading as="h3">Delivery Notifications</Heading>
            </div>
            <p className="side-card-text">
              Receive automated SMS alerts when your package is out for delivery with the local courier driver in Nepal.
            </p>

            <Button
              variant={trackingAlertSubscribed ? "secondary" : "primary"}
              className="w-full mt-3"
              onClick={() => {
                setTrackingAlertSubscribed(!trackingAlertSubscribed)
                notify(
                  trackingAlertSubscribed
                    ? "Subscribed alerts disabled"
                    : "Subscribed to live SMS delivery alerts",
                )
              }}
            >
              <Smartphone size={16} />
              {trackingAlertSubscribed
                ? "Alerts Active (Subscribed)"
                : "Enable Live SMS Alerts"}
            </Button>
          </div>

          {/* Package Contents Breakdown */}
          <div className="tracking-side-card">
            <div className="side-card-head">
              <Package size={18} className="text-amber-500" />
              <Heading as="h3">
                Package Items ({selectedOrder.items.length})
              </Heading>
            </div>

            <div className="sidebar-package-items">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="pkg-item-row">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <strong className="block text-xs text-slate-800 line-clamp-1">
                      {item.name.replace(/VoltCraft/g, "ABC EV")}
                    </strong>
                    <span className="text-xs text-slate-500">
                      Qty {item.quantity} · {formatNpr(item.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="sidebar-total-line">
              <span>Total Declared Value:</span>
              <strong>{formatNpr(selectedOrder.totalPaid)}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
