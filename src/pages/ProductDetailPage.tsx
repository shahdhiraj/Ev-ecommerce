import { useEffect, useMemo, useRef, useState } from "react"
import {
  AlertCircle,
  ArrowRight,
  BatteryCharging,
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Cpu,
  Heart,
  Minus,
  Plus,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Zap,
} from "lucide-react"
import {
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router"
import { ProductCard } from "../components/ProductCard"
import { ProductGallery } from "../components/product/ProductGallery"
import { ProductQuickView } from "../components/ProductQuickView"
import type { StorefrontContext } from "../components/StorefrontShell"
import { AppLink, Button, Heading } from "../components/ui"
import { catalogue, type Product, type ProductVariant } from "../data/catalog"
import { formatNpr, trackCommerceEvent } from "../lib/search"

function ProductDetailSkeleton() {
  return (
    <div className="container pdp-skeleton">
      <div />
      <div>
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

function ProductAccordion({
  title,
  badge,
  children,
  defaultOpen = false,
}: {
  title: string
  badge?: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className={`pdp-accordion ${open ? "is-open" : ""}`}>
      <button
        aria-expanded={open}
        className="pdp-accordion-trigger"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="pdp-accordion-title-wrap">
          <span>{title}</span>
          {badge && <span className="pdp-accordion-badge">{badge}</span>}
        </span>
        <ChevronDown size={18} />
      </button>
      {open && <div className="pdp-accordion-content">{children}</div>}
    </section>
  )
}

export function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    addToCart,
    wishlist,
    wishlistEntries,
    toggleWishlist,
    viewProduct,
    recentlyViewed,
    notify,
    products,
  } = useOutletContext<StorefrontContext>()

  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [quickView, setQuickView] = useState<Product | null>(null)
  const [showMobileBar, setShowMobileBar] = useState(false)
  const [showAllSpecs, setShowAllSpecs] = useState(false)
  const [selectedAccessories, setSelectedAccessories] = useState<Set<string>>(
    new Set(),
  )
  const purchaseActionsRef = useRef<HTMLDivElement>(null)

  const product =
    products?.find((item) => item.id === productId) ||
    catalogue.find((item) => item.id === productId)
  const variants = product?.detail?.variants || [
    {
      id: "standard",
      label: "Standard Configuration",
      color: "#00d2ff",
      sku: `${productId}-STD`,
      available: product?.availability !== "Out of Stock",
    },
  ]
  const variantParam = searchParams.get("variant")
  const selectedVariant =
    variants.find((variant) => variant.id === variantParam) || variants[0]

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 160)
    return () => window.clearTimeout(timer)
  }, [productId])

  useEffect(() => {
    if (product) viewProduct(product.id)
  }, [product?.id])

  useEffect(() => {
    if (!product) return
    document.title = `${product.name} | ABC EV PART`
    const description = document.createElement("meta")
    description.name = "description"
    description.content = `${product.description} Certified high-voltage EV performance components.`
    document.head.append(description)
    return () => description.remove()
  }, [product])

  useEffect(() => {
    const handleScroll = () => {
      if (!purchaseActionsRef.current) return
      const bounds = purchaseActionsRef.current.getBoundingClientRect()
      setShowMobileBar(bounds.bottom < 120)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loading])

  const selectVariant = (variant: ProductVariant) => {
    const next = new URLSearchParams(searchParams)
    next.set("variant", variant.id)
    setSearchParams(next, { replace: true })
  }

  const addSelectedToCart = () => {
    if (
      !product ||
      !selectedVariant.available ||
      product.availability === "Out of Stock"
    ) {
      notify("This EV component is currently on allocation waitlist.")
      return
    }
    addToCart(product.name, {
      quantity,
      variant: selectedVariant.label,
      sku: selectedVariant.sku,
    })
    trackCommerceEvent("add_to_cart", { productId: product.id, quantity })
  }

  const similarProducts = useMemo(
    () =>
      product
        ? catalogue
            .filter(
              (item) =>
                item.subcategory === product.subcategory &&
                item.id !== product.id,
            )
            .slice(0, 4)
        : [],
    [product],
  )

  const accessoryProducts = catalogue.filter(
    (item) =>
      [
        "silicon-carbide-800v-inverter",
        "ccs2-to-nacs-ultra-adapter",
        "ampshield-hvil-harness-kit",
      ].includes(item.id) && item.id !== product?.id,
  )

  const gallery = product
    ? [
        selectedVariant.image || product.image,
        ...(product.detail?.gallery || [product.image]),
      ].filter(
        (img, idx, arr): img is string =>
          Boolean(img) && arr.indexOf(img) === idx,
      )
    : []

  const recentlyViewedProducts = recentlyViewed
    .filter((id) => id !== product?.id)
    .map((id) => catalogue.find((item) => item.id === id))
    .filter(Boolean) as Product[]

  if (loading) return <ProductDetailSkeleton />

  if (!product) {
    return (
      <section className="container pdp-error">
        <span>
          <Zap />
        </span>
        <Heading as="h1">Component Not Found</Heading>
        <p>
          This electric vehicle part may have been updated or moved in our
          catalogue.
        </p>
        <div>
          <AppLink to="/search" variant="button">
            Explore All EV Parts
          </AppLink>
          <AppLink to="/" variant="subtle">
            Back to Home
          </AppLink>
        </div>
      </section>
    )
  }

  const detail = product.detail
  const canPurchase =
    selectedVariant.available && product.availability !== "Out of Stock"
  const selectedVariantSaved = wishlistEntries.some(
    (entry) =>
      entry.productId === product.id && entry.variantId === selectedVariant.id,
  )

  const accessorySubtotal = accessoryProducts
    .filter((item) => selectedAccessories.has(item.id))
    .reduce((sum, item) => sum + (item.price || 0), product.price || 0)

  return (
    <div className="pdp-page pdp-page--clean">
      {/* Clean Minimal Breadcrumb */}
      <nav aria-label="Breadcrumb" className="container pdp-breadcrumb">
        <AppLink to="/">Home</AppLink>
        <ChevronRight size={13} />
        <AppLink to="/search">EV Parts</AppLink>
        <ChevronRight size={13} />
        <AppLink
          to={`/search?subcategory=${encodeURIComponent(product.subcategory)}`}
        >
          {product.subcategory}
        </AppLink>
        <ChevronRight size={13} />
        <span>{product.name}</span>
      </nav>

      {/* Main Product Hero */}
      <section className="container pdp-hero">
        <ProductGallery images={gallery} productName={product.name} />

        <div className="pdp-info">
          {/* Top Brand & Status Badges */}
          <div className="pdp-top-meta">
            <AppLink
              className="pdp-brand-tag"
              to={`/search?brand=${encodeURIComponent(product.brand)}`}
            >
              {product.brand}
            </AppLink>
            <div className="pdp-meta-badges">
              <span
                className={`pdp-badge pdp-badge--stock ${
                  product.availability === "Out of Stock"
                    ? "pdp-badge--out"
                    : ""
                }`}
              >
                <span className="stock-dot" />
                <span>{product.availability}</span>
              </span>
            </div>
          </div>

          {/* Product Title */}
          <h1 className="pdp-title">{product.name}</h1>

          {/* Rating */}
          <div className="pdp-rating-row">
            <div className="pdp-stars">
              <Star size={15} className="fill-amber-400 text-amber-400" />
              <Star size={15} className="fill-amber-400 text-amber-400" />
              <Star size={15} className="fill-amber-400 text-amber-400" />
              <Star size={15} className="fill-amber-400 text-amber-400" />
              <Star size={15} className="fill-amber-400 text-amber-400" />
              <span className="pdp-review-count">
                4.9 (128 reviews)
              </span>
            </div>
          </div>

          {/* Clean Price Panel */}
          <div className="pdp-price-panel">
            <div className="pdp-price-main">
              <strong>{formatNpr(product.price)}</strong>
              <span className="pdp-shipping-note">
                Free delivery in Nepal
              </span>
            </div>
          </div>

          {/* Lead Description */}
          <p className="pdp-lead-desc">{product.description}</p>

          {/* Clean Configuration / Specification Selector */}
          {variants.length > 1 && (
            <div className="pdp-spec-selector">
              <label className="pdp-input-label">
                Configuration Specification
              </label>
              <div className="pdp-variant-chips">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => selectVariant(variant)}
                    className={`pdp-variant-chip ${
                      selectedVariant.id === variant.id ? "is-active" : ""
                    }`}
                  >
                    <span className="variant-label">{variant.label}</span>
                    {selectedVariant.id === variant.id && (
                      <Check size={14} className="text-amber-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Unified One-Screen Quantity & Purchase Actions */}
          <div className="pdp-purchase-actions" ref={purchaseActionsRef}>
            <div className="pdp-action-bar">
              <div className="pdp-qty-stepper" aria-label="Select quantity">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus size={14} />
                </button>
                <span className="pdp-qty-val">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity >= 8}
                  onClick={() => setQuantity(Math.min(8, quantity + 1))}
                >
                  <Plus size={14} />
                </button>
              </div>

              <Button
                className="pdp-add-cart-btn"
                disabled={!canPurchase}
                onClick={addSelectedToCart}
                size="md"
              >
                <ShoppingBag size={17} /> Add to Cart
              </Button>

              <Button
                className="pdp-buy-now-btn"
                disabled={!canPurchase}
                onClick={() => {
                  addSelectedToCart()
                  navigate("/checkout")
                }}
                size="md"
                variant="secondary"
              >
                <Zap size={16} className="text-amber-500" /> Buy Now
              </Button>

              <button
                type="button"
                aria-label={
                  selectedVariantSaved
                    ? "Remove from Wishlist"
                    : "Save Component"
                }
                onClick={() => toggleWishlist(product.id, selectedVariant.id)}
                className={`pdp-wishlist-btn ${
                  selectedVariantSaved ? "is-active" : ""
                }`}
              >
                <Heart
                  size={19}
                  className={
                    selectedVariantSaved
                      ? "fill-red-500 text-red-500"
                      : "text-slate-600"
                  }
                />
              </button>
            </div>
          </div>

          {/* Clean Minimal Guarantee Strip (Single Row, No Extra Space) */}
          <div className="pdp-trust-pills">
            <span className="pdp-trust-pill">
              <Truck size={14} className="text-amber-500 shrink-0" /> Free Nepal Delivery
            </span>
            <span className="pdp-trust-pill">
              <ShieldCheck size={14} className="text-amber-500 shrink-0" /> 100% Genuine
            </span>
            <span className="pdp-trust-pill">
              <BatteryCharging size={14} className="text-amber-500 shrink-0" /> Warranty Included
            </span>
          </div>
        </div>
      </section>

      {/* Engineering Highlights */}
      <section className="pdp-section pdp-section--soft">
        <div className="container">
          <div className="pdp-section-heading">
            <Heading>Key Highlights</Heading>
          </div>
          <div className="highlight-grid">
            {[
              [
                Zap,
                "800V Architecture",
                "Compatible with ultra-fast high-voltage charging networks and high-current inverters.",
              ],
              [
                Cpu,
                "Silicon Carbide Efficiency",
                "Delivers up to 99.4% peak thermal switching efficiency for extreme track longevity.",
              ],
              [
                ShieldCheck,
                "ISO 26262 ASIL-D",
                "Certified automotive functional safety standard with redundant fault protection.",
              ],
              [
                BatteryCharging,
                "Extreme Thermal Range",
                "Liquid-cooled direct stator and dielectric core operating from -40°C to +105°C.",
              ],
            ].map(([Icon, title, copy]) => {
              const HighlightIcon = Icon as typeof Zap
              return (
                <article key={String(title)} className="highlight-card">
                  <span className="highlight-icon">
                    <HighlightIcon size={22} />
                  </span>
                  <Heading as="h3">{String(title)}</Heading>
                  <p>{String(copy)}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Technical Specifications & Compatibility */}
      <section className="container pdp-section product-overview" id="specs">
        <div className="pdp-section-heading">
          <Heading>Specifications & Compatibility</Heading>
        </div>
        <div className="specs-layout">
          <div>
            <div className="spec-table">
              {(showAllSpecs
                ? Object.entries(detail?.specifications || {})
                : Object.entries(detail?.specifications || {}).slice(0, 4)
              ).map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>
                    {label === "Color"
                      ? selectedVariant.label
                      : value || "Not provided"}
                  </strong>
                </div>
              ))}
            </div>

            {Object.entries(detail?.specifications || {}).length > 4 && (
              <div className="spec-more-actions">
                <button
                  type="button"
                  className="specs-toggle-btn"
                  onClick={() => setShowAllSpecs(!showAllSpecs)}
                >
                  {showAllSpecs ? (
                    <>
                      Show Less Details <ChevronUp size={15} />
                    </>
                  ) : (
                    <>
                      Show More Details (
                      {Object.entries(detail?.specifications || {}).length - 4} more specs)
                      <ChevronDown size={15} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          <div className="detail-accordions">
            <ProductAccordion
              defaultOpen={false}
              title="Platform Compatibility"
              badge={`${detail?.compatibility?.length || 5} Platforms`}
            >
              {detail?.compatibility.map((item) => (
                <p key={item}>
                  <Check size={15} className="text-amber-500" />
                  {item}
                </p>
              )) || <p>Universal 800V Architecture</p>}
            </ProductAccordion>
            <ProductAccordion
              defaultOpen={false}
              title="Package Contents"
              badge={`${detail?.includedItems?.length || 6} Items`}
            >
              {detail?.includedItems.map((item) => (
                <p key={item}>
                  <Box size={15} className="text-amber-500" />
                  {item}
                </p>
              )) || <p>Component main unit with mounting hardware</p>}
            </ProductAccordion>
            <ProductAccordion
              defaultOpen={false}
              title="Factory Calibration & Warranty"
              badge="Official Coverage"
            >
              <p>
                <ShieldCheck size={15} className="text-amber-500" />
                {detail?.warranty ||
                  "3 Years Comprehensive EV Performance Warranty"}
              </p>
              <p>
                <Check size={15} className="text-amber-500" />
                Dynamometer stress certification report and QR firmware manifest
                included.
              </p>
            </ProductAccordion>
          </div>
        </div>
      </section>

      {/* Verified Builder Feedback */}
      <section className="pdp-section pdp-section--soft">
        <div className="container">
          <div className="pdp-section-heading">
            <Heading>Customer Reviews</Heading>
          </div>
          <div className="builder-reviews-grid">
            <div className="builder-review-card">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="review-quote">
                "Flawless integration with our 800V Porsche Taycan hillclimb
                project. Thermal efficiency matches bench dyno telemetry
                precisely."
              </p>
              <div className="review-author">
                <strong>Marcus H.</strong>
                <span>Stuttgart Track Engineering</span>
              </div>
            </div>
            <div className="builder-review-card">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="review-quote">
                "Direct drop-in fitment. Core temperature stayed under 52°C even
                after 12 consecutive dyno full-throttle acceleration pulls."
              </p>
              <div className="review-author">
                <strong>David K.</strong>
                <span>Apex EV Conversions</span>
              </div>
            </div>
            <div className="builder-review-card">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="review-quote">
                "Aerospace-grade billet housing and precision IP68 connectors.
                Communicated with our custom CAN-FD bus within minutes."
              </p>
              <div className="review-author">
                <strong>Alex R.</strong>
                <span>Hypercar Dynamics Lab</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compatible Add-Ons & Hardware */}
      {accessoryProducts.length > 0 && (
        <section className="container pdp-section accessories-section">
          <div className="pdp-section-heading">
            <Heading>Frequently Bought Together</Heading>
          </div>
          <div className="accessory-bundle">
            <div className="bundle-product bundle-product--primary">
              <img alt={product.name} src={product.image} />
              <span>
                <strong>{product.name}</strong>
                <small>{formatNpr(product.price)}</small>
              </span>
            </div>
            {accessoryProducts.map((accessory) => (
              <label className="bundle-product" key={accessory.id}>
                <input
                  checked={selectedAccessories.has(accessory.id)}
                  onChange={() =>
                    setSelectedAccessories((current) => {
                      const next = new Set(current)
                      next.has(accessory.id)
                        ? next.delete(accessory.id)
                        : next.add(accessory.id)
                      return next
                    })
                  }
                  type="checkbox"
                  className="bundle-checkbox"
                />
                <img alt={accessory.name} src={accessory.image} />
                <span>
                  <strong>{accessory.name}</strong>
                  <small>{formatNpr(accessory.price)}</small>
                </span>
              </label>
            ))}
            <div className="bundle-summary">
              <span>
                Combined Total: <strong>{formatNpr(accessorySubtotal)}</strong>
              </span>
              <Button
                className="bundle-add-btn"
                onClick={() => {
                  addToCart(product.name, {
                    quantity: 1,
                    variant: selectedVariant.label,
                    sku: selectedVariant.sku,
                  })
                  accessoryProducts
                    .filter((item) => selectedAccessories.has(item.id))
                    .forEach((item) => addToCart(item.name))
                }}
              >
                Add Selected to Cart
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* You May Also Like */}
      {similarProducts.length > 0 && (
        <section className="pdp-section pdp-section--soft related-products-section">
          <div className="container">
            <div className="pdp-section-heading">
              <Heading>Related Products</Heading>
            </div>
            <div className="pdp-related-grid">
              {similarProducts.map((related) => (
                <ProductCard
                  key={related.id}
                  onAdd={() => addToCart(related.name)}
                  onQuickView={() => {
                    setQuickView(related)
                    viewProduct(related.id)
                  }}
                  onSave={() => toggleWishlist(related.id)}
                  onView={() => viewProduct(related.id)}
                  product={related}
                  query=""
                  saved={wishlist.has(related.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentlyViewedProducts.length > 0 && (
        <section className="container pdp-section pdp-recent">
          <div className="pdp-section-heading">
            <Heading>Recently Viewed</Heading>
          </div>
          <div className="pdp-recent-grid">
            {recentlyViewedProducts.slice(0, 4).map((recent) => (
              <AppLink
                key={recent.id}
                to={`/product/${recent.id}`}
                className="pdp-recent-card"
              >
                <img alt={recent.name} src={recent.image} />
                <span>
                  <small>{recent.brand}</small>
                  <strong>{recent.name}</strong>
                  <em>{formatNpr(recent.price)}</em>
                </span>
              </AppLink>
            ))}
          </div>
        </section>
      )}

      {/* Visual Buying Process - Last Section on Product Details */}
      <section className="pdp-section pdp-buying-process-section">
        <div className="container">
          <div className="pdp-section-heading">
            <Heading as="h2">How Buying Works in Nepal</Heading>
          </div>
          <div className="pdp-process-steps-grid">
            <div className="pdp-process-step">
              <span className="pdp-process-step-num">01</span>
              <div className="pdp-process-icon-wrap">
                <ShoppingBag size={22} className="text-amber-500" />
              </div>
              <strong className="pdp-process-step-title">Select & Configure</strong>
              <p className="pdp-process-step-desc">
                Choose your specification, verify platform compatibility, and click Add to Cart or Instant Checkout.
              </p>
            </div>

            <div className="pdp-process-step">
              <span className="pdp-process-step-num">02</span>
              <div className="pdp-process-icon-wrap">
                <Truck size={22} className="text-amber-500" />
              </div>
              <strong className="pdp-process-step-title">Insured Nepal Delivery</strong>
              <p className="pdp-process-step-desc">
                Fast doorstep courier dispatch across all 7 provinces with secure parcel tracking via SMS & email.
              </p>
            </div>

            <div className="pdp-process-step">
              <span className="pdp-process-step-num">03</span>
              <div className="pdp-process-icon-wrap">
                <QrCode size={22} className="text-amber-500" />
              </div>
              <strong className="pdp-process-step-title">Easy Domestic Payment</strong>
              <p className="pdp-process-step-desc">
                Instant payment via Fonepay QR, eSewa Wallet, Debit/Credit Card, or Cash on Delivery.
              </p>
            </div>

            <div className="pdp-process-step">
              <span className="pdp-process-step-num">04</span>
              <div className="pdp-process-icon-wrap">
                <ShieldCheck size={22} className="text-amber-500" />
              </div>
              <strong className="pdp-process-step-title">100% Genuine with VAT</strong>
              <p className="pdp-process-step-desc">
                Factory authentic warranty included with official Government of Nepal 13% VAT tax receipt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {quickView && (
        <ProductQuickView
          onAdd={(selectedQuantity) => {
            addToCart(quickView.name, { quantity: selectedQuantity })
            setQuickView(null)
          }}
          onClose={() => setQuickView(null)}
          onSave={() => toggleWishlist(quickView.id)}
          product={quickView}
          saved={wishlist.has(quickView.id)}
        />
      )}

      {/* Sticky Mobile Purchase Bar */}
      <div
        className={`mobile-purchase-bar ${showMobileBar ? "is-visible" : ""}`}
      >
        <div>
          <small>{selectedVariant.label}</small>
          <strong>{formatNpr(product.price)}</strong>
        </div>
        <Button disabled={!canPurchase} onClick={addSelectedToCart}>
          <ShoppingBag size={18} /> Add to Cart
        </Button>
      </div>
    </div>
  )
}
