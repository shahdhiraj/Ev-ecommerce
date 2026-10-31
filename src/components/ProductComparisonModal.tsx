import { Trash2, X } from "lucide-react"
import type { Product } from "../data/catalog"
import { formatNpr } from "../lib/search"
import { Button, IconButton } from "./ui"

export function ProductComparisonModal({
  products,
  onClose,
  onClear,
  onRemove,
}: {
  products: Product[]
  onClose: () => void
  onClear?: () => void
  onRemove?: (id: string) => void
}) {
  return (
    <div className="overlay overlay--center" onMouseDown={onClose}>
      <section
        aria-label="EV Component Technical Comparison"
        aria-modal="true"
        className="comparison-modal"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="drawer__header">
          <span>High-Voltage EV Component Specification Comparison</span>
          <div className="flex items-center gap-2">
            {onClear && products.length > 0 && (
              <Button onClick={onClear} size="sm" variant="ghost">
                <Trash2 size={15} /> Clear All
              </Button>
            )}
            <IconButton label="Close comparison" onClick={onClose}>
              <X size={20} />
            </IconButton>
          </div>
        </div>
        <div className="comparison-table">
          <div className="comparison-row comparison-row--products">
            <strong>EV Component</strong>
            {products.map((product) => (
              <span key={product.id} className="relative">
                {onRemove && (
                  <button
                    className="absolute top-1 right-1 text-slate-400 hover:text-red-500 p-1 rounded transition-colors focus-visible:outline-2 focus-visible:outline-[#f58220]"
                    onClick={() => onRemove(product.id)}
                    title="Remove component"
                    type="button"
                  >
                    <X size={14} />
                  </button>
                )}
                <img alt="" src={product.image} />
                <b>{product.name}</b>
              </span>
            ))}
          </div>
          {[
            "Price (NPR)",
            "Voltage Architecture",
            "Brand",
            "Subsystem Category",
            "Availability",
            "Source Region",
            "Engineering Attributes",
          ].map((field) => (
            <div className="comparison-row" key={field}>
              <strong>{field}</strong>
              {products.map((product) => (
                <span key={product.id}>
                  {field === "Price (NPR)"
                    ? formatNpr(product.price)
                    : field === "Voltage Architecture"
                      ? product.voltage
                      : field === "Brand"
                        ? product.brand
                        : field === "Subsystem Category"
                          ? product.subcategory
                          : field === "Availability"
                            ? product.availability
                            : field === "Source Region"
                              ? product.region
                              : product.attributes.slice(0, 4).join(", ") ||
                                "Not available"}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
