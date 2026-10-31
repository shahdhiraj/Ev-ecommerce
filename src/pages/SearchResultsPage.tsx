import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  ArrowRight,
  BatteryCharging,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Cpu,
  Filter,
  Gauge,
  Grid2X2,
  List,
  LoaderCircle,
  MapPin,
  PackageSearch,
  RotateCcw,
  Scale,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Truck,
  Wrench,
  X,
  Zap,
} from "lucide-react"
import { useOutletContext, useSearchParams } from "react-router"
import { ProductCard } from "../components/ProductCard"
import { ProductComparisonModal } from "../components/ProductComparisonModal"
import { ProductQuickView } from "../components/ProductQuickView"
import type { StorefrontContext } from "../components/StorefrontShell"
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
import {
  catalogue,
  catalogueBrands,
  catalogueSubcategories,
  catalogueVoltages,
  catalogueRegions,
  type Product,
} from "../data/catalog"
import {
  findCorrection,
  formatNpr,
  searchCatalogue,
  trackCommerceEvent,
} from "../lib/search"

const PAGE_SIZE = 12
const allowedSorts = new Set([
  "relevance",
  "price-asc",
  "price-desc",
  "newest",
  "popularity",
])
const refinementMap = [
  ["800V High Voltage", "800V High Voltage"],
  ["Silicon Carbide (SiC)", "Silicon Carbide (SiC)"],
  ["LFP Blade Chemistry", "LFP Blade Chemistry"],
  ["Carbon Ceramic", "Carbon Ceramic"],
  ["Liquid Cooled", "Liquid Cooled"],
  ["22kW AC Fast", "22kW AC Fast"],
  ["Direct-Drive", "Direct-Drive"],
  ["Track Approved", "Track Approved"],
] as const

type FilterParams = URLSearchParams

function getCsv(params: FilterParams, key: string) {
  return params.get(key)?.split(",").filter(Boolean) || []
}

function setCsv(params: FilterParams, key: string, values: string[]) {
  values.length ? params.set(key, values.join(",")) : params.delete(key)
}

function toggleCsv(params: FilterParams, key: string, value: string) {
  const values = getCsv(params, key)
  setCsv(
    params,
    key,
    values.includes(value)
      ? values.filter((item) => item !== value)
      : [...values, value],
  )
}

function FilterGroup({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className={`filter-group ${open ? "is-open" : ""}`}>
      <Button
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        variant="ghost"
      >
        <span>{title}</span>
        <ChevronDown size={16} />
      </Button>
      {open && <div className="filter-group__content">{children}</div>}
    </section>
  )
}

function FilterOption({
  label,
  count,
  checked,
  onChange,
}: {
  label: string
  count: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="filter-option">
      <Choice checked={checked} onChange={onChange} type="checkbox" />
      <span>{label}</span>
      <small>{count}</small>
    </label>
  )
}

function SearchFilterSidebar({
  params,
  baseProducts,
  onChange,
}: {
  params: FilterParams
  baseProducts: Product[]
  onChange: (next: URLSearchParams) => void
}) {
  const selectedBrands = getCsv(params, "brand")
  const selectedSubcategories = getCsv(params, "subcategory")
  const selectedVoltages = getCsv(params, "voltage")
  const selectedRegions = getCsv(params, "region")
  const selectedAvailability = getCsv(params, "availability")
  const selectedFeatures = getCsv(params, "feature")
  const [brandQuery, setBrandQuery] = useState("")
  const [showAllBrands, setShowAllBrands] = useState(false)

  const update = (mutate: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(params)
    mutate(next)
    next.delete("page")
    onChange(next)
  }

  const count = (predicate: (product: Product) => boolean) =>
    baseProducts.filter(predicate).length
  const visibleBrands = catalogueBrands
    .filter((brand) => brand.toLowerCase().includes(brandQuery.toLowerCase()))
    .filter((brand) => baseProducts.some((product) => product.brand === brand))
    .slice(0, showAllBrands ? undefined : 6)
  const featureOptions = [
    ...new Set(baseProducts.flatMap((product) => product.attributes)),
  ].filter((feature) =>
    [
      "800V High Voltage",
      "Silicon Carbide (SiC)",
      "Axial Flux",
      "Liquid Cooled",
      "LFP Blade Chemistry",
      "Carbon Ceramic",
      "22kW AC Fast",
      "Direct-Drive",
      "Track Approved",
      "CAN FD",
    ].includes(feature),
  )

  return (
    <div className="search-filter-panel">
      <div className="filter-panel-heading">
        <strong>Filter EV Systems</strong>
        <span>{baseProducts.length} components</span>
      </div>

      <FilterGroup title="EV Component Subsystem">
        {catalogueSubcategories.map((subcat) => {
          const optionCount = count((product) => product.subcategory === subcat)
          if (!optionCount) return null
          return (
            <FilterOption
              checked={selectedSubcategories.includes(subcat)}
              count={optionCount}
              key={subcat}
              label={subcat}
              onChange={() =>
                update((next) => toggleCsv(next, "subcategory", subcat))
              }
            />
          )
        })}
      </FilterGroup>

      <FilterGroup title="Voltage Architecture">
        {catalogueVoltages.map((volt) => {
          const optionCount = count((product) => product.voltage === volt)
          if (!optionCount) return null
          return (
            <FilterOption
              checked={selectedVoltages.includes(volt)}
              count={optionCount}
              key={volt}
              label={volt}
              onChange={() =>
                update((next) => toggleCsv(next, "voltage", volt))
              }
            />
          )
        })}
      </FilterGroup>

      <FilterGroup title="Price Range (NPR)">
        <div className="price-range">
          <div>
            <label>
              Minimum
              <Input
                aria-label="Minimum price"
                min="0"
                onChange={(event) =>
                  update((next) =>
                    event.target.value
                      ? next.set("min", event.target.value)
                      : next.delete("min"),
                  )
                }
                placeholder="0"
                type="number"
                value={params.get("min") || ""}
              />
            </label>
            <label>
              Maximum
              <Input
                aria-label="Maximum price"
                min="0"
                onChange={(event) =>
                  update((next) =>
                    event.target.value
                      ? next.set("max", event.target.value)
                      : next.delete("max"),
                  )
                }
                placeholder="1000000"
                type="number"
                value={params.get("max") || ""}
              />
            </label>
          </div>
          <Input
            aria-label="Maximum price slider"
            max="1000000"
            min="25000"
            onChange={(event) =>
              update((next) => next.set("max", event.target.value))
            }
            step="25000"
            type="range"
            value={params.get("max") || "1000000"}
          />
          <span>
            NPR 25,000 <span>NPR 1,000,000</span>
          </span>
        </div>
      </FilterGroup>

      <FilterGroup title="Manufacturer / Brand">
        <div className="filter-search">
          <Search size={14} />
          <Input
            aria-label="Search brands"
            onChange={(event) => setBrandQuery(event.target.value)}
            placeholder="Search EV brands"
            value={brandQuery}
          />
        </div>
        {visibleBrands.map((brand) => (
          <FilterOption
            checked={selectedBrands.includes(brand)}
            count={count((product) => product.brand === brand)}
            key={brand}
            label={brand}
            onChange={() => update((next) => toggleCsv(next, "brand", brand))}
          />
        ))}
        {visibleBrands.length >= 6 && (
          <Button
            className="show-more-filter"
            onClick={() => setShowAllBrands((value) => !value)}
            size="sm"
            variant="ghost"
          >
            {showAllBrands ? "Show less" : "Show more"}
          </Button>
        )}
      </FilterGroup>

      <FilterGroup title="Component Availability">
        {(["In Stock", "Custom Order", "Out of Stock"] as const).map(
          (availability) => {
            const optionCount = count(
              (product) => product.availability === availability,
            )
            return optionCount ? (
              <FilterOption
                checked={selectedAvailability.includes(availability)}
                count={optionCount}
                key={availability}
                label={availability}
                onChange={() =>
                  update((next) =>
                    toggleCsv(next, "availability", availability),
                  )
                }
              />
            ) : null
          },
        )}
      </FilterGroup>

      {featureOptions.length > 0 && (
        <FilterGroup title="Technical Attributes">
          {featureOptions.map((feature) => (
            <FilterOption
              checked={selectedFeatures.includes(feature)}
              count={count((product) => product.attributes.includes(feature))}
              key={feature}
              label={feature}
              onChange={() =>
                update((next) => toggleCsv(next, "feature", feature))
              }
            />
          ))}
        </FilterGroup>
      )}

      <div className="filter-disclosure">
        <ShieldCheck size={16} />
        <span>
          All components include high-voltage factory diagnostic calibration
          certificates.
        </span>
      </div>
    </div>
  )
}

function SearchLoadingSkeleton({ view }: { view: "grid" | "list" }) {
  return (
    <div
      aria-label="Loading search results"
      className={`search-results-grid search-results-grid--${view}`}
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div className="search-skeleton" key={index}>
          <span />
          <div>
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SearchResultsPage() {
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    recentlyViewed,
    viewProduct,
    clearRecentlyViewed,
    comparison,
    toggleComparison,
    notify,
    products,
  } = useOutletContext<StorefrontContext>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [quickView, setQuickView] = useState<Product | null>(null)
  const [compareOpen, setCompareOpen] = useState(false)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [sortSheetOpen, setSortSheetOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const query = searchParams.get("q")?.trim() || ""
  const sort = allowedSorts.has(searchParams.get("sort") || "")
    ? searchParams.get("sort")!
    : "relevance"
  const view = searchParams.get("view") === "list" ? "list" : "grid"

  useEffect(() => {
    setLoading(true)
    setVisibleCount(PAGE_SIZE)
    const timer = window.setTimeout(() => setLoading(false), 200)
    return () => window.clearTimeout(timer)
  }, [searchParams])

  const currentCatalog = products && products.length > 0 ? products : catalogue

  const scoredResults = useMemo(
    () => searchCatalogue(currentCatalog, query),
    [currentCatalog, query],
  )
  const baseProducts = useMemo(
    () => scoredResults.map(({ product }) => product),
    [scoredResults],
  )
  const selectedBrands = getCsv(searchParams, "brand")
  const selectedSubcategories = getCsv(searchParams, "subcategory")
  const selectedVoltages = getCsv(searchParams, "voltage")
  const selectedRegions = getCsv(searchParams, "region")
  const selectedAvailability = getCsv(searchParams, "availability")
  const selectedFeatures = getCsv(searchParams, "feature")
  const minPrice = Number(searchParams.get("min") || 0)
  const maxPrice = Number(searchParams.get("max") || Number.MAX_SAFE_INTEGER)

  const filteredProducts = useMemo(() => {
    const filtered = scoredResults.filter(({ product }) => {
      if (selectedBrands.length && !selectedBrands.includes(product.brand))
        return false
      if (
        selectedSubcategories.length &&
        !selectedSubcategories.includes(product.subcategory)
      )
        return false
      if (
        selectedVoltages.length &&
        !selectedVoltages.includes(product.voltage)
      )
        return false
      if (selectedRegions.length && !selectedRegions.includes(product.region))
        return false
      if (
        selectedAvailability.length &&
        !selectedAvailability.includes(product.availability)
      )
        return false
      if (
        selectedFeatures.length &&
        !selectedFeatures.every((feature) =>
          product.attributes.includes(feature),
        )
      )
        return false
      if (
        product.price !== null &&
        (product.price < minPrice || product.price > maxPrice)
      )
        return false
      return true
    })
    return [...filtered]
      .sort((left, right) => {
        if (sort === "price-asc")
          return (
            (left.product.price ?? Infinity) - (right.product.price ?? Infinity)
          )
        if (sort === "price-desc")
          return (right.product.price ?? -1) - (left.product.price ?? -1)
        if (sort === "newest")
          return right.product.createdAt - left.product.createdAt
        if (sort === "popularity")
          return right.product.popularity - left.product.popularity
        return (
          right.score - left.score ||
          right.product.popularity - left.product.popularity
        )
      })
      .map(({ product }) => product)
  }, [
    scoredResults,
    selectedBrands,
    selectedSubcategories,
    selectedVoltages,
    selectedRegions,
    selectedAvailability,
    selectedFeatures,
    minPrice,
    maxPrice,
    sort,
  ])

  const displayedProducts = filteredProducts.slice(0, visibleCount)
  const correction = findCorrection(query)
  const activeFilterCount =
    selectedBrands.length +
    selectedSubcategories.length +
    selectedVoltages.length +
    selectedRegions.length +
    selectedAvailability.length +
    selectedFeatures.length +
    (searchParams.has("min") ? 1 : 0) +
    (searchParams.has("max") ? 1 : 0)

  const updateParams = (next: URLSearchParams, event?: "filter" | "sort") => {
    setSearchParams(next)
    if (event === "filter")
      trackCommerceEvent("search_filter_applied", {
        count: activeFilterCount + 1,
      })
    if (event === "sort")
      trackCommerceEvent("search_sort_changed", {
        sort: next.get("sort") || "relevance",
      })
  }

  const clearFilters = () => {
    const next = new URLSearchParams()
    if (query) next.set("q", query)
    if (sort !== "relevance") next.set("sort", sort)
    if (view !== "grid") next.set("view", view)
    setSearchParams(next)
  }

  const toggleRefinement = (filterValue: string) => {
    const next = new URLSearchParams(searchParams)
    toggleCsv(next, "feature", filterValue)
    next.delete("page")
    updateParams(next, "filter")
  }

  const toggleCompare = (product: Product) => {
    const compareIds = [...comparison]
    if (comparison.has(product.id)) return toggleComparison(product.id)
    if (compareIds.length >= 4) {
      notify("You can compare up to four EV components.")
      return
    }
    toggleComparison(product.id)
  }

  const compareIds = [...comparison]
  const compareProducts = catalogue.filter((product) =>
    comparison.has(product.id),
  )
  const hasQueryMatches = baseProducts.length > 0

  return (
    <div className="search-page">
      <div className="container search-breadcrumb">
        <AppLink to="/">Home</AppLink>
        <ChevronRight size={13} />
        <span>Catalog</span>
      </div>

      <section className="container search-intro">
        <div>
          <Heading as="h1">
            {query ? (
              <>
                Results for <span>“{query}”</span>
              </>
            ) : (
              "All Products"
            )}
          </Heading>
          <p>
            {query
              ? `Showing products matching "${query}".`
              : "Authentic products delivered directly to your doorstep across Nepal with 13% VAT included."}
          </p>
          <strong aria-live="polite">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}{" "}
            found
          </strong>
        </div>
      </section>

      {correction && baseProducts.length > 0 && (
        <div className="container spelling-suggestion">
          Showing results for “{query}”. Did you mean{" "}
          <AppLink to={`/search?q=${encodeURIComponent(correction)}`}>
            “{correction}”
          </AppLink>
          ?
        </div>
      )}

      {/* EV Refinement Chips */}
      <div className="container refinement-row" aria-label="Search refinements">
        <span>Refine Spec:</span>
        {refinementMap.map(([label, value]) => {
          const active = selectedFeatures.includes(value)
          return (
            <Button
              className={active ? "is-active" : ""}
              key={label}
              onClick={() => toggleRefinement(value)}
              size="sm"
              variant="secondary"
            >
              {active && <Check size={14} />}
              {label}
            </Button>
          )
        })}
      </div>

      <section className="container search-toolbar">
        <span>
          Showing {filteredProducts.length ? 1 : 0}–
          {Math.min(visibleCount, filteredProducts.length)} of{" "}
          {filteredProducts.length} EV parts
        </span>
        <div>
          <Button
            className="mobile-filter-button"
            onClick={() => setFilterSheetOpen(true)}
            size="sm"
            variant="secondary"
          >
            <Filter size={16} /> Filters{" "}
            {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
          </Button>
          <label className="sort-control">
            <span>Sort by</span>
            <Select
              aria-label="Sort results"
              onChange={(event) => {
                const next = new URLSearchParams(searchParams)
                next.set("sort", event.target.value)
                next.delete("page")
                updateParams(next, "sort")
              }}
              value={sort}
            >
              <option value="relevance">Technical Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Latest Innovations</option>
              <option value="popularity">Most Specified</option>
            </Select>
          </label>
          <div className="view-toggle" role="group" aria-label="Result view">
            <IconButton
              className={view === "grid" ? "is-active" : ""}
              label="Grid view"
              onClick={() => {
                const next = new URLSearchParams(searchParams)
                next.set("view", "grid")
                updateParams(next)
              }}
            >
              <Grid2X2 size={18} />
            </IconButton>
            <IconButton
              className={view === "list" ? "is-active" : ""}
              label="List view"
              onClick={() => {
                const next = new URLSearchParams(searchParams)
                next.set("view", "list")
                updateParams(next)
              }}
            >
              <List size={19} />
            </IconButton>
          </div>
        </div>
      </section>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="container active-filter-row" aria-live="polite">
          <span>Active criteria:</span>
          {selectedBrands.map((value) => (
            <Button
              key={value}
              onClick={() => {
                const next = new URLSearchParams(searchParams)
                toggleCsv(next, "brand", value)
                updateParams(next, "filter")
              }}
              size="sm"
              variant="secondary"
            >
              {value} <X size={13} />
            </Button>
          ))}
          {selectedSubcategories.map((value) => (
            <Button
              key={value}
              onClick={() => {
                const next = new URLSearchParams(searchParams)
                toggleCsv(next, "subcategory", value)
                updateParams(next, "filter")
              }}
              size="sm"
              variant="secondary"
            >
              {value} <X size={13} />
            </Button>
          ))}
          {selectedVoltages.map((value) => (
            <Button
              key={value}
              onClick={() => {
                const next = new URLSearchParams(searchParams)
                toggleCsv(next, "voltage", value)
                updateParams(next, "filter")
              }}
              size="sm"
              variant="secondary"
            >
              {value} <X size={13} />
            </Button>
          ))}
          {selectedFeatures.map((value) => (
            <Button
              key={value}
              onClick={() => toggleRefinement(value)}
              size="sm"
              variant="secondary"
            >
              {value} <X size={13} />
            </Button>
          ))}
          {(searchParams.has("min") || searchParams.has("max")) && (
            <Button
              onClick={() => {
                const next = new URLSearchParams(searchParams)
                next.delete("min")
                next.delete("max")
                updateParams(next, "filter")
              }}
              size="sm"
              variant="secondary"
            >
              {`NPR ${minPrice.toLocaleString()} – ${
                maxPrice === Number.MAX_SAFE_INTEGER
                  ? "Any"
                  : maxPrice.toLocaleString()
              }`}{" "}
              <X size={13} />
            </Button>
          )}
          <Button onClick={clearFilters} size="sm" variant="ghost">
            Clear all filters
          </Button>
        </div>
      )}

      <div className="container search-layout">
        <aside className="desktop-filters" aria-label="Search filters">
          <SearchFilterSidebar
            baseProducts={baseProducts}
            onChange={(next) => updateParams(next, "filter")}
            params={searchParams}
          />
        </aside>

        <div className="search-results-area">
          {loading ? (
            <SearchLoadingSkeleton view={view} />
          ) : !filteredProducts.length ? (
            <div className="search-empty-state">
              <span>
                <PackageSearch />
              </span>
              <Heading>
                {hasQueryMatches
                  ? "Filters are too restrictive."
                  : "No EV components found."}
              </Heading>
              <p>
                {hasQueryMatches
                  ? "We have components matching this query, but none match all selected filter constraints."
                  : "Try searching for “motor”, “inverter”, “battery”, “wallbox”, or “brakes”."}
              </p>
              <div>
                {activeFilterCount > 0 && (
                  <Button onClick={clearFilters}>Reset Filters</Button>
                )}
                <AppLink to="/search" variant="button">
                  View All EV Components
                </AppLink>
              </div>
            </div>
          ) : (
            <>
              <div
                className={`search-results-grid search-results-grid--${view}`}
              >
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    onAdd={() => {
                      addToCart(product.name, { sku: product.id })
                      trackCommerceEvent("add_to_cart", {
                        productId: product.id,
                      })
                    }}
                    onQuickView={() => {
                      setQuickView(product)
                      viewProduct(product.id)
                      trackCommerceEvent("product_quick_view_opened", {
                        productId: product.id,
                      })
                    }}
                    onSave={() => {
                      toggleWishlist(product.id)
                      if (!wishlist.has(product.id))
                        trackCommerceEvent("wishlist_added", {
                          productId: product.id,
                        })
                    }}
                    onView={() => {
                      viewProduct(product.id)
                      trackCommerceEvent("search_result_clicked", {
                        productId: product.id,
                      })
                    }}
                    product={product}
                    query={query}
                    saved={wishlist.has(product.id)}
                    view={view}
                  />
                ))}
              </div>

              {filteredProducts.length > displayedProducts.length && (
                <div className="search-pagination">
                  <Button
                    onClick={() => setVisibleCount((curr) => curr + PAGE_SIZE)}
                    variant="secondary"
                  >
                    Load More EV Components (
                    {filteredProducts.length - displayedProducts.length}{" "}
                    remaining)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {quickView && (
        <ProductQuickView
          onAdd={() => addToCart(quickView.name, { sku: quickView.id })}
          onClose={() => setQuickView(null)}
          onSave={() => toggleWishlist(quickView.id)}
          product={quickView}
          saved={wishlist.has(quickView.id)}
        />
      )}

      {compareOpen && (
        <ProductComparisonModal
          onClear={() => compareIds.forEach((id) => toggleComparison(id))}
          onClose={() => setCompareOpen(false)}
          onRemove={(id) => toggleComparison(id)}
          products={compareProducts}
        />
      )}
    </div>
  )
}
