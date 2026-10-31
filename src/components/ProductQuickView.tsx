import { Heart, Minus, Plus, ShoppingBag, X } from "lucide-react"
import { useEffect, useState } from "react"
import type { Product } from "../data/catalog"
import { formatNpr } from "../lib/search"
import { AppLink, Badge, Button, Heading, IconButton } from "./ui"

export function ProductQuickView({
  product,
  saved,
  onClose,
  onSave,
  onAdd,
}: {
  product: Product
  saved: boolean
  onClose: () => void
  onSave: () => void
  onAdd: (quantity: number) => void
}) {
  const [quantity, setQuantity] = useState(1)
  useEffect(() => {
    document
      .querySelector<HTMLButtonElement>(".search-quick-view .quick-view__close")
      ?.focus()
    const handleKey = (event: KeyboardEvent) =>
      event.key === "Escape" && onClose()
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    <div className="overlay overlay--center" onMouseDown={onClose}>
      <section
        aria-label={`Quick view for ${product.name}`}
        aria-modal="true"
        className="quick-view search-quick-view"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <IconButton
          className="quick-view__close"
          label="Close quick view"
          onClick={onClose}
        >
          <X size={20} />
        </IconButton>
        <div className="quick-view__image">
          <img alt={product.name} src={product.image} />
        </div>
        <div className="quick-view__content">
          <span className="quick-view-category">
            {product.brand} · {product.subcategory}
          </span>
          <Heading>{product.name}</Heading>
          <strong className="quick-view-price">{formatNpr(product.price)}</strong>
          <p>{product.description}</p>
          <div className="quick-view-facts">
            <span>
              <strong>Availability</strong>
              {product.availability}
            </span>
            <span>
              <strong>Delivery</strong>Free across Nepal
            </span>
          </div>
          <div className="quantity-row">
            <span>Quantity</span>
            <div>
              <IconButton
                disabled={quantity === 1}
                label="Decrease quantity"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              >
                <Minus size={16} />
              </IconButton>
              <strong>{quantity}</strong>
              <IconButton
                label="Increase quantity"
                onClick={() => setQuantity((value) => value + 1)}
              >
                <Plus size={16} />
              </IconButton>
            </div>
          </div>
          <div className="quick-view-actions">
            <Button onClick={() => onAdd(quantity)}>
              <ShoppingBag size={17} /> Add to cart
            </Button>
            <IconButton
              className={saved ? "is-saved" : ""}
              label="Toggle wishlist"
              onClick={onSave}
            >
              <Heart fill={saved ? "currentColor" : "none"} size={18} />
            </IconButton>
          </div>
          <AppLink onClick={onClose} to={`/product/${product.id}`}>
            View full product details <span>→</span>
          </AppLink>
        </div>
      </section>
    </div>
  )
}
