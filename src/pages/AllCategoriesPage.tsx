import {
  ArrowRight,
  BatteryCharging,
  Cpu,
  Gauge,
  Package,
  ShieldCheck,
  Truck,
  Wrench,
  Zap,
} from "lucide-react"
import { useNavigate } from "react-router"
import { AppLink, Badge, Button, Heading } from "../components/ui"
import { catalogue } from "../data/catalog"

export function AllCategoriesPage() {
  const navigate = useNavigate()

  const categories = [
    {
      name: "Powertrain & Motors",
      slug: "Powertrain+%26+Motors",
      image: "/images/subsystems/powertrain-motor.jpg",
      specs: "800V Architecture · Axial Flux · 1,150 Nm Max Torque",
      count: catalogue.filter(
        (p) =>
          p.subcategory.includes("Powertrain") ||
          p.subcategory.includes("Motor"),
      ).length,
      icon: <Zap size={22} className="text-amber-500" />,
      sublinks: [
        "Dual Axial Flux Motors",
        "Radial Traction Motors",
        "Direct-Drive Reductions",
        "Liquid Stator Kits",
      ],
    },
    {
      name: "Power Electronics & Inverters",
      slug: "Power+Electronics+%26+Inverters",
      image: "/images/subsystems/sic-inverter.jpg",
      specs: "Silicon Carbide (SiC) · 750A Phase · 99.4% Efficiency",
      count: catalogue.filter((p) => p.subcategory.includes("Inverter")).length,
      icon: <Cpu size={22} className="text-blue-500" />,
      sublinks: [
        "Dual SiC Inverters",
        "DC-DC Converters",
        "CAN FD Loggers",
        "Dielectric Chillers",
      ],
    },
    {
      name: "Battery & BMS",
      slug: "Battery+%26+BMS",
      image: "/images/subsystems/battery-pack.jpg",
      specs: "Prismatic LFP Blade · Active Balancing · Zero Thermal Runaway",
      count: catalogue.filter((p) => p.subcategory.includes("Battery")).length,
      icon: <BatteryCharging size={22} className="text-emerald-500" />,
      sublinks: [
        "LFP Blade Packs",
        "Smart Active BMS",
        "UN 38.3 Hazmat Certified",
        "Thermal Busbars",
      ],
    },
    {
      name: "Charging & Wallboxes",
      slug: "Charging+%26+Wallboxes",
      image: "/images/subsystems/charging-station.jpg",
      specs: "22kW AC Bi-Directional V2G · 250kW CCS2 Adapters",
      count: catalogue.filter((p) => p.subcategory.includes("Charging")).length,
      icon: <Truck size={22} className="text-purple-500" />,
      sublinks: [
        "22kW Smart Wallboxes",
        "CCS2 to NACS Ultra Adapters",
        "Mennekes Type 2",
        "OCPP 2.0 Cloud",
      ],
    },
    {
      name: "Brakes & Suspension",
      slug: "Brakes+%26+Suspension",
      image: "/images/subsystems/carbon-brakes.jpg",
      specs: "420mm Carbon-Ceramic Rotors · Adaptive Magnetic Coilovers",
      count: catalogue.filter(
        (p) =>
          p.subcategory.includes("Brakes") ||
          p.subcategory.includes("Suspension"),
      ).length,
      icon: <Wrench size={22} className="text-rose-500" />,
      sublinks: [
        "Carbon-Ceramic Rotors",
        "6-Piston Calipers",
        "Magnetic Ride Coilovers",
        "EV Spring Rates",
      ],
    },
    {
      name: "Aero & Carbon Performance",
      slug: "Aero+%26+Carbon+Performance",
      image: "/images/subsystems/carbon-aero.jpg",
      specs: "Pre-Preg Dry Carbon · Wind Tunnel Calibrated · 140kg Downforce",
      count: catalogue.filter((p) => p.subcategory.includes("Aero")).length,
      icon: <Gauge size={22} className="text-amber-500" />,
      sublinks: [
        "Dry Carbon Splitters",
        "Rear Underbody Diffusers",
        "Active Air Dams",
        "Titanium Hardware",
      ],
    },
  ]

  return (
    <div className="ubuy-categories-page container">
      <div className="categories-hero-head">
        <Heading as="h1">All Categories</Heading>
        <p className="categories-lead">
          Browse authentic products across all categories.
        </p>
      </div>

      <div className="categories-directory-grid">
        {categories.map((cat) => (
          <article key={cat.name} className="directory-cat-card">
            <div className="cat-card-visual">
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget
                  img.onerror = null
                  img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'%3E%3Crect width='400' height='260' fill='%230f172a'/%3E%3Ccircle cx='200' cy='120' r='48' fill='%231e293b'/%3E%3Cpath d='M200 95 L215 125 L195 125 L205 145 L185 115 L200 115 Z' fill='%23f58220'/%3E%3Ctext x='50%25' y='190' font-family='sans-serif' font-size='13' font-weight='700' fill='%2394a3b8' text-anchor='middle'%3EEV PERFORMANCE COMPONENT%3C/text%3E%3C/svg%3E"
                }}
              />
              <div className="cat-card-overlay">
                <span className="cat-icon-badge">{cat.icon}</span>
                <span className="cat-items-badge">
                  {cat.count > 0 ? `${cat.count} Available` : "Custom Order"}
                </span>
              </div>
            </div>

            <div className="cat-card-body">
              <h2 className="cat-heading">
                <AppLink to={`/search?subcategory=${cat.slug}`}>
                  {cat.name}
                </AppLink>
              </h2>
              <p className="cat-specs-text">{cat.specs}</p>

              <div className="cat-sublinks-list">
                {cat.sublinks.map((sublink) => (
                  <AppLink
                    key={sublink}
                    to={`/search?q=${encodeURIComponent(sublink)}`}
                    className="sublink-pill"
                  >
                    {sublink}
                  </AppLink>
                ))}
              </div>

              <div className="cat-card-bottom">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate(`/search?subcategory=${cat.slug}`)}
                >
                  Explore Systems <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
