import { useEffect } from "react"
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  MapPin,
  Package,
  Printer,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react"
import { useNavigate, useParams } from "react-router"
import { AppLink, Badge, Button, Heading } from "../components/ui"
import { useCommerce } from "../lib/commerceContext"
import { formatNpr } from "../lib/search"

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { getOrderById, orders } = useCommerce()

  const order = getOrderById(orderId || "") || orders[0]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  if (!order) {
    return (
      <div className="container ubuy-checkout-empty">
        <Package size={52} className="text-slate-400 mb-4" />
        <Heading as="h1">Order Not Found</Heading>
        <p>We could not find an order reference matching {orderId}.</p>
        <Button
          onClick={() => navigate("/account/orders")}
          size="lg"
          variant="primary"
        >
          View My Orders
        </Button>
      </div>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="ubuy-confirmation-page container">
      {/* Top Success Hero */}
      <section className="confirmation-hero-card">
        <div className="hero-celebrate-badge">
          <CheckCircle2 size={42} className="text-emerald-500" />
        </div>

        <span className="confirmation-tag">
          <ShieldCheck size={14} className="text-amber-500" />
          Confirmed & Prepared for Nepal Delivery
        </span>

        <Heading as="h1" className="confirmation-heading">
          Thank You! Your Order is Confirmed.
        </Heading>

        <p className="confirmation-subtitle">
          Your order reference{" "}
          <span className="order-ref-pill">{order.orderNumber}</span> has been confirmed. We have sent receipt and dispatch updates to{" "}
          <strong>{order.deliveryAddress.email}</strong>.
        </p>

        {/* Explicit Demo Mode Notice */}
        <div className="confirmation-demo-banner">
          <ShieldCheck size={18} className="text-amber-600 shrink-0" />
          <span>
            <strong>Demo Simulation Notice:</strong> This confirmation confirms
            successful completion of the simulated checkout flow. No live
            financial charge was processed. This order is saved to your demo
            account session for tracking and order management.
          </span>
        </div>

        {/* Quick Action Navigation */}
        <div className="confirmation-hero-ctas">
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate(`/track-order/${order.orderNumber}`)}
          >
            <Truck size={17} /> Track Order{" "}
            <ArrowRight size={16} />
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate(`/account/orders/${order.orderNumber}`)}
          >
            <Package size={17} /> View in My Orders
          </Button>

          <Button size="md" variant="ghost" onClick={handlePrint}>
            <Printer size={16} /> Print Proforma Receipt
          </Button>
        </div>
      </section>

      {/* Two Column Order Snapshot */}
      <div className="confirmation-grid">
        {/* Left Column: Consignment Items & Dispatch Timeline */}
        <div className="confirmation-items-panel">
          <div className="confirmation-card">
            <div className="card-head-row">
              <Heading as="h2">
                Purchased Items (
                {order.items.reduce((s, i) => s + i.quantity, 0)})
              </Heading>
              <span className="order-id-badge">Ref: {order.orderNumber}</span>
            </div>

            <div className="confirmation-item-list">
              {order.items.map((item) => (
                <div key={item.id} className="confirm-item-row">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="confirm-item-img"
                  />
                  <div className="confirm-item-info">
                    <span className="confirm-item-brand">{item.brand}</span>
                    <h3 className="confirm-item-title">
                      <AppLink to={`/product/${item.productId}`}>
                        {item.name}
                      </AppLink>
                    </h3>
                    {item.variant && (
                      <span className="confirm-item-variant">
                        Variant: {item.variant}
                      </span>
                    )}
                    <div className="confirm-item-qty-rate">
                      <span>
                        Qty: {item.quantity} × {formatNpr(item.price)}
                      </span>
                    </div>
                  </div>
                  <div className="confirm-item-total">
                    {formatNpr(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Logistics Timeline Card */}
          <div className="confirmation-card">
            <Heading as="h3">Logistics Route & Express Dispatch</Heading>

            <div className="route-snapshot">
              <div className="route-node">
                <Package size={18} className="text-amber-500" />
                <div>
                  <strong>Origin Hub</strong>
                  <span>Kathmandu Central Hub (Dispatched)</span>
                </div>
              </div>
              <div className="route-connector-line">
                <Truck size={16} />
                <span>{order.shippingMethod.carrier || "Nepal Express Courier"}</span>
              </div>
              <div className="route-node">
                <MapPin size={18} className="text-emerald-500" />
                <div>
                  <strong>Destination</strong>
                  <span>
                    {order.deliveryAddress.city}, {order.deliveryAddress.province}
                  </span>
                </div>
              </div>
            </div>

            <div className="route-meta-grid">
              <div>
                <span className="meta-label">Consignment Tracking:</span>
                <strong className="tracking-number-code">
                  {order.trackingNumber}
                </strong>
              </div>
              <div>
                <span className="meta-label">Estimated Doorstep Arrival:</span>
                <strong className="text-emerald-700">
                  {order.estimatedDeliveryDate}
                </strong>
              </div>
              <div>
                <span className="meta-label">Nepal 13% VAT:</span>
                <strong className="text-slate-800">
                  Included (Tax Invoice)
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial & Recipient Details */}
        <aside className="confirmation-summary-panel">
          {/* Recipient Details */}
          <div className="confirmation-card">
            <Heading as="h3">Recipient & Delivery Details</Heading>
            <div className="recipient-info-box">
              <p>
                <strong>{order.deliveryAddress.fullName}</strong>
              </p>
              <p>
                {order.deliveryAddress.street}, {order.deliveryAddress.ward}
              </p>
              <p>
                {order.deliveryAddress.city}, {order.deliveryAddress.district}
              </p>
              <p>{order.deliveryAddress.province}, Nepal</p>
              <p className="mt-2 text-slate-700">
                Contact: <strong>{order.deliveryAddress.phone}</strong>
              </p>
              {order.deliveryAddress.deliveryInstructions && (
                <div className="delivery-note-bubble">
                  <span>
                    Note: "{order.deliveryAddress.deliveryInstructions}"
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="confirmation-card">
            <Heading as="h3">Payment Summary</Heading>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Product Subtotal</span>
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
                <strong className="text-amber-600 text-lg">
                  {formatNpr(order.totalPaid)}
                </strong>
              </div>
            </div>

            <div className="payment-receipt-badge">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>
                Verified via {order.paymentMethod.toUpperCase()} · 13% VAT Paid
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
