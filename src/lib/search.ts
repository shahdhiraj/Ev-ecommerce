import type { Product } from "../data/catalog"

export const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim()

const distance = (left: string, right: string) => {
  const rows = Array.from({ length: left.length + 1 }, (_, row) => [row])
  for (let column = 1; column <= right.length; column += 1)
    rows[0][column] = column
  for (let row = 1; row <= left.length; row += 1) {
    for (let column = 1; column <= right.length; column += 1) {
      rows[row][column] = Math.min(
        rows[row - 1][column] + 1,
        rows[row][column - 1] + 1,
        rows[row - 1][column - 1] +
          (left[row - 1] === right[column - 1] ? 0 : 1),
      )
    }
  }
  return rows[left.length][right.length]
}

const searchableFields = (product: Product) => ({
  title: normalize(product.name),
  brand: normalize(product.brand),
  category: normalize(`${product.category} ${product.subcategory}`),
  attributes: normalize(product.attributes.join(" ")),
  description: normalize(product.description),
})

export function relevanceScore(product: Product, rawQuery: string) {
  const query = normalize(rawQuery)
  if (!query) return 1
  const tokens = query.split(" ").filter(Boolean)
  const fields = searchableFields(product)
  let score = 0

  if (fields.title === query) score += 120
  if (`${fields.brand} ${fields.title}`.includes(query)) score += 55
  if (fields.title.includes(query)) score += 45
  if (fields.brand === query) score += 42
  if (fields.category.includes(query)) score += 20

  tokens.forEach((token) => {
    if (fields.title.includes(token)) score += 16
    if (fields.brand.includes(token)) score += 13
    if (fields.category.includes(token)) score += 9
    if (fields.attributes.includes(token)) score += 6
    if (fields.description.includes(token)) score += 3

    const words = `${fields.title} ${fields.brand} ${fields.category}`.split(
      " ",
    )
    if (
      token.length >= 5 &&
      words.some(
        (word) =>
          Math.abs(word.length - token.length) <= 2 &&
          distance(word, token) <= 2,
      )
    ) {
      score += 5
    }
  })

  return score
}

export function searchCatalogue(products: Product[], query: string) {
  return products
    .map((product) => ({ product, score: relevanceScore(product, query) }))
    .filter(({ score }) => !query.trim() || score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.product.popularity - a.product.popularity,
    )
}

const supportedPhrases = [
  "axial flux motor",
  "silicon carbide inverter",
  "lfp battery pack",
  "carbon ceramic brakes",
  "22kw wallbox",
  "ccs2 to nacs adapter",
  "dry carbon aero splitter",
  "magnetic adaptive coilovers",
  "battery chiller heat pump",
  "ev wheels",
  "high voltage harness",
]

export function findCorrection(query: string) {
  const normalized = normalize(query)
  if (!normalized || supportedPhrases.includes(normalized)) return null
  const ranked = supportedPhrases
    .map((phrase) => ({ phrase, score: distance(normalized, phrase) }))
    .sort((a, b) => a.score - b.score)
  return ranked[0].score <= Math.max(3, Math.floor(normalized.length * 0.24))
    ? ranked[0].phrase
    : null
}

export function formatNpr(value: number | null) {
  return value === null
    ? "Price not available"
    : `NPR ${value.toLocaleString("en-NP")}`
}

export type AnalyticsEvent = "search_submitted" | "search_suggestion_clicked" | "search_results_viewed" | "search_filter_applied" | "search_sort_changed" | "search_result_clicked" | "search_no_results" | "search_refinement_clicked" | "product_quick_view_opened" | "add_to_cart" | "wishlist_added" | "wishlist_viewed" | "wishlist_product_removed" | "wishlist_remove_undone" | "wishlist_search_used" | "wishlist_filter_applied" | "wishlist_sort_changed" | "wishlist_product_clicked" | "wishlist_add_to_cart" | "wishlist_move_to_cart" | "wishlist_bulk_action" | "wishlist_empty_cta_clicked"

export function trackCommerceEvent(
  name: AnalyticsEvent,
  detail: Record<string, string | number | boolean> = {},
) {
  window.dispatchEvent(
    new CustomEvent("ubuy:analytics", { detail: { name, ...detail } }),
  )
}
