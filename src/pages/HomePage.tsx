import { useEffect, useRef, useState } from "react"
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  Check,
  ChevronRight,
  Cpu,
  Eye,
  Flame,
  Gauge,
  Heart,
  Layers,
  Mail,
  RotateCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  Sparkles,
  Star,
  ThermometerSnowflake,
  Truck,
  Wrench,
  X,
  Zap,
} from "lucide-react"
import { useNavigate, useOutletContext } from "react-router"
import type { StorefrontContext } from "../components/StorefrontShell"
import {
  AppLink,
  Badge,
  Button,
  Heading,
  IconButton,
  Input,
} from "../components/ui"
import { catalogue, type Product } from "../data/catalog"
import { formatNpr } from "../lib/search"

const evSubcategories = [
  {
    name: "Powertrain & Motors",
    image: "/images/subsystems/powertrain-motor.jpg",
    query: "Powertrain & Motors",
  },
  {
    name: "Power Electronics & Inverters",
    image: "/images/subsystems/sic-inverter.jpg",
    query: "Power Electronics & Inverters",
  },
  {
    name: "Battery & BMS",
    image: "/images/subsystems/battery-pack.jpg",
    query: "Battery & BMS",
  },
  {
    name: "Charging & Wallboxes",
    image: "/images/subsystems/charging-station.jpg",
    query: "Charging & Wallboxes",
  },
  {
    name: "Brakes & Suspension",
    image: "/images/subsystems/carbon-brakes.jpg",
    query: "Brakes & Suspension",
  },
  {
    name: "Aero & Carbon Performance",
    image: "/images/subsystems/carbon-aero.jpg",
    query: "Aero & Carbon Performance",
  },
]

const heroFlagships = [
  {
    id: "apex-900-axial-flux-motor",
    badge: "Dual Axial Flux",
    highlight: "720 kW · 1,150 Nm",
    brand: "ABC EV PART Performance",
    name: "ABC EV PART Apex-900 Dual Axial Flux Motor Kit",
    shortName: "Apex-900 Motor",
    price: 485000,
    voltage: "800V Architecture",
    image: "/images/hero/apex-900-dyno.jpg",
    specs: ["800V Architecture", "Liquid-Glycol Cooled", "Direct-Drive"],
  },
  {
    id: "silicon-carbide-800v-inverter",
    badge: "Silicon Carbide SiC",
    highlight: "750A Peak · 99.4% Efficiency",
    brand: "BorgWarner EV",
    name: "ViperSiC 800V Dual Silicon Carbide Traction Inverter",
    shortName: "ViperSiC Inverter",
    price: 342000,
    voltage: "800V SiC",
    image: "/images/subsystems/sic-inverter.jpg",
    specs: ["800V SiC Power", "CAN FD Integration", "ASIL-D Certified"],
  },
  {
    id: "quantum-82kwh-battery-pack",
    badge: "LFP Blade Battery",
    highlight: "82 kWh · 4C Ultra-Fast Charge",
    brand: "Envision AESC",
    name: "QuantumCell 82 kWh LFP Blade Battery Module",
    shortName: "QuantumCell Battery",
    price: 890000,
    voltage: "800V Pack",
    image: "/images/subsystems/battery-pack.jpg",
    specs: ["800V High Energy Density", "4C Ultra-Fast Charge", "Smart Cloud BMS"],
  },
]



const howOrderingSteps = [
  {
    step: "01",
    icon: Search,
    title: "Select Products",
    desc: "Explore genuine high-performance components and lifestyle gear from verified manufacturers.",
    detail: "100% Genuine Guaranteed",
  },
  {
    step: "02",
    icon: Cpu,
    title: "Transparent Cost",
    desc: "13% Nepal VAT and delivery fees calculated upfront with zero surprise charges at checkout.",
    detail: "13% VAT Tax Invoice",
  },
  {
    step: "03",
    icon: Truck,
    title: "Fast Dispatch",
    desc: "Inspected, securely packaged, and dispatched rapidly from our central Kathmandu distribution hub.",
    detail: "Dispatched in 24-48h",
  },
  {
    step: "04",
    icon: ShieldCheck,
    title: "Nepal Delivery",
    desc: "Direct doorstep delivery with real-time consignment tracking across all 7 provinces nationwide.",
    detail: "All 7 provinces covered",
  },
]

export function HomePage() {
  const navigate = useNavigate()
  const { addToCart, wishlist, toggleWishlist, viewProduct, products } =
    useOutletContext<StorefrontContext>()
  const carouselRef = useRef<HTMLDivElement>(null)
  const [quickView, setQuickView] = useState<Product | null>(null)
  const [email, setEmail] = useState("")
  const [newsletterState, setNewsletterState] =
    useState<"idle" | "error" | "success">("idle")
  const [selectedTab, setSelectedTab] =
    useState<"all" | "powertrain" | "battery" | "charging" | "chassis">("all")
  const [activeHeroIdx, setActiveHeroIdx] = useState(0)
  const currentHero = heroFlagships[activeHeroIdx]

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>("[data-reveal]")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  const scrollProducts = (direction: number) => {
    carouselRef.current?.scrollBy({
      left: direction * Math.min(carouselRef.current.clientWidth, 820),
      behavior: "smooth",
    })
  }

  const submitNewsletter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    setNewsletterState(valid ? "success" : "error")
  }

  // Filter products by tab (using live catalog with owner uploads)
  const allProducts = products && products.length > 0 ? products : catalogue
  const filteredProducts = allProducts.filter((item) => {
    if (selectedTab === "powertrain")
      return (
        item.subcategory.includes("Powertrain") ||
        item.subcategory.includes("Inverters")
      )
    if (selectedTab === "battery")
      return (
        item.subcategory.includes("Battery") ||
        item.subcategory.includes("Thermal")
      )
    if (selectedTab === "charging") return item.subcategory.includes("Charging")
    if (selectedTab === "chassis")
      return (
        item.subcategory.includes("Brakes") || item.subcategory.includes("Aero")
      )
    return true
  })

  return (
    <>
      {/* Minimal Luxury Modern Hero Section */}
      <section className="hero-section home-hero home-hero--minimal">
        <div className="container hero">
          <div className="hero__content">
            <div className="hero-eyebrow-badge">
              <span className="hero-eyebrow-dot" />
              <span>ABC EV PART · HIGH-VOLTAGE PERFORMANCE</span>
            </div>

            <Heading as="h1" className="hero-headline">
              High-Performance EV Parts. <br />
              <span className="hero-headline__accent">Delivered Across Nepal.</span>
            </Heading>
            <p className="hero__copy">
              Authentic high-performance components and EV systems delivered directly to your doorstep across Nepal with 13% VAT included upfront.
            </p>

            <div className="hero__cta-group">
              <button
                className="hero-btn-primary"
                onClick={() => navigate("/search")}
                type="button"
              >
                <span>Explore Catalog</span>
                <ArrowRight size={18} className="hero-btn-arrow" />
              </button>
              <button
                className="hero-btn-secondary"
                onClick={() => navigate("/categories")}
                type="button"
              >
                <span>Browse Categories</span>
              </button>
            </div>
          </div>

          {/* Interactive Flagship Showcase */}
          <div className="hero-showcase-wrapper">
            {/* Segmented Switcher Pills */}
            <div
              aria-label="Flagship Hardware Releases"
              className="hero-switcher-tabs"
              role="tablist"
            >
              {heroFlagships.map((item, idx) => (
                <button
                  aria-selected={activeHeroIdx === idx}
                  className={`hero-switcher-pill ${
                    activeHeroIdx === idx ? "is-active" : ""
                  }`}
                  key={item.id}
                  onClick={() => setActiveHeroIdx(idx)}
                  role="tab"
                  type="button"
                >
                  <span className="hero-switcher-indicator" />
                  <span>{item.shortName}</span>
                </button>
              ))}
            </div>

            {/* Interactive Featured Card */}
            <div className="hero-featured-card hero-featured-card--interactive">
              <div className="hero-featured-media">
                <img
                  alt={currentHero.name}
                  className="hero-featured-img"
                  key={currentHero.id}
                  src={currentHero.image}
                />

                {/* Top Badges */}
                <div className="hero-media-overlay-top">
                  <span className="hero-badge-tag">
                    <Zap className="hero-badge-icon" size={13} />
                    {currentHero.badge}
                  </span>
                  <span className="hero-stock-pill">
                    <span className="hero-stock-pulse" />
                    In Stock
                  </span>
                </div>

                {/* Telemetry Spec Badge & Micro Navigation */}
                <div className="hero-media-overlay-bottom">
                  <div className="hero-telemetry-pill">
                    <Gauge className="hero-telemetry-icon" size={14} />
                    <span>{currentHero.highlight}</span>
                  </div>

                  <div className="hero-carousel-nav">
                    <button
                      aria-label="Previous component"
                      className="hero-nav-arrow"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveHeroIdx((prev) =>
                          prev === 0 ? heroFlagships.length - 1 : prev - 1,
                        )
                      }}
                      type="button"
                    >
                      <ArrowLeft size={13} />
                    </button>
                    <span className="hero-nav-counter">
                      {activeHeroIdx + 1} / {heroFlagships.length}
                    </span>
                    <button
                      aria-label="Next component"
                      className="hero-nav-arrow"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveHeroIdx((prev) =>
                          prev === heroFlagships.length - 1 ? 0 : prev + 1,
                        )
                      }}
                      type="button"
                    >
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="hero-featured-body">
                <div className="hero-featured-topline">
                  <span className="hero-featured-brand">
                    {currentHero.brand}
                  </span>
                  <button
                    aria-label="Save to wishlist"
                    className={`hero-wishlist-btn ${
                      wishlist.has(currentHero.id) ? "is-saved" : ""
                    }`}
                    onClick={() => toggleWishlist(currentHero.id)}
                    type="button"
                  >
                    <Heart
                      fill={
                        wishlist.has(currentHero.id) ? "currentColor" : "none"
                      }
                      size={16}
                    />
                  </button>
                </div>

                <h2 className="hero-featured-name">
                  <AppLink to={`/product/${currentHero.id}`}>
                    {currentHero.name}
                  </AppLink>
                </h2>

                {/* Spec Mini Chips */}
                <div className="hero-specs-list">
                  {currentHero.specs.map((spec) => (
                    <span className="hero-spec-chip" key={spec}>
                      <Check className="hero-spec-chip-icon" size={12} />
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="hero-featured-footer">
                  <div className="hero-price-wrap">
                    <span className="hero-featured-price">
                      {formatNpr(currentHero.price)}
                    </span>
                    <span className="hero-price-vat">
                      13% Nepal VAT included
                    </span>
                  </div>

                  <button
                    className="hero-view-btn"
                    onClick={() => {
                      viewProduct(currentHero.id)
                      navigate(`/product/${currentHero.id}`)
                    }}
                    type="button"
                  >
                    <span>View Product</span>
                    <ArrowRight className="hero-view-arrow" size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Minimal Trust Strip */}
      <section className="clean-trust-strip">
        <div className="container clean-trust-grid">
          <div className="clean-trust-card">
            <Truck size={22} className="text-amber-500" />
            <div>
              <strong>Nepal Delivery Only</strong>
              <small>All 7 provinces nationwide</small>
            </div>
          </div>
          <div className="clean-trust-card">
            <ShieldCheck size={22} className="text-amber-500" />
            <div>
              <strong>100% Authentic</strong>
              <small>Genuine verified products</small>
            </div>
          </div>
          <div className="clean-trust-card">
            <Zap size={22} className="text-amber-500" />
            <div>
              <strong>13% Nepal VAT Included</strong>
              <small>Zero hidden charges</small>
            </div>
          </div>
          <div className="clean-trust-card">
            <Check size={22} className="text-amber-500" />
            <div>
              <strong>Local Support</strong>
              <small>Dedicated assistance in Nepal</small>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Category Grid */}
      <section className="section container" data-reveal>
        <div className="section-heading section-heading--intro">
          <div>
            <Heading>Shop Categories</Heading>
            <p className="section-subtitle">
              Browse authentic products by category.
            </p>
          </div>
          <AppLink to="/categories" className="view-all-link">
            All Categories <ChevronRight size={17} />
          </AppLink>
        </div>

        <div className="clean-category-grid">
          {evSubcategories.map((cat) => (
            <AppLink
              className="clean-cat-card"
              key={cat.name}
              to={`/search?subcategory=${encodeURIComponent(cat.query)}`}
            >
              <div className="clean-cat-card__img-wrap">
                <img
                  alt={cat.name}
                  loading="lazy"
                  src={cat.image}
                  onError={(e) => {
                    const img = e.currentTarget
                    if (!img.src.includes("carbon-aero.jpg")) {
                      img.src = "/images/subsystems/carbon-aero.jpg"
                    }
                  }}
                />
              </div>
              <div className="clean-cat-card__content">
                <h3>{cat.name}</h3>
                <span className="clean-cat-card__link">
                  Browse <ArrowRight size={13} />
                </span>
              </div>
            </AppLink>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section section--soft" data-reveal>
        <div className="container">
          <div className="section-heading">
            <div>
              <Heading>Featured Products</Heading>
              <p className="section-subtitle">
                Verified high-performance components ready for dispatch.
              </p>
            </div>
            <div className="carousel-controls">
              <IconButton
                label="Previous products"
                onClick={() => scrollProducts(-1)}
              >
                <ArrowLeft size={20} />
              </IconButton>
              <IconButton
                label="Next products"
                onClick={() => scrollProducts(1)}
              >
                <ArrowRight size={20} />
              </IconButton>
            </div>
          </div>

          {/* Clean Interactive Filter Pills */}
          <div className="clean-tab-pills">
            {[
              ["all", "All Products"],
              ["powertrain", "Motors & Inverters"],
              ["battery", "Batteries"],
              ["charging", "Charging"],
              ["chassis", "Brakes & Aero"],
            ].map(([key, label]) => (
              <button
                key={key}
                className={selectedTab === key ? "is-active" : ""}
                onClick={() => setSelectedTab(key as typeof selectedTab)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="product-carousel" ref={carouselRef}>
            {filteredProducts.map((product) => (
              <article
                className="search-product-card search-product-card--grid search-product-card--clean"
                key={product.id}
              >
                <div className="search-product-card__visual">
                  <button
                    aria-label={`Save ${product.name}`}
                    className={`card-wishlist-btn ${
                      wishlist.has(product.id) ? "is-active" : ""
                    }`}
                    onClick={() => toggleWishlist(product.id)}
                    type="button"
                  >
                    <Heart
                      className={
                        wishlist.has(product.id)
                          ? "text-red-500 fill-red-500"
                          : "text-slate-700"
                      }
                      size={18}
                    />
                  </button>

                  <img
                    alt={product.name}
                    src={product.image}
                    onClick={() => {
                      viewProduct(product.id)
                      navigate(`/product/${product.id}`)
                    }}
                    style={{ cursor: "pointer" }}
                  />

                  <Button
                    className="quick-view-trigger"
                    onClick={() => {
                      setQuickView(product)
                      viewProduct(product.id)
                    }}
                    size="sm"
                    variant="secondary"
                  >
                    <Eye size={15} /> Quick View
                  </Button>
                </div>

                <div className="search-product-card__body">
                  <div className="card-top-row">
                    <span className="card-brand">{product.brand}</span>
                    {product.availability !== "In Stock" && (
                      <span className="card-stock-pill card-stock-pill--out">
                        {product.availability}
                      </span>
                    )}
                  </div>

                  <AppLink
                    className="product-title-link"
                    to={`/product/${product.id}`}
                  >
                    <Heading as="h3">{product.name}</Heading>
                  </AppLink>

                  <div className="card-bottom-row">
                    <div className="card-price-block">
                      <span className="card-price">
                        {formatNpr(product.price)}
                      </span>
                    </div>

                    <div className="card-action-btns">
                      <Button
                        className="add-cart-btn"
                        onClick={() =>
                          addToCart(product.name, { sku: product.id })
                        }
                        size="sm"
                      >
                        <ShoppingBag size={15} /> Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* OEM Standards & Brand Partners */}
      <section className="brand-section brand-section--clean" data-reveal>
        <div className="container">
          <span className="brand-section-label">Trusted Brands</span>
          <div className="brand-logo-grid brand-logo-grid--clean">
            {[
              "BOSCH",
              "BORGWARNER",
              "BREMBO",
              "ABB",
              "ENVISION",
              "BILSTEIN",
              "RIMAC",
              "TESLA",
            ].map((partner) => (
              <AppLink
                key={partner}
                to={`/search?q=${encodeURIComponent(partner)}`}
                className="brand-logo-card"
                aria-label={`Browse ${partner} products`}
              >
                <strong>{partner}</strong>
              </AppLink>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Clean Professional Process Section */}
      <section className="section how-it-works-section" data-reveal>
        <div className="container">
          <div className="how-it-works-header">
            <span className="how-process-tag">
              <Sparkles size={13} className="text-amber-500" />
              SIMPLE 4-STEP PROCESS
            </span>
            <Heading as="h2" className="how-it-works-title">
              How Ordering Works in Nepal
            </Heading>
            <p className="how-it-works-subtitle">
              Convenient shopping delivered straight to your doorstep anywhere in Nepal with 100% authentic quality and full VAT compliance.
            </p>
          </div>

          <div className="how-steps-grid">
            {howOrderingSteps.map((step, idx) => {
              const StepIcon = step.icon
              return (
                <div className="how-step-card" key={step.step}>
                  <div className="how-step-card__top">
                    <span className="how-step-pill">STEP {step.step}</span>
                    {idx < 3 && (
                      <span className="how-step-next-indicator" aria-hidden="true">
                        <ArrowRight size={14} />
                      </span>
                    )}
                  </div>

                  <div className="how-step-icon-wrap">
                    <StepIcon size={22} />
                  </div>

                  <h3 className="how-step-title">{step.title}</h3>
                  <p className="how-step-desc">{step.desc}</p>

                  <div className="how-step-footer">
                    <Check size={13} className="text-emerald-500" />
                    <span>{step.detail}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Verified Builder Reviews */}
      <section className="section experiences-section experiences-section--clean" data-reveal>
        <div className="container">
          <div className="section-heading">
            <div>
              <Heading>Customer Reviews</Heading>
              <p className="section-subtitle">
                Feedback from verified customers across Nepal.
              </p>
            </div>
          </div>
          <div className="review-grid">
            {[
              [
                "The motor kit arrived in Kathmandu in perfect condition. Verified authentic and smoothly delivered to our workshop.",
                "Kiran Shrestha",
                "Kathmandu",
              ],
              [
                "Authentic inverters delivered directly to Pokhara. Transparent pricing with 13% Nepal VAT included upfront.",
                "David M.",
                "Pokhara",
              ],
              [
                "Fast courier delivery and reliable packaging. The 22kW wallbox is working seamlessly with our local power setup.",
                "Anil Basnet",
                "Lalitpur",
              ],
            ].map(([quote, name, meta]) => (
              <article className="review-card review-card--clean" key={name}>
                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star fill="currentColor" key={star} size={15} />
                  ))}
                </div>
                <blockquote>“{quote}”</blockquote>
                <div className="review-author">
                  <span className="author-avatar">{name.slice(0, 1)}</span>
                  <p>
                    <strong>{name}</strong>
                    <small>{meta}</small>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Clean Newsletter */}
      <section
        className="newsletter-section newsletter-section--clean"
        data-reveal
      >
        <div className="container newsletter newsletter--clean">
          <div>
            <Heading>Stay Updated</Heading>
            <p>
              Subscribe for new arrivals, exclusive discounts, and product announcements.
            </p>
          </div>
          <form
            className={`newsletter-form newsletter-form--${newsletterState}`}
            noValidate
            onSubmit={submitNewsletter}
          >
            <Input
              aria-describedby="newsletter-feedback"
              aria-invalid={newsletterState === "error"}
              onChange={(event) => {
                setEmail(event.target.value)
                setNewsletterState("idle")
              }}
              placeholder="Enter your email address"
              type="email"
              value={email}
            />
            <Button type="submit">
              {newsletterState === "success"
                ? "Subscribed"
                : "Subscribe"}{" "}
              {newsletterState === "success" ? (
                <Check size={17} />
              ) : (
                <ArrowRight size={17} />
              )}
            </Button>
            <span id="newsletter-feedback">
              {newsletterState === "error"
                ? "Please enter a valid email address."
                : newsletterState === "success"
                  ? "Thank you for subscribing!"
                  : "No spam. Unsubscribe anytime."}
            </span>
          </form>
        </div>
      </section>

      {/* Quick View Modal for EV Parts */}
      {quickView && (
        <div
          className="overlay overlay--center"
          onMouseDown={() => setQuickView(null)}
        >
          <section
            aria-label={`Quick view for ${quickView.name}`}
            aria-modal="true"
            className="quick-view quick-view--ev"
            role="dialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <IconButton
              className="quick-view__close"
              label="Close quick view"
              onClick={() => setQuickView(null)}
            >
              <X />
            </IconButton>
            <div className="quick-view__image">
              <img alt={quickView.name} src={quickView.image} />
            </div>
            <div className="quick-view__content">
              <span className="quick-view-category">
                {quickView.subcategory}
              </span>
              <Heading>{quickView.name}</Heading>
              <strong className="quick-view-price">
                {formatNpr(quickView.price)}
              </strong>
              <p>{quickView.description}</p>
              <div className="quick-view-actions">
                <Button
                  onClick={() => {
                    addToCart(quickView.name, { sku: quickView.id })
                    setQuickView(null)
                  }}
                >
                  <ShoppingBag size={17} /> Add to Cart
                </Button>
                <Button
                  onClick={() => {
                    navigate(`/product/${quickView.id}`)
                    setQuickView(null)
                  }}
                  variant="secondary"
                >
                  View Details <ArrowRight size={15} />
                </Button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  )
}
