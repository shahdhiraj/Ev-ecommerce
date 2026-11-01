import { useState } from "react"
import {
  ArrowRight,
  Check,
  ChevronRight,
  Heart,
  HelpCircle,
  Info,
  MapPin,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  Zap,
} from "lucide-react"
import { useNavigate } from "react-router"
import {
  AppLink,
  Badge,
  Button,
  Heading,
  IconButton,
  Input,
  Select,
} from "../components/ui"
import { catalogue, type Product } from "../data/catalog"
import { useCommerce } from "../lib/commerceContext"
import { NEPAL_PROVINCES, type NepalProvince } from "../lib/commerceStore"
import { formatNpr } from "../lib/search"

export function CartPage() {
  const navigate = useNavigate()
  const {
    cartItems,
    cartCount,
    removeFromCart,
    updateQuantity,
    saveForLater,
    undoLastRemove,
    lastRemovedItem,
    clearCart,
    deliveryDestination,
    setDeliveryDestination,
    selectedShipping,
    appliedPromo,
    applyPromo,
    removePromo,
    totals,
    viewProduct,
    addToCart,
  } = useCommerce()

  const [promoInput, setPromoInput] = useState("")
  const [promoMessage, setPromoMessage] = useState<{
    text: string
    isError?: boolean
  } | null>(null)

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoInput.trim()) return
    const result = applyPromo(promoInput)
    if (result.success) {
      setPromoMessage({ text: result.message, isError: false })
      setPromoInput("")
    } else {
      setPromoMessage({ text: result.message, isError: true })
    }
  }

  // Related products from catalogue not in cart
  const cartProductIds = new Set(cartItems.map((item) => item.productId))
  const relatedProducts = catalogue
    .filter((item) => !cartProductIds.has(item.id))
    .slice(0, 4)

  const selectedProvinceData =
    NEPAL_PROVINCES.find((p) => p.province === deliveryDestination.province) ||
    NEPAL_PROVINCES[0]

  return (
    <div className="ubuy-cart-page container">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="ubuy-breadcrumbs">
        <AppLink to="/">Home</AppLink>
        <ChevronRight size={14} className="crumb-sep" />
        <span className="crumb-active">Shopping Cart</span>
      </nav>

      {/* 4-Step Buying Process Stepper */}
      <div className="cart-progress-stepper" aria-label="Purchase progress">
        <div className="cart-step is-active">
          <span className="cart-step-circle">1</span>
          <span className="cart-step-label">Shopping Cart</span>
        </div>
        <div className="cart-step-line" />
        <div className="cart-step">
          <span className="cart-step-circle">2</span>
          <span className="cart-step-label">Nepal Address</span>
        </div>
        <div className="cart-step-line" />
        <div className="cart-step">
          <span className="cart-step-circle">3</span>
          <span className="cart-step-label">Fonepay / eSewa</span>
        </div>
        <div className="cart-step-line" />
        <div className="cart-step">
          <span className="cart-step-circle">4</span>
          <span className="cart-step-label">Doorstep Delivery</span>
        </div>
      </div>

      {/* Undo Notification Banner */}
      {lastRemovedItem && (
        <div className="ubuy-undo-banner">
          <div className="undo-content">
            <Info size={18} className="text-amber-600" />
            <span>
              Removed <strong>{lastRemovedItem.name}</strong> from your cart.
            </span>
          </div>
          <button
            className="undo-action-btn"
            onClick={undoLastRemove}
            type="button"
          >
            <RotateCcw size={15} />
            <span>Undo</span>
          </button>
        </div>
      )}

      {/* Page Title & Status */}
      <div className="cart-page-header">
        <div>
          <Heading as="h1" className="cart-title">
            Shopping Cart
          </Heading>
          <p className="cart-subtitle-text">
            Review your items and proceed to checkout.
          </p>
        </div>
        {cartItems.length > 0 && (
          <div className="cart-header-actions">
            <span className="cart-items-count-badge">
              {cartCount} {cartCount === 1 ? "Item" : "Items"}
            </span>
            <button
              className="clear-cart-btn"
              onClick={clearCart}
              type="button"
            >
              <Trash2 size={14} /> Clear Cart
            </button>
          </div>
        )}
      </div>

      {cartItems.length === 0 ? (
        /* Empty Cart State */
        <section className="cart-empty-card">
          <div className="empty-cart-visual">
            <div className="empty-cart-icon-wrap">
              <ShoppingBag size={48} className="empty-icon" />
            </div>
            <Heading as="h2">Your Cart Is Waiting.</Heading>
            <p>
              Discover something you'll love and start shopping from the world's
              leading brands.
            </p>
            <div className="empty-cart-ctas">
              <Button
                onClick={() => navigate("/search")}
                size="lg"
                variant="primary"
              >
                Explore Products <ArrowRight size={16} />
              </Button>
              <Button
                onClick={() => navigate("/wishlist")}
                size="lg"
                variant="secondary"
              >
                <Heart size={16} /> View Wishlist
              </Button>
            </div>
          </div>

          {/* Quick jump category pills */}
          <div className="empty-quick-categories">
            <span className="quick-label">Trending Categories in Nepal:</span>
            <div className="quick-category-pills">
              <AppLink
                to="/search?subcategory=Powertrain+%26+Motors"
                className="cat-pill"
              >
                <Zap size={14} /> Powertrain & Motors
              </AppLink>
              <AppLink
                to="/search?subcategory=Battery+%26+BMS"
                className="cat-pill"
              >
                <Package size={14} /> High-Voltage Batteries
              </AppLink>
              <AppLink
                to="/search?subcategory=Charging+%26+Wallboxes"
                className="cat-pill"
              >
                <Truck size={14} /> 22kW Home Wallboxes
              </AppLink>
              <AppLink
                to="/search?subcategory=Brakes+%26+Suspension"
                className="cat-pill"
              >
                <ShieldCheck size={14} /> Carbon-Ceramic Brakes
              </AppLink>
            </div>
          </div>
        </section>
      ) : (
        /* Main Two-Column Cart Layout */
        <div className="cart-layout-grid">
          {/* Left Column: Cart Items & Nepal Delivery Options */}
          <div className="cart-items-column">
            {/* Free Shipping / Threshold Progress Banner */}
            <div className="cart-priority-banner">
              <div className="priority-banner-icon">
                <Truck size={20} />
              </div>
              <div className="priority-banner-body">
                <div className="priority-banner-title">
                  <strong>Express Air Delivery to Nepal</strong>
                  <span className="transit-badge">
                    {selectedShipping.transitTime}
                  </span>
                </div>
                <p>
                  Direct air cargo with end-to-end tracking to your doorstep.
                </p>
              </div>
            </div>

            {/* Cart Items List */}
            <div
              className="cart-items-list"
              role="list"
              aria-label="Shopping cart items"
            >
              {cartItems.map((item) => (
                <article
                  className="cart-item-card"
                  key={item.id}
                  role="listitem"
                >
                  <div className="item-thumbnail-wrap">
                    <img
                      alt={item.name}
                      className="item-thumbnail"
                      src={item.image}
                    />
                    {item.voltage && (
                      <span className="item-voltage-tag">{item.voltage}</span>
                    )}
                  </div>

                  <div className="item-details">
                    <div className="item-top-row">
                      <div className="item-brand-row">
                        <span className="item-brand-name">{item.brand}</span>
                        {item.sku && (
                          <span className="item-sku">SKU: {item.sku}</span>
                        )}
                      </div>
                      <div className="item-price-block">
                        <span className="item-unit-price">
                          {formatNpr(item.price)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="item-subtotal-calc">
                            Total: {formatNpr(item.price * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="item-title">
                      <AppLink to={`/product/${item.productId}`}>
                        {item.name}
                      </AppLink>
                    </h3>

                    {item.variant && (
                      <div className="item-variant-spec">
                        <span className="spec-label">
                          Selected Configuration:
                        </span>
                        <span className="spec-value">{item.variant}</span>
                      </div>
                    )}

                    <div className="item-meta-badges">
                      <span className="meta-badge meta-badge--stock">
                        <Check size={13} /> {item.availability}
                      </span>
                      <span className="meta-badge meta-badge--eligible">
                        <Truck size={13} /> {item.importEligibility}
                      </span>
                    </div>

                    {/* Quantity controls and row actions */}
                    <div className="item-actions-row">
                      <div
                        className="quantity-stepper"
                        aria-label={`Quantity for ${item.name}`}
                      >
                        <button
                          aria-label="Decrease quantity"
                          className="stepper-btn"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          type="button"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="stepper-count" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          aria-label="Increase quantity"
                          className="stepper-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          type="button"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="item-buttons-group">
                        <button
                          className="item-btn item-btn--save"
                          onClick={() => saveForLater(item.id)}
                          type="button"
                          title="Save to Wishlist"
                        >
                          <Heart size={15} />
                          <span>Save for Later</span>
                        </button>
                        <button
                          className="item-btn item-btn--remove"
                          onClick={() => removeFromCart(item.id)}
                          type="button"
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Delivery Destination in Nepal */}
            <div className="nepal-destination-card">
              <div className="destination-header">
                <div>
                  <h4 className="destination-title">
                    <MapPin size={18} className="text-amber-500" />
                    Delivery Destination in Nepal
                  </h4>
                  <p className="destination-subtitle">
                    Select your province and district for local doorstep delivery.
                  </p>
                </div>
              </div>

              <div className="destination-selectors-grid">
                <div className="dest-select-group">
                  <label htmlFor="province-select">Province</label>
                  <select
                    id="province-select"
                    className="select"
                    value={deliveryDestination.province}
                    onChange={(e) =>
                      setDeliveryDestination({
                        province: e.target.value as NepalProvince,
                        district:
                          NEPAL_PROVINCES.find(
                            (p) => p.province === e.target.value,
                          )?.majorDistricts[0] || "Kathmandu",
                      })
                    }
                  >
                    {NEPAL_PROVINCES.map((p) => (
                      <option key={p.province} value={p.province}>
                        {p.province}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="dest-select-group">
                  <label htmlFor="district-select">
                    District / City
                  </label>
                  <select
                    id="district-select"
                    className="select"
                    value={deliveryDestination.district}
                    onChange={(e) =>
                      setDeliveryDestination({
                        ...deliveryDestination,
                        district: e.target.value,
                      })
                    }
                  >
                    {selectedProvinceData.majorDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="destination-shipping-note">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>
                  Delivering to <strong>{deliveryDestination.district}</strong>,{" "}
                  {deliveryDestination.province}. Fast delivery across all 7 provinces of Nepal.
                </span>
              </div>
            </div>

            {/* Promo Code Card */}
            <div className="promo-code-card">
              <div className="promo-card-header">
                <Tag size={17} className="text-amber-500" />
                <strong>Promo Code</strong>
              </div>

              {appliedPromo ? (
                <div className="promo-applied-box">
                  <div className="promo-badge-tag">
                    <Check size={14} className="text-emerald-500" />
                    <span>
                      Code <strong>{appliedPromo}</strong> active
                    </span>
                  </div>
                  <button
                    className="remove-promo-btn"
                    onClick={removePromo}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form className="promo-form" onSubmit={handleApplyPromo}>
                  <Input
                    className="promo-input"
                    placeholder="Enter promo code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                  />
                  <Button type="submit" variant="secondary" size="md">
                    Apply
                  </Button>
                </form>
              )}

              {promoMessage && (
                <p
                  className={`promo-feedback ${
                    promoMessage.isError ? "is-error" : "is-success"
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}

              <div className="promo-suggestions-hint">
                <span>Try code:</span>
                <button type="button" onClick={() => applyPromo("ABCEVPART")}>
                  ABCEVPART (15% off)
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Order Summary */}
          <aside className="cart-summary-column" aria-label="Order summary">
            <div className="cart-summary-sticky-card">
              <div className="summary-title-row">
                <Heading as="h3">Order Summary</Heading>
                <span className="summary-items-tag">{cartCount} items</span>
              </div>

              {/* Price Breakdown */}
              <div className="summary-rows">
                <div className="summary-row">
                  <span className="row-label">Products Subtotal</span>
                  <span className="row-value">
                    {formatNpr(totals.subtotal)}
                  </span>
                </div>

                <div className="summary-row">
                  <span className="row-label">
                    <span>Nepal Delivery Fee</span>
                    <small className="row-subtext">
                      {selectedShipping.carrier}
                    </small>
                  </span>
                  <span className="row-value">
                    {totals.shippingFee === 0 ? "Free" : formatNpr(totals.shippingFee)}
                  </span>
                </div>

                <div className="summary-row">
                  <span className="row-label">
                    <span>Nepal VAT (13%)</span>
                    <small className="row-subtext">Included</small>
                  </span>
                  <span className="row-value">{formatNpr(totals.vat)}</span>
                </div>

                {totals.discount > 0 && (
                  <div className="summary-row summary-row--discount">
                    <span className="row-label">Promotional Discount</span>
                    <span className="row-value">
                      − {formatNpr(totals.discount)}
                    </span>
                  </div>
                )}

                <div className="summary-divider" />

                {/* Total Order Amount */}
                <div className="summary-row summary-row--total">
                  <div>
                    <span className="total-label">Total Amount</span>
                    <span className="total-hint">
                      13% VAT & delivery included
                    </span>
                  </div>
                  <div className="total-amount-box">
                    <span className="total-amount">
                      {formatNpr(totals.payNowTotal)}
                    </span>
                    <span className="total-currency">NPR</span>
                  </div>
                </div>

                <div className="prepaid-guarantee-pill">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span>All-inclusive pricing · Zero hidden fees at delivery</span>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="summary-actions">
                <Button
                  className="checkout-primary-btn"
                  onClick={() => navigate("/checkout")}
                  size="lg"
                  variant="primary"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </Button>

                <Button
                  className="continue-shopping-btn"
                  onClick={() => navigate("/search")}
                  size="md"
                  variant="secondary"
                >
                  Continue Shopping
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="summary-trust-grid">
                <div className="trust-item">
                  <ShieldCheck size={18} className="text-amber-500" />
                  <div>
                    <strong>100% Genuine</strong>
                    <span>Verified authentic products</span>
                  </div>
                </div>
                <div className="trust-item">
                  <Truck size={18} className="text-amber-500" />
                  <div>
                    <strong>Nepal Delivery</strong>
                    <span>All 7 provinces nationwide</span>
                  </div>
                </div>
                <div className="trust-item">
                  <Zap size={18} className="text-amber-500" />
                  <div>
                    <strong>13% VAT Included</strong>
                    <span>Official tax invoice with every order</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section className="cart-related-section">
          <div className="section-head">
            <span className="section-eyebrow">Complementary Components</span>
            <Heading as="h2">You May Also Need for Your Build</Heading>
          </div>

          <div className="cart-related-grid">
            {relatedProducts.map((product) => (
              <div className="related-product-card" key={product.id}>
                <div className="related-image-wrap">
                  <img alt={product.name} src={product.image} />
                  <span className="related-voltage">{product.voltage}</span>
                </div>
                <div className="related-info">
                  <span className="related-brand">{product.brand}</span>
                  <h4 className="related-title">
                    <AppLink to={`/product/${product.id}`}>
                      {product.name}
                    </AppLink>
                  </h4>
                  <div className="related-bottom">
                    <span className="related-price">
                      {formatNpr(product.price)}
                    </span>
                    <Button
                      onClick={() =>
                        addToCart(product.name, {
                          sku: product.id,
                          quantity: 1,
                        })
                      }
                      size="sm"
                      variant="secondary"
                    >
                      <Plus size={14} /> Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
