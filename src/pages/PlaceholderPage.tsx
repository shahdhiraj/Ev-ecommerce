import { ArrowLeft, Layers3 } from "lucide-react"
import { useLocation } from "react-router"
import { AppLink, Badge, Heading } from "../components/ui"

export function PlaceholderPage() {
  const location = useLocation()
  const title =
    location.pathname.split("/").filter(Boolean).at(-1)?.replace(/-/g, " ") ||
    "Page"

  return (
    <section className="placeholder-page container">
      <span className="placeholder-icon">
        <Layers3 />
      </span>
      <Badge tone="brand">Page foundation ready</Badge>
      <Heading as="h1">
        {title.charAt(0).toUpperCase() + title.slice(1)}
      </Heading>
      <p>
        This route is prepared for the next sequential page build and inherits
        the complete ABC EV PART store shell.
      </p>
      <AppLink to="/" variant="button">
        <ArrowLeft size={18} /> Back to home
      </AppLink>
    </section>
  )
}
