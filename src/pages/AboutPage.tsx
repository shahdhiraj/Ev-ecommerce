import {
  ArrowRight,
  CheckCircle2,
  Package,
  ShieldCheck,
  Truck,
  Users,
  Zap,
} from "lucide-react"
import { useNavigate } from "react-router"
import { AppLink, Badge, Button, Heading } from "../components/ui"

export function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className="ubuy-about-page container">
      {/* Editorial Hero */}
      <section className="about-hero-section">
        <Heading as="h1" className="about-title">
          Nepal's Premier Destination for High-Performance Tech & Components
        </Heading>
        <p className="about-lead">
          ABC EV PART delivers genuine automotive technology, electronics, and accessories directly to your doorstep across Nepal with complete price transparency and 13% VAT included upfront.
        </p>
      </section>

      {/* 3 Core Pillars */}
      <section className="about-pillars-grid">
        <div className="pillar-card">
          <div className="pillar-icon-box text-amber-500">
            <ShieldCheck size={28} />
          </div>
          <h3 className="pillar-title">100% Genuine & Factory Warrantied</h3>
          <p className="pillar-desc">
            We source genuine products with verifiable manufacturer serialization and authentic quality certificates for peace of mind in Nepal.
          </p>
        </div>

        <div className="pillar-card">
          <div className="pillar-icon-box text-blue-500">
            <Truck size={28} />
          </div>
          <h3 className="pillar-title">Nationwide Nepal Delivery</h3>
          <p className="pillar-desc">
            Our domestic delivery network serves all 7 provinces across Nepal—from Kathmandu Valley to Pokhara, Chitwan, Biratnagar, and regional hubs.
          </p>
        </div>

        <div className="pillar-card">
          <div className="pillar-icon-box text-emerald-500">
            <Zap size={28} />
          </div>
          <h3 className="pillar-title">13% Nepal VAT & Transparent Pricing</h3>
          <p className="pillar-desc">
            No hidden charges or surprise delivery fees. All purchases include official 13% Nepal VAT with registered tax invoices.
          </p>
        </div>
      </section>

      {/* Sourcing Centers */}
      <section className="about-markets-section">
        <div className="section-head text-center mb-10">
          <span className="section-eyebrow">Genuine Brands</span>
          <Heading as="h2">Sourced from World-Class Manufacturers</Heading>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm mt-2">
            Bringing authentic engineering components from top brands directly to Nepal.
          </p>
        </div>

        <div className="markets-grid">
          <div className="market-card">
            <span className="market-flag">🇩🇪</span>
            <strong>Germany & Central Europe</strong>
            <small>800V Powertrain, Inverters, Brembo Carbon Ceramics</small>
          </div>
          <div className="market-card">
            <span className="market-flag">🇺🇸</span>
            <strong>United States</strong>
            <small>Silicon Carbide (SiC) Power Modules, NACS Adapters</small>
          </div>
          <div className="market-card">
            <span className="market-flag">🇯🇵</span>
            <strong>Japan</strong>
            <small>Prismatic LFP Battery Packs & Dry-Carbon Aerodynamics</small>
          </div>
          <div className="market-card">
            <span className="market-flag">🇬🇧</span>
            <strong>United Kingdom</strong>
            <small>Active Telemetry, CAN-FD Loggers & Diagnostic ECUs</small>
          </div>
          <div className="market-card">
            <span className="market-flag">🇰🇷</span>
            <strong>South Korea</strong>
            <small>High-Density Solid-State Prototype Modules</small>
          </div>
          <div className="market-card">
            <span className="market-flag">🇦🇺</span>
            <strong>Australia</strong>
            <small>Outback Calibrated EV Suspension & Magnetic Dampers</small>
          </div>
        </div>
      </section>

      {/* Nepal Operations & Concierge */}
      <section className="about-nepal-presence">
        <div className="nepal-presence-content">
          <span className="section-eyebrow">Local Commitment</span>
          <Heading as="h2">Kathmandu Concierge & Logistics Hub</Heading>
          <p className="text-slate-600 mb-4">
            Located in Lazimpat, Kathmandu, our dedicated Nepal operations desk
            works directly with local courier networks across Bagmati, Gandaki,
            Koshi, Lumbini, Madhesh, Karnali, and Sudurpashchim provinces to
            ensure prompt doorstep delivery even in high-elevation regions.
          </p>

          <div className="presence-stats-list">
            <div className="p-stat">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>
                Full compliance with Nepal Inland Revenue Department (IRD)
              </span>
            </div>
            <div className="p-stat">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>
                Centralized dispatch from Kathmandu fulfillment hub with
                real-time tracking
              </span>
            </div>
            <div className="p-stat">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>
                Doorstep delivery across all major municipalities in Nepal
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate("/search")}
            >
              Explore Products <ArrowRight size={16} />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/contact")}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
