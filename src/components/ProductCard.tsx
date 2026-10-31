import { Eye, Heart, ShoppingBag, Zap } from "lucide-react"
import type { Product } from "../data/catalog"
import { formatNpr, normalize } from "../lib/search"
import { AppLink, Button, Heading } from "./ui"

function HighlightedTitle({ title, query }: { title: string; query: string }) {
  const meaningfulToken = normalize(query)
    .split(" ")
    .find((token) => token.length > 2)
  if (!meaningfulToken) return <>{title}</>
  const index = title.toLowerCase().indexOf(meaningfulToken)
  if (index < 0) return <>{title}</>
  return (
    <>
      {title.slice(0, index)}
      <mark>{title.slice(index, index + meaningfulToken.length)}</mark>
      {title.slice(index + meaningfulToken.length)}
    </>
  )
}

export function ProductCard({
  product,
  query,
  view = "grid",
  saved,
  onSave,
  onQuickView,
  onAdd,
  onView,
}: {
  product: Product
  query: string
  view?: "grid" | "list"
  saved: boolean
  compared?: boolean
  onSave: () => void
  onQuickView: () => void
  onAdd: () => void
  onCompare?: () => void
  onView?: () => void
}) {
  return (
    <article
      className={`search-product-card search-product-card--${view} search-product-card--clean`}
    >
      <div className="search-product-card__visual">
        <button
          aria-label={
            saved
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name}`
          }
          className={`card-wishlist-btn ${saved ? "is-active" : ""}`}
          onClick={onSave}
          type="button"
        >
          <Heart
            className={saved ? "text-red-500 fill-red-500" : "text-slate-700"}
            size={18}
          />
        </button>

        <img alt={product.name} loading="lazy" src={product.image} />

        <Button
          className="quick-view-trigger"
          onClick={onQuickView}
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
          onClick={onView}
          to={`/product/${product.id}`}
        >
          <Heading as="h3">
            <HighlightedTitle query={query} title={product.name} />
          </Heading>
        </AppLink>

        <div className="card-bottom-row">
          <div className="card-price-block">
            <span className="card-price">{formatNpr(product.price)}</span>
          </div>

          <div className="card-action-btns">
            <Button className="add-cart-btn" onClick={onAdd} size="sm">
              <ShoppingBag size={15} /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
