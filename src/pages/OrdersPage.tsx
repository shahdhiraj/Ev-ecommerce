import { useMemo, useState } from "react"
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Package,
  RotateCcw,
  Search,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react"
import { useNavigate } from "react-router"
import {
  AppLink,
  Badge,
  Button,
  Heading,
  Input,
  Select,
} from "../components/ui"
import { useCommerce } from "../lib/commerceContext"
import type { Order } from "../lib/commerceStore"
import { formatNpr } from "../lib/search"

export function OrdersPage() {
  const navigate = useNavigate()
  const { orders, addToCart, notify } = useCommerce()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] =
    useState<"All" | "Processing" | "In Transit" | "Delivered">("All")
  const [timeFilter, setTimeFilter] = useState("all")

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesId = order.orderNumber.toLowerCase().includes(q)
        const matchesItem = order.items.some(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.brand.toLowerCase().includes(q),
        )
        if (!matchesId && !matchesItem) return false
      }

      // Status filter
      if (
        statusFilter === "Processing" &&
        order.fulfillmentStatus !== "Order Placed"
      )
        return false
      if (
        statusFilter === "In Transit" &&
        order.fulfillmentStatus !== "In Transit" &&
        order.fulfillmentStatus !== "Out for Delivery"
      )
        return false
      if (
        statusFilter === "Delivered" &&
        order.fulfillmentStatus !== "Delivered"
      )
        return false

      return true
    })
  }, [orders, searchQuery, statusFilter])

  // Reorder all items from an order
  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.name, {
        quantity: item.quantity,
        variant: item.variant,
        sku: item.productId,
      })
    })
    notify(
      `Added ${order.items.length} items from ${order.orderNumber} to your Cart`,
    )
    navigate("/cart")
  }

  return (
    <div className="ubuy-orders-page container">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="ubuy-breadcrumbs">
        <AppLink to="/">Home</AppLink>
        <ChevronRight size={14} className="crumb-sep" />
        <AppLink to="/account">My Account</AppLink>
        <ChevronRight size={14} className="crumb-sep" />
        <span className="crumb-active">My Orders</span>
      </nav>

      {/* Orders Header */}
      <div className="orders-header-row">
        <div>
          <Heading as="h1">My Orders</Heading>
          <p className="orders-subtitle">
            View past purchases, track courier delivery status, and access tax invoices.
          </p>
        </div>

        <div className="orders-header-stat">
          <span className="stat-label">Total Completed Builds</span>
          <strong className="stat-number">{orders.length}</strong>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="orders-filter-bar">
        <div className="orders-search-input-wrap">
          <Search size={16} className="search-icon" />
          <Input
            placeholder="Search by order reference (e.g. UB-NP) or product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="orders-status-tabs" role="tablist">
          {(["All", "In Transit", "Delivered", "Processing"] as const).map(
            (tab) => (
              <button
                key={tab}
                className={`status-tab-btn ${
                  statusFilter === tab ? "is-active" : ""
                }`}
                onClick={() => setStatusFilter(tab)}
                type="button"
                role="tab"
                aria-selected={statusFilter === tab}
              >
                {tab}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="orders-empty-card">
          <Package size={48} className="text-slate-400 mb-3" />
          <Heading as="h2">No Orders Found</Heading>
          <p>We couldn't find any orders matching your selected criteria.</p>
          <Button
            variant="secondary"
            onClick={() => {
              setSearchQuery("")
              setStatusFilter("All")
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="orders-cards-list">
          {filteredOrders.map((order) => {
            const isDelivered = order.fulfillmentStatus === "Delivered"
            return (
              <article key={order.id} className="customer-order-card">
                {/* Card Top Header */}
                <div className="order-card-top">
                  <div className="order-main-meta">
                    <span className="order-id-title">{order.orderNumber}</span>
                    <span className="order-date-text">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="order-badges-group">
                    {/* Payment Status Badge */}
                    <span className="payment-status-pill">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      {order.paymentStatus}
                    </span>

                    {/* Fulfillment Status Badge */}
                    <Badge
                      tone={
                        isDelivered
                          ? "success"
                          : order.fulfillmentStatus === "In Transit"
                            ? "brand"
                            : "neutral"
                      }
                    >
                      {order.fulfillmentStatus}
                    </Badge>
                  </div>
                </div>

                {/* Items Preview Grid */}
                <div className="order-card-items-grid">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-product-snapshot">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="product-snapshot-thumb"
                      />
                      <div className="product-snapshot-info">
                        <span className="product-snapshot-brand">
                          {item.brand.replace(/VoltCraft/g, "ABC EV")}
                        </span>
                        <h4 className="product-snapshot-title">
                          <AppLink to={`/product/${item.productId}`}>
                            {item.name.replace(/VoltCraft/g, "ABC EV")}
                          </AppLink>
                        </h4>
                        {item.variant && (
                          <span className="product-snapshot-variant">
                            Config: {item.variant}
                          </span>
                        )}
                        <span className="product-snapshot-qty">
                          Qty: {item.quantity} · Historical Price:{" "}
                          {formatNpr(item.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Logistics & Bottom Actions */}
                <div className="order-card-bottom">
                  <div className="order-logistics-snapshot">
                    <div className="logistics-destination">
                      <Truck size={16} className="text-amber-500" />
                      <span>
                        Destination:{" "}
                        <strong>{order.deliveryAddress.city}, Nepal</strong> ·
                        via {order.carrier}
                      </span>
                    </div>
                    <div className="logistics-eta">
                      <Clock size={15} className="text-slate-500" />
                      <span>
                        {isDelivered ? "Delivered on" : "Estimated Arrival:"}{" "}
                        <strong>{order.estimatedDeliveryDate}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="order-card-actions">
                    <div className="order-total-block">
                      <span className="total-label">Landed Total Paid:</span>
                      <strong className="total-amount-val">
                        {formatNpr(order.totalPaid)}
                      </strong>
                    </div>

                    <div className="action-buttons-wrap">
                      <Button
                        size="md"
                        variant="secondary"
                        onClick={() =>
                          navigate(`/track-order/${order.orderNumber}`)
                        }
                      >
                        <Truck size={15} /> Track Shipment
                      </Button>

                      <Button
                        size="md"
                        variant="primary"
                        onClick={() =>
                          navigate(`/account/orders/${order.orderNumber}`)
                        }
                      >
                        View Order Details <ArrowRight size={15} />
                      </Button>

                      <button
                        className="reorder-btn"
                        onClick={() => handleReorder(order)}
                        type="button"
                        title="Reorder all items"
                      >
                        <RotateCcw size={15} /> Reorder
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
