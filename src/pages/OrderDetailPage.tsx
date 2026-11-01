import { useEffect } from "react"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  HelpCircle,
  MapPin,
  Package,
  Printer,
  RotateCcw,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react"
import { useNavigate, useParams } from "react-router"
import { AppLink, Badge, Button, Heading } from "../components/ui"
import { useCommerce } from "../lib/commerceContext"
import { formatNpr } from "../lib/search"

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { getOrderById, addToCart, notify } = useCommerce()

  const order = getOrderById(orderId || "")

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  if (!order) {
    return (
      <div className="container ubuy-checkout-empty">
        <Package size={52} className="text-slate-400 mb-4" />
        <Heading as="h1">Order Not Found</Heading>
        <p>
          No order record matching reference "{orderId}" was found in your
          account.
        </p>
        <Button
          onClick={() => navigate("/account/orders")}
          size="lg"
          variant="primary"
        >
          Back to My Orders
        </Button>
      </div>
    )
  }

  const isDelivered = order.fulfillmentStatus === "Delivered"

  const handleReorder = () => {
    order.items.forEach((item) => {
      addToCart(item.name, {
        quantity: item.quantity,
        variant: item.variant,
        sku: item.productId,
      })
    })
    notify(`Added ${order.items.length} items to your Cart`)
    navigate("/cart")
  }

  return (
    <div className="ubuy-order-detail-page container">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="ubuy-breadcrumbs">
        <AppLink to="/">Home</AppLink>
        <ChevronRight size={14} className="crumb-sep" />
        <AppLink to="/account">My Account</AppLink>
        <ChevronRight size={14} className="crumb-sep" />
        <AppLink to="/account/orders">My Orders</AppLink>
        <ChevronRight size={14} className="crumb-sep" />
        <span className="crumb-active">{order.orderNumber}</span>
      </nav>

      {/* Order Header Card */}
      <div className="order-detail-header-card">
        <div className="detail-header-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="detail-ref-badge">Order Consignment</span>
            <span className="detail-demo-tag">Verified Order · 13% VAT Paid</span>
          </div>
          <Heading as="h1">{order.orderNumber}</Heading>
          <div className="detail-header-sub">
            <span>
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>·</span>
            <span className="text-slate-600">
              Air Waybill: <strong>{order.trackingNumber}</strong>
            </span>
          </div>
        </div>

        <div className="detail-header-right">
          <Button
            size="md"
            variant="primary"
            onClick={() => navigate(`/track-order/${order.orderNumber}`)}
          >
            <Truck size={16} /> Track Shipment
          </Button>
          <Button size="md" variant="secondary" onClick={() => window.print()}>
            <Printer size={16} /> Print Tax Receipt
          </Button>
          <Button size="md" variant="ghost" onClick={handleReorder}>
            <RotateCcw size={16} /> Reorder All Items
          </Button>
        </div>
      </div>

      {/* Progress Mini Status Bar */}
      <div className="order-status-banner-card">
        <div className="status-banner-left">
          <div className="status-icon-circle">
            {isDelivered ? (
              <CheckCircle2 size={24} className="text-emerald-500" />
            ) : (
              <Truck size={24} className="text-amber-500" />
            )}
          </div>
          <div>
            <strong>Logistics Status: {order.fulfillmentStatus}</strong>
            <p>
              {isDelivered
                ? `Consignment safely signed and delivered to ${order.deliveryAddress.city}, Nepal.`
                : `Consignment en route via ${order.carrier}. Estimated arrival: ${order.estimatedDeliveryDate}.`}
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate(`/track-order/${order.orderNumber}`)}
        >
          View Live Tracking Milestones <ArrowRight size={14} />
        </Button>
      </div>

      {/* Main Two-Column Detail Layout */}
      <div className="order-detail-layout-grid">
        {/* Left Column: Purchased Items List */}
        <div className="order-detail-items-panel">
          <div className="detail-card">
            <Heading as="h2" className="card-inner-title">
              Purchased Components (
              {order.items.reduce((s, i) => s + i.quantity, 0)})
            </Heading>

            <div className="detail-items-table">
              {order.items.map((item) => (
                <article key={item.id} className="detail-item-row">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="detail-item-thumbnail"
                  />
                  <div className="detail-item-body">
                    <span className="detail-item-brand">{item.brand.replace(/VoltCraft/g, "ABC EV")}</span>
                    <h3 className="detail-item-name">
                      <AppLink to={`/product/${item.productId}`}>
                        {item.name.replace(/VoltCraft/g, "ABC EV")}
                      </AppLink>
                    </h3>
                    {item.variant && (
                      <div className="detail-item-spec">
                        <span>Config: {item.variant}</span>
                        {item.sku && <span>· SKU: {item.sku}</span>}
                      </div>
                    )}
                    <div className="detail-item-price-calc">
                      <span>
                        Historical Unit Price: {formatNpr(item.price)}
                      </span>
                      <span>·</span>
                      <span>Quantity: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="detail-item-line-total">
                    {formatNpr(item.price * item.quantity)}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="detail-card">
            <Heading as="h3" className="card-inner-title">
              Delivery Destination & Recipient in Nepal
            </Heading>
            <div className="detail-address-grid">
              <div>
                <span className="field-meta-label">Recipient Name:</span>
                <strong>{order.deliveryAddress.fullName}</strong>
                <span className="field-meta-label mt-2">
                  Delivery Locality:
                </span>
                <p>
                  {order.deliveryAddress.street}, {order.deliveryAddress.ward}
                </p>
                <p>
                  {order.deliveryAddress.city}, {order.deliveryAddress.district}
                </p>
                <p>{order.deliveryAddress.province}, Nepal</p>
              </div>

              <div>
                <span className="field-meta-label">Recipient Contact:</span>
                <p className="font-medium text-slate-800">
                  {order.deliveryAddress.phone}
                </p>
                <p className="text-slate-600 text-sm">
                  {order.deliveryAddress.email}
                </p>

                {order.deliveryAddress.deliveryInstructions && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-200">
                    <strong>Courier Instructions:</strong>{" "}
                    {order.deliveryAddress.deliveryInstructions}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Actions */}
        <aside className="order-detail-summary-panel">
          <div className="detail-card">
            <Heading as="h3" className="card-inner-title">
              Payment & Order Summary
            </Heading>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Products Subtotal</span>
                <span>{formatNpr(order.subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Nepal Delivery Fee</span>
                <span>{order.shippingFee === 0 ? "Free" : formatNpr(order.shippingFee)}</span>
              </div>
              <div className="summary-row">
                <span>Nepal VAT (13%)</span>
                <span>{formatNpr(order.vat)}</span>
              </div>
              {order.discount > 0 && (
                <div className="summary-row summary-row--discount">
                  <span>Discount</span>
                  <span>− {formatNpr(order.discount)}</span>
                </div>
              )}
              <div className="summary-divider" />
              <div className="summary-row summary-row--total">
                <span>Total Paid (NPR)</span>
                <strong className="text-xl text-amber-600">
                  {formatNpr(order.totalPaid)}
                </strong>
              </div>
            </div>

            <div className="payment-confirmation-banner mt-4">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <div>
                <strong>
                  Payment Settled via {order.paymentMethod.toUpperCase()}
                </strong>
                <p className="text-xs text-slate-500">
                  All VAT and delivery fees included.
                </p>
              </div>
            </div>
          </div>

          {/* Need Assistance Card */}
          <div className="detail-card">
            <Heading
              as="h4"
              className="card-inner-title flex items-center gap-2"
            >
              <HelpCircle size={16} className="text-amber-500" />
              Need Assistance with this Order?
            </Heading>
            <p className="text-xs text-slate-600 mb-3">
              Our Kathmandu support desk can assist with order inquiries, invoicing, or warranty claims.
            </p>
            <AppLink
              to={`/contact?orderId=${order.orderNumber}`}
              className="button button--secondary w-full text-center"
            >
              Contact Support
            </AppLink>
          </div>
        </aside>
      </div>
    </div>
  )
}
