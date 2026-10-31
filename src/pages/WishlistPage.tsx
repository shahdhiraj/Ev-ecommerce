import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  Filter,
  Heart,
  Import,
  ListChecks,
  MapPin,
  PackageCheck,
  RotateCcw,
  Scale,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  X,
} from "lucide-react"
import { useOutletContext, useSearchParams } from "react-router"
import { ProductCard } from "../components/ProductCard"
import { ProductComparisonModal } from "../components/ProductComparisonModal"
import { ProductQuickView } from "../components/ProductQuickView"
import type {
  StorefrontContext,
  WishlistEntry,
} from "../components/StorefrontShell"
import {
  AppLink,
  Badge,
  Button,
  Choice,
  Heading,
  IconButton,
  Input,
  Select,
} from "../components/ui"
import { catalogue, type Product } from "../data/catalog"
import { formatNpr, normalize, trackCommerceEvent } from "../lib/search"

const demoWishlistIds = [
  "apex-900-axial-flux-motor",
  "silicon-carbide-800v-inverter",
  "quantum-82kwh-battery-pack",
  "brembo-carbon-ceramic-ev",
  "volt-pulse-22kw-wallbox",
  "ccs2-to-nacs-ultra-adapter",
  "aerovolt-dry-carbon-aero",
  "bilstein-ev-adaptive-coilovers",
]

const demoEntries: WishlistEntry[] = demoWishlistIds.map((productId) => ({
  id: `${productId}:demo`,
  productId,
  variantId: null,
  savedAt: null,
}))

function WishlistLoadingSkeleton() {
  return (
    <div className="wishlist-grid" aria-label="Loading wishlist">
      {Array.from({ length: 8 }, (_, index) => (
        <div className="wishlist-skeleton" key={index}>
          <span />
          <i />
          <i />
          <i />
        </div>
      ))}
    </div>
  )
}

function EmptyWishlist({ demoAvailable }: { demoAvailable: boolean }) {
  return (
    <section className="wishlist-empty">
      <div className="empty-heart-art">
        <span>
          <Heart />
        </span>
        <i />
        <i />
      </div>
      <Heading as="h1">Your EV Garage is Empty.</Heading>
      <p>
        Save high-voltage motors, silicon carbide inverters, and battery modules
        here to configure your build.
      </p>
      <div>
        <AppLink
          onClick={() =>
            trackCommerceEvent("wishlist_empty_cta_clicked", {
              destination: "search",
            })
          }
          to="/search"
          variant="button"
        >
          Explore EV Components <ArrowRight size={17} />
        </AppLink>
      </div>
      {demoAvailable && (
        <AppLink className="demo-preview-link" to="/wishlist?demo=1">
          Open development-only demo preview
        </AppLink>
      )}
    </section>
  )
}

export function WishlistPage() {
  const {
    addToCart,
    wishlist,
    wishlistEntries,
    toggleWishlist,
    removeWishlistEntry,
    restoreWishlistEntry,
    clearWishlist,
    recentlyViewed,
    viewProduct,
    comparison,
    toggleComparison,
    notify,
  } = useOutletContext<StorefrontContext>()
  const [searchParams] = useSearchParams()
  const demoMode = searchParams.get("demo") === "1"
  const loadError = searchParams.get("state") === "error"
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All Saved")
  const [sort, setSort] = useState("recent")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [quickView, setQuickView] = useState<Product | null>(null)
  const [compareOpen, setCompareOpen] = useState(false)
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [undoEntries, setUndoEntries] = useState<WishlistEntry[]>([])

  const sourceEntries = demoMode ? demoEntries : wishlistEntries
  const resolvedEntries = sourceEntries.map((entry) => ({
    entry,
    product:
      catalogue.find((product) => product.id === entry.productId) || null,
  }))
  const validProducts = resolvedEntries.filter(
    (item): item is { entry: WishlistEntry; product: Product } =>
      Boolean(item.product),
  )
  const missingEntries = resolvedEntries.filter((item) => !item.product)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 220)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!loading)
      trackCommerceEvent("wishlist_viewed", {
        count: sourceEntries.length,
        demo: demoMode,
      })
  }, [loading, sourceEntries.length, demoMode])

  const categories = useMemo(
    () =>
      [...new Set(validProducts.map(({ product }) => product.category))].sort(),
    [wishlistEntries, demoMode],
  )
  const brands = useMemo(
    () =>
      [...new Set(validProducts.map(({ product }) => product.brand))].sort(),
    [wishlistEntries, demoMode],
  )
  const regions = useMemo(
    () =>
      [...new Set(validProducts.map(({ product }) => product.region))].sort(),
    [wishlistEntries, demoMode],
  )

  const filteredItems = useMemo(() => {
    const normalizedQuery = normalize(query)
    const filtered = validProducts.filter(({ product }) => {
      if (activeCategory !== "All Saved" && product.category !== activeCategory)
        return false
      if (
        availabilityFilter !== "all" &&
        product.availability !== availabilityFilter
      )
        return false
      if (regionFilter !== "all" && product.region !== regionFilter)
        return false
      if (!normalizedQuery) return true
      return normalize(
        `${product.name} ${product.brand} ${product.category} ${product.detail?.model || ""} ${product.attributes.join(" ")}`,
      ).includes(normalizedQuery)
    })
    return [...filtered].sort((left, right) => {
      if (sort === "oldest")
        return (
          (left.entry.savedAt ?? Number.MAX_SAFE_INTEGER) -
          (right.entry.savedAt ?? Number.MAX_SAFE_INTEGER)
        )
      if (sort === "price-asc")
        return (
          (left.product.price ?? Infinity) - (right.product.price ?? Infinity)
        )
      if (sort === "price-desc")
        return (right.product.price ?? -1) - (left.product.price ?? -1)
      if (sort === "name")
        return left.product.name.localeCompare(right.product.name)
      if (sort === "brand")
        return left.product.brand.localeCompare(right.product.brand)
      return (right.entry.savedAt ?? -1) - (left.entry.savedAt ?? -1)
    })
  }, [
    validProducts,
    query,
    activeCategory,
    availabilityFilter,
    regionFilter,
    sort,
  ])

  const totalKnownPrice = validProducts.reduce(
    (sum, { product }) => sum + (product.price || 0),
    0,
  )
  const availableCount = validProducts.filter(
    ({ product }) => product.availability === "In Stock",
  ).length
  const reviewCount = validProducts.filter(
    ({ product }) => product.availability === "Custom Order",
  ).length
  const activeFilters =
    (availabilityFilter !== "all" ? 1 : 0) +
    (regionFilter !== "all" ? 1 : 0) +
    (activeCategory !== "All Saved" ? 1 : 0)
  const compareProducts = catalogue.filter((product) =>
    comparison.has(product.id),
  )
  const actualSavedProductIds = new Set(
    validProducts.map(({ product }) => product.id),
  )
  const viewedProducts = recentlyViewed
    .map((id) => catalogue.find((product) => product.id === id))
    .filter(
      (product): product is Product =>
        Boolean(product) &&
        Boolean(product && !actualSavedProductIds.has(product.id)),
    )
    .slice(0, 4)
  const recommendationCategories = new Set(
    validProducts.map(({ product }) => product.category),
  )
  const recommendations = catalogue
    .filter(
      (product) =>
        !actualSavedProductIds.has(product.id) &&
        (!recommendationCategories.size ||
          recommendationCategories.has(product.category)),
    )
    .slice(0, 4)

  const resolveVariant = (entry: WishlistEntry, product: Product) => {
    if (entry.variantId)
      return product.detail?.variants.find(
        (item) => item.id === entry.variantId,
      )
    return product.detail?.variants[0]
  }

  const addProductToCart = (
    entry: WishlistEntry,
    product: Product,
    move = false,
  ) => {
    if (product.availability === "Out of Stock") {
      notify(
        `${product.name} is out of stock in the demo catalogue and was not added.`,
      )
      return false
    }
    const variant = resolveVariant(entry, product)
    if (entry.variantId && !variant) {
      notify(`Choose another variant for ${product.name} before adding it.`)
      return false
    }
    addToCart(product.name, { variant: variant?.label, sku: variant?.sku })
    trackCommerceEvent(
      move ? "wishlist_move_to_cart" : "wishlist_add_to_cart",
      { productId: product.id },
    )
    if (move && !demoMode) removeWithUndo([entry])
    return true
  }

  const removeWithUndo = (entries: WishlistEntry[]) => {
    if (demoMode) {
      notify("Demo preview items are not part of your persisted wishlist.")
      return
    }
    entries.forEach((entry) => removeWishlistEntry(entry.id))
    setUndoEntries(entries)
    trackCommerceEvent("wishlist_product_removed", { count: entries.length })
    window.setTimeout(
      () => setUndoEntries((current) => (current === entries ? [] : current)),
      6000,
    )
  }

  const undoRemoval = () => {
    undoEntries.forEach(restoreWishlistEntry)
    trackCommerceEvent("wishlist_remove_undone", { count: undoEntries.length })
    setUndoEntries([])
  }

  const toggleSelected = (entryId: string) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      next.has(entryId) ? next.delete(entryId) : next.add(entryId)
      return next
    })
  }

  const runBulkAdd = () => {
    const selected = validProducts.filter(({ entry }) =>
      selectedIds.has(entry.id),
    )
    const succeeded = selected.filter(({ entry, product }) =>
      addProductToCart(entry, product),
    )
    notify(
      `${succeeded.length} of ${selected.length} selected products added to your demo cart.`,
    )
    trackCommerceEvent("wishlist_bulk_action", {
      action: "add_to_cart",
      count: succeeded.length,
    })
  }

  const runBulkCompare = () => {
    const selected = validProducts.filter(({ entry }) =>
      selectedIds.has(entry.id),
    )
    if (!selected.length) return
    const category = selected[0].product.category
    const compatible = selected
      .filter(({ product }) => product.category === category)
      .slice(0, 4)
    ;[...comparison].forEach(toggleComparison)
    compatible.forEach(({ product }) => toggleComparison(product.id))
    if (compatible.length !== selected.length)
      notify(
        "Only compatible products from the same category were selected for comparison.",
      )
    setCompareOpen(true)
    trackCommerceEvent("wishlist_bulk_action", {
      action: "compare",
      count: compatible.length,
    })
  }

  const handleCompare = (product: Product) => {
    if (comparison.has(product.id)) return toggleComparison(product.id)
    const current = catalogue.filter((item) => comparison.has(item.id))
    if (current.length && current[0].category !== product.category)
      return notify(
        "Compare products from the same category for meaningful results.",
      )
    if (comparison.size >= 4)
      return notify("You can compare up to four products.")
    toggleComparison(product.id)
  }

  if (loading)
    return (
      <div className="container wishlist-loading">
        <WishlistLoadingSkeleton />
      </div>
    )

  if (loadError)
    return (
      <section className="container wishlist-error">
        <span>
          <AlertTriangle />
        </span>
        <Heading as="h1">We couldn’t load your wishlist.</Heading>
        <p>Your locally saved items have not been changed.</p>
        <div>
          <AppLink to="/wishlist" variant="button">
            <RotateCcw size={17} /> Try Again
          </AppLink>
          <AppLink to="/" variant="subtle">
            Continue Shopping
          </AppLink>
        </div>
      </section>
    )

  if (!sourceEntries.length)
    return (
      <div className="wishlist-page">
        <div className="container">
          <EmptyWishlist demoAvailable={import.meta.env.DEV} />
        </div>
        {undoEntries.length > 0 && (
          <div className="wishlist-undo" aria-live="polite">
            <span>
              Removed{" "}
              {undoEntries.length === 1
                ? "from your wishlist"
                : `${undoEntries.length} products from your wishlist`}
              .
            </span>
            <Button onClick={undoRemoval} size="sm" variant="ghost">
              Undo
            </Button>
            <IconButton
              label="Dismiss removal message"
              onClick={() => setUndoEntries([])}
            >
              <X size={15} />
            </IconButton>
          </div>
        )}
      </div>
    )

  return (
    <div className="wishlist-page">
      <nav aria-label="Breadcrumb" className="container wishlist-breadcrumb">
        <AppLink to="/">Home</AppLink>
        <ChevronRight size={13} />
        <span>Saved EV Garage</span>
      </nav>
      <header className="container wishlist-header">
        <div>
          <span>High-Voltage Workspace</span>
          <Heading as="h1">Saved EV Garage</Heading>
          <p>
            Your saved powertrain hardware, battery systems, and performance
            components.
          </p>
          <strong aria-live="polite">
            {sourceEntries.length} saved{" "}
            {sourceEntries.length === 1 ? "component" : "components"}
          </strong>
        </div>
        <div>
          <AppLink to="/search" variant="button">
            Browse Catalog <ArrowRight size={17} />
          </AppLink>
          {!demoMode && (
            <Button onClick={() => setClearConfirmOpen(true)} variant="ghost">
              <Trash2 size={16} /> Clear Garage
            </Button>
          )}
        </div>
      </header>

      {demoMode && (
        <div className="container demo-preview-banner">
          <Sparkles />
          <span>
            <strong>Development preview mode</strong>These products are not
            saved to your real local wishlist.
          </span>
          <AppLink to="/wishlist">View actual wishlist</AppLink>
        </div>
      )}

      <section className="container wishlist-overview">
        <div>
          <span>
            <Heart />
          </span>
          <p>
            <small>Saved items</small>
            <strong>{sourceEntries.length}</strong>
          </p>
        </div>
        <div>
          <span>
            <PackageCheck />
          </span>
          <p>
            <small>Demo catalogue: In Stock</small>
            <strong>{availableCount}</strong>
          </p>
        </div>
        <div>
          <span>
            <CircleHelp />
          </span>
          <p>
            <small>Availability unknown</small>
            <strong>{reviewCount}</strong>
          </p>
        </div>
        <div>
          <span>
            <ShoppingBag />
          </span>
          <p>
            <small>Combined item prices</small>
            <strong>{formatNpr(totalKnownPrice)}</strong>
            <em>Excludes shipping and import charges</em>
          </p>
        </div>
      </section>

      <section className="container wishlist-controls">
        <div className="wishlist-search">
          <Search size={18} />
          <Input
            aria-label="Search saved products"
            onChange={(event) => {
              setQuery(event.target.value)
              trackCommerceEvent("wishlist_search_used", {
                queryLength: event.target.value.length,
              })
            }}
            placeholder="Search your saved products..."
            value={query}
          />
          {query && (
            <IconButton
              label="Clear saved-product search"
              onClick={() => setQuery("")}
            >
              <X size={15} />
            </IconButton>
          )}
        </div>
        <div>
          <Select
            aria-label="Filter availability"
            onChange={(event) => {
              setAvailabilityFilter(event.target.value)
              trackCommerceEvent("wishlist_filter_applied", {
                filter: "availability",
              })
            }}
            value={availabilityFilter}
          >
            <option value="all">All availability</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Unknown">Unknown</option>
          </Select>
          <Select
            aria-label="Filter source region"
            onChange={(event) => {
              setRegionFilter(event.target.value)
              trackCommerceEvent("wishlist_filter_applied", {
                filter: "region",
              })
            }}
            value={regionFilter}
          >
            <option value="all">All regions</option>
            {regions.map((region) => (
              <option key={region}>{region}</option>
            ))}
          </Select>
          <Select
            aria-label="Sort saved products"
            onChange={(event) => {
              setSort(event.target.value)
              trackCommerceEvent("wishlist_sort_changed", {
                sort: event.target.value,
              })
            }}
            value={sort}
          >
            <option value="recent">Recently Saved</option>
            <option value="oldest">Oldest Saved</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Product Name: A–Z</option>
            <option value="brand">Brand: A–Z</option>
          </Select>
          <Button
            className="wishlist-mobile-filter"
            onClick={() => setFilterSheetOpen(true)}
            variant="secondary"
          >
            <Filter size={17} /> Filters{" "}
            {activeFilters > 0 && <span>{activeFilters}</span>}
          </Button>
          <Button
            className={selectionMode ? "is-active" : ""}
            onClick={() => {
              setSelectionMode((value) => !value)
              setSelectedIds(new Set())
            }}
            variant="secondary"
          >
            <ListChecks size={17} />{" "}
            {selectionMode ? "Cancel Selection" : "Select Items"}
          </Button>
        </div>
      </section>

      <div
        className="container wishlist-tabs"
        role="tablist"
        aria-label="Saved product categories"
      >
        {["All Saved", ...categories].map((category) => (
          <Button
            aria-selected={activeCategory === category}
            className={activeCategory === category ? "is-active" : ""}
            key={category}
            onClick={() => setActiveCategory(category)}
            role="tab"
            variant="ghost"
          >
            {category}
            <span>
              {category === "All Saved"
                ? sourceEntries.length
                : validProducts.filter(
                    ({ product }) => product.category === category,
                  ).length}
            </span>
          </Button>
        ))}
      </div>

      <main className="container wishlist-main">
        {missingEntries.length > 0 && (
          <div className="missing-saved-items">
            <AlertTriangle />
            <span>
              <strong>
                {missingEntries.length} saved{" "}
                {missingEntries.length === 1 ? "item is" : "items are"} no
                longer in the demo catalogue.
              </strong>
              <small>
                The saved identifiers are preserved. Remove them only if you no
                longer need them.
              </small>
            </span>
            {!demoMode && (
              <Button
                onClick={() =>
                  removeWithUndo(missingEntries.map(({ entry }) => entry))
                }
                size="sm"
                variant="ghost"
              >
                Remove unavailable
              </Button>
            )}
          </div>
        )}
        {!filteredItems.length ? (
          <section className="wishlist-filtered-empty">
            <Search />
            <Heading>No saved products found.</Heading>
            <p>Try a different search term or clear your active filters.</p>
            <div>
              <Button onClick={() => setQuery("")} variant="secondary">
                Clear Search
              </Button>
              <Button
                onClick={() => {
                  setActiveCategory("All Saved")
                  setAvailabilityFilter("all")
                  setRegionFilter("all")
                }}
                variant="ghost"
              >
                Clear Filters
              </Button>
            </div>
          </section>
        ) : (
          <div className="wishlist-grid">
            {filteredItems.map(({ entry, product }) => {
              const variant = resolveVariant(entry, product)
              const selected = selectedIds.has(entry.id)
              return (
                <article
                  className={`wishlist-card-wrap ${
                    selected ? "is-selected" : ""
                  }`}
                  key={entry.id}
                >
                  {selectionMode && (
                    <label className="wishlist-select">
                      <Choice
                        aria-label={`Select ${product.name}`}
                        checked={selected}
                        onChange={() => toggleSelected(entry.id)}
                        type="checkbox"
                      />
                      <span>Select</span>
                    </label>
                  )}
                  <ProductCard
                    onAdd={() => addProductToCart(entry, product)}
                    onQuickView={() => {
                      setQuickView(product)
                      viewProduct(product.id)
                    }}
                    onSave={() => removeWithUndo([entry])}
                    onView={() => {
                      viewProduct(product.id)
                      trackCommerceEvent("wishlist_product_clicked", {
                        productId: product.id,
                      })
                    }}
                    product={product}
                    query=""
                    saved
                    view="grid"
                  />
                  <div className="wishlist-card-management">
                    <span>
                      {variant
                        ? `Saved variant: ${variant.label}`
                        : entry.variantId
                          ? "Saved variant unavailable"
                          : "Standard selection"}
                    </span>
                    <div>
                      <Button
                        disabled={product.availability === "Out of Stock"}
                        onClick={() => addProductToCart(entry, product, true)}
                        size="sm"
                        variant="ghost"
                      >
                        Move to Cart
                      </Button>
                      <Button
                        onClick={() => removeWithUndo([entry])}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 size={14} /> Remove
                      </Button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
        {activeFilters > 0 && (
          <div className="wishlist-filter-summary">
            <Filter size={15} /> {activeFilters} active{" "}
            {activeFilters === 1 ? "filter" : "filters"}
            <Button
              onClick={() => {
                setActiveCategory("All Saved")
                setAvailabilityFilter("all")
                setRegionFilter("all")
              }}
              size="sm"
              variant="ghost"
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>

      {viewedProducts.length > 0 && (
        <section className="container wishlist-secondary-section">
          <div className="section-heading">
            <Heading>Recently Viewed</Heading>
          </div>
          <div className="wishlist-mini-grid">
            {viewedProducts.map((product) => (
              <AppLink key={product.id} to={`/product/${product.id}`}>
                <img alt={product.name} src={product.image} />
                <span>
                  <small>{product.brand}</small>
                  <strong>{product.name}</strong>
                  <em>{formatNpr(product.price)}</em>
                </span>
              </AppLink>
            ))}
          </div>
        </section>
      )}

      <section className="wishlist-recommendations">
        <div className="container">
          <div className="pdp-section-heading">
            <span>
              {validProducts.length
                ? "Rule-based recommendations"
                : "Curated catalogue"}
            </span>
            <Heading>More to Explore</Heading>
            <p>
              {validProducts.length
                ? "Products from categories represented in your saved collection."
                : "A selection from the demo catalogue."}
            </p>
          </div>
          <div className="wishlist-recommendation-grid">
            {recommendations.map((product) => (
              <ProductCard
                key={product.id}
                onAdd={() => addToCart(product.name)}
                onQuickView={() => {
                  setQuickView(product)
                  viewProduct(product.id)
                }}
                onSave={() => toggleWishlist(product.id)}
                onView={() => viewProduct(product.id)}
                product={product}
                query=""
                saved={wishlist.has(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="wishlist-confidence">
        <div className="container">
          <div>
            <span>Saved on your device</span>
            <Heading>Shop With Confidence in Nepal.</Heading>
          </div>
          <div>
            {[
              [ShieldCheck, "100% Genuine products"],
              [Truck, "Doorstep delivery across Nepal"],
              [Zap, "13% VAT included upfront"],
              [MapPin, "Live order tracking"],
            ].map(([Icon, label]) => {
              const ConfidenceIcon = Icon as typeof ShieldCheck
              return (
                <AppLink key={String(label)} to="/help">
                  <ConfidenceIcon />
                  {String(label)}
                </AppLink>
              )
            })}
          </div>
        </div>
      </section>

      <aside className="container guest-wishlist-note">
        <ShieldCheck />
        <span>
          <strong>Saved on this device</strong>
          <small>
            This prototype uses local browser storage. Cross-device account
            synchronization is not connected.
          </small>
        </span>
      </aside>

      {quickView && (
        <ProductQuickView
          onAdd={(quantity) => {
            const entry = sourceEntries.find(
              (item) => item.productId === quickView.id,
            ) || {
              id: "",
              productId: quickView.id,
              variantId: null,
              savedAt: null,
            }
            addToCart(quickView.name, {
              quantity,
              variant: resolveVariant(entry, quickView)?.label,
              sku: resolveVariant(entry, quickView)?.sku,
            })
            setQuickView(null)
          }}
          onClose={() => setQuickView(null)}
          onSave={() => toggleWishlist(quickView.id)}
          product={quickView}
          saved={wishlist.has(quickView.id)}
        />
      )}

      {undoEntries.length > 0 && (
        <div className="wishlist-undo" aria-live="polite">
          <span>
            Removed{" "}
            {undoEntries.length === 1
              ? "from your wishlist"
              : `${undoEntries.length} products from your wishlist`}
            .
          </span>
          <Button onClick={undoRemoval} size="sm" variant="ghost">
            Undo
          </Button>
          <IconButton
            label="Dismiss removal message"
            onClick={() => setUndoEntries([])}
          >
            <X size={15} />
          </IconButton>
        </div>
      )}

      {clearConfirmOpen && (
        <div
          className="overlay overlay--center"
          onMouseDown={() => setClearConfirmOpen(false)}
        >
          <section
            aria-modal="true"
            className="wishlist-confirm"
            role="dialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <span>
              <Trash2 />
            </span>
            <Heading>Clear your wishlist?</Heading>
            <p>
              This removes all persisted saved products from this browser. You
              can undo immediately afterward.
            </p>
            <div>
              <Button
                onClick={() => setClearConfirmOpen(false)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const entries = [...wishlistEntries]
                  clearWishlist()
                  setUndoEntries(entries)
                  setClearConfirmOpen(false)
                }}
              >
                Clear Wishlist
              </Button>
            </div>
          </section>
        </div>
      )}

      {filterSheetOpen && (
        <div
          className="overlay mobile-sheet-overlay"
          onMouseDown={() => setFilterSheetOpen(false)}
        >
          <section
            aria-label="Wishlist filters"
            aria-modal="true"
            className="mobile-sheet wishlist-filter-sheet"
            role="dialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <span className="sheet-handle" />
            <div className="drawer__header">
              <span>Filter saved products</span>
              <IconButton
                label="Close filters"
                onClick={() => setFilterSheetOpen(false)}
              >
                <X size={20} />
              </IconButton>
            </div>
            <div className="wishlist-filter-sheet__body">
              <label>
                Availability
                <Select
                  onChange={(event) =>
                    setAvailabilityFilter(event.target.value)
                  }
                  value={availabilityFilter}
                >
                  <option value="all">All availability</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Unknown">Unknown</option>
                </Select>
              </label>
              <label>
                Source region
                <Select
                  onChange={(event) => setRegionFilter(event.target.value)}
                  value={regionFilter}
                >
                  <option value="all">All regions</option>
                  {regions.map((region) => (
                    <option key={region}>{region}</option>
                  ))}
                </Select>
              </label>
            </div>
            <div className="mobile-sheet__footer">
              <Button
                onClick={() => {
                  setAvailabilityFilter("all")
                  setRegionFilter("all")
                }}
                variant="ghost"
              >
                Clear All
              </Button>
              <Button
                onClick={() => {
                  setFilterSheetOpen(false)
                  trackCommerceEvent("wishlist_filter_applied", {
                    count: activeFilters,
                  })
                }}
              >
                Show {filteredItems.length} Items
              </Button>
            </div>
          </section>
        </div>
      )}

      {selectionMode && selectedIds.size > 0 && (
        <div className="wishlist-selection-bar">
          <div>
            <strong>{selectedIds.size} selected</strong>
            <Button onClick={runBulkAdd} size="sm">
              <ShoppingBag size={16} /> Add to Cart
            </Button>
            <Button
              onClick={() =>
                removeWithUndo(
                  validProducts
                    .filter(({ entry }) => selectedIds.has(entry.id))
                    .map(({ entry }) => entry),
                )
              }
              size="sm"
              variant="ghost"
            >
              <Trash2 size={16} /> Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
