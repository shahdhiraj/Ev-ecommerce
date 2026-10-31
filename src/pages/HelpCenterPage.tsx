import { useState } from "react"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CreditCard,
  ExternalLink,
  FileText,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  RotateCcw,
  Search,
  ShieldCheck,
  Truck,
  Wallet,
  Zap,
} from "lucide-react"
import { useNavigate, useParams } from "react-router"
import { AppLink, Badge, Button, Heading, Input } from "../components/ui"
import { formatNpr } from "../lib/search"

type HelpCategoryKey = "pricing" | "shipping" | "returns" | "payments" | "orders"

interface FAQItem {
  question: string
  answer: string
}

export function HelpCenterPage() {
  const { topic } = useParams<{ topic?: string }>()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState("")
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  // Current active topic (normalize 'customs' to 'pricing' if accessed)
  const rawTopic = topic
  const activeTopic: HelpCategoryKey | undefined =
    rawTopic === "customs" ? "pricing" : (rawTopic as HelpCategoryKey | undefined)

  const categories = [
    {
      key: "shipping" as const,
      icon: <Truck size={24} className="text-amber-500" />,
      title: "Nepal Delivery & Tracking",
      description:
        "Doorstep delivery across all 7 provinces, Kathmandu express courier, and tracking.",
      link: "/help/shipping",
      articlesCount: 6,
    },
    {
      key: "payments" as const,
      icon: <Wallet size={24} className="text-emerald-500" />,
      title: "Payments, Fonepay & eSewa",
      description:
        "Paying via Fonepay QR, eSewa, Khalti, Debit/Credit cards, and 13% Nepal VAT tax invoices.",
      link: "/help/payments",
      articlesCount: 5,
    },
    {
      key: "pricing" as const,
      icon: <ShieldCheck size={24} className="text-blue-500" />,
      title: "13% Nepal VAT & Pricing",
      description:
        "Transparent all-inclusive pricing, Inland Revenue tax invoices, and zero hidden fees.",
      link: "/help/pricing",
      articlesCount: 4,
    },
    {
      key: "orders" as const,
      icon: <Package size={24} className="text-indigo-500" />,
      title: "Orders & Management",
      description:
        "How to track courier progress, modify delivery addresses, and view invoices.",
      link: "/help/orders",
      articlesCount: 6,
    },
    {
      key: "returns" as const,
      icon: <RotateCcw size={24} className="text-rose-500" />,
      title: "Returns & Warranty",
      description:
        "7-day easy inspection window, manufacturer warranty claims, and local support in Nepal.",
      link: "/help/returns",
      articlesCount: 5,
    },
    {
      key: "security" as const,
      icon: <ShieldCheck size={24} className="text-purple-500" />,
      title: "Account & Security",
      description:
        "Managing your Nepal delivery address book, two-factor authentication, and secure login.",
      link: "/account/security",
      articlesCount: 4,
    },
  ]

  const faqs: Record<string, FAQItem[]> = {
    general: [
      {
        question: "Where in Nepal does ABC EV PART deliver?",
        answer:
          "We provide nationwide doorstep delivery across all 7 provinces of Nepal, covering Kathmandu, Lalitpur, Bhaktapur, Pokhara, Chitwan, Biratnagar, Butwal, Nepalgunj, Dhangadhi, and regional districts.",
      },
      {
        question: "How long does delivery take within Nepal?",
        answer:
          "Orders within the Kathmandu Valley (Kathmandu, Lalitpur, Bhaktapur) typically arrive within 1 to 2 business days. For major provincial hubs such as Pokhara, Chitwan, and Biratnagar, delivery takes 2 to 4 business days.",
      },
      {
        question: "Are taxes and 13% VAT included in the displayed prices?",
        answer:
          "Yes. All product prices on ABC EV PART include mandatory 13% Nepal VAT. What you see is what you pay, with zero surprise fees or hidden charges upon doorstep arrival.",
      },
      {
        question: "Which local payment methods are accepted?",
        answer:
          "We accept Fonepay QR (compatible with all Nepal mobile banking apps), eSewa, Khalti, major Debit/Credit Cards (Visa, Mastercard with 3D Secure), and Cash on Delivery (COD) for eligible orders.",
      },
      {
        question: "What is the return and warranty policy in Nepal?",
        answer:
          "We provide a 7-day inspection window from the date of physical doorstep delivery. If a component arrives defective or damaged, our Kathmandu support team arranges free collection and an immediate replacement or full refund.",
      },
    ],
    pricing: [
      {
        question: "How is pricing structured on ABC EV PART?",
        answer:
          "All items listed are fully cleared and priced in Nepali Rupees (NPR). The price shown includes product value, 13% Nepal VAT, and full domestic packaging. Zero hidden fees.",
      },
      {
        question: "Will I receive an official Nepal tax invoice?",
        answer:
          "Yes. Every completed order receives a VAT-compliant tax invoice registered under Nepal Inland Revenue regulations, downloadable directly from your My Orders page.",
      },
    ],
    shipping: [
      {
        question: "Which domestic courier services do you use?",
        answer:
          "We partner with trusted express couriers including Nepal Post EMS, Express Nepal Courier, and dedicated regional cargo carriers operating daily between Kathmandu and all provinces.",
      },
      {
        question: "Can heavy parts and battery equipment be delivered outside Kathmandu?",
        answer:
          "Yes. Our ground cargo partners operate scheduled freight routes to Gandaki, Koshi, Lumbini, and all provinces equipped with proper handling for automotive and electronic equipment.",
      },
    ],
  }

  const currentFaqs =
    activeTopic && faqs[activeTopic] ? faqs[activeTopic] : faqs.general

  return (
    <div className="ubuy-help-page container">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="ubuy-breadcrumbs">
        <AppLink to="/">Home</AppLink>
        <ChevronRight size={14} className="crumb-sep" />
        {activeTopic ? (
          <>
            <AppLink to="/help">Help Center</AppLink>
            <ChevronRight size={14} className="crumb-sep" />
            <span className="crumb-active capitalize">{activeTopic} Guide</span>
          </>
        ) : (
          <span className="crumb-active">Help Center</span>
        )}
      </nav>

      {/* Hero Search Section */}
      <section className="help-hero-section">
        <Heading as="h1" className="help-hero-title">
          How Can We Help You?
        </Heading>
        <p className="help-hero-desc">
          Find answers about domestic doorstep delivery, local payment methods, 13% Nepal VAT, and returns.
        </p>

        {/* Large Search Input */}
        <div className="help-search-box">
          <Search size={20} className="help-search-icon" />
          <input
            type="text"
            className="help-search-input"
            placeholder="Search topics (e.g. delivery to Pokhara, Fonepay, 13% VAT, returns)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Quick Help Topics Pills */}
        <div className="help-quick-pills">
          <span className="pills-label">Popular Searches:</span>
          <button type="button" onClick={() => navigate("/help/shipping")}>
            Delivery Timelines
          </button>
          <button type="button" onClick={() => navigate("/help/payments")}>
            Fonepay & eSewa
          </button>
          <button type="button" onClick={() => navigate("/help/pricing")}>
            13% VAT Policy
          </button>
          <button type="button" onClick={() => navigate("/track-order")}>
            Order Tracking
          </button>
        </div>
      </section>

      {/* TOPIC SPECIFIC VIEW (e.g. /help/pricing) */}
      {activeTopic === "pricing" && (
        <section className="topic-guide-card">
          <div className="topic-head-row">
            <div className="flex items-center gap-3">
              <ShieldCheck size={28} className="text-amber-500" />
              <div>
                <Heading as="h2">
                  Nepal 13% VAT & Pricing Guide
                </Heading>
                <p className="text-slate-500 text-sm">
                  Official billing and taxation compliance under the Inland Revenue Department of Nepal.
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => navigate("/help")}>
              All Help Topics
            </Button>
          </div>

          <div className="topic-guide-body">
            <h3>Transparent All-Inclusive Pricing</h3>
            <p>
              Under Nepal tax regulations, all commercial retail purchases within Nepal are subject to 13% Value Added Tax (VAT).
              ABC EV PART displays all product pricing with 13% VAT included upfront so there are no hidden surprises upon delivery.
            </p>

            <div className="customs-highlight-box">
              <ShieldCheck size={22} className="text-emerald-600 shrink-0" />
              <div>
                <strong>Official Tax Invoice Guarantee:</strong>
                <p>
                  Every completed purchase comes with a registered VAT-compliant invoice downloadable from your account or sent to your email.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TOPIC SPECIFIC VIEW: SHIPPING */}
      {activeTopic === "shipping" && (
        <section className="topic-guide-card">
          <div className="topic-head-row">
            <div className="flex items-center gap-3">
              <Truck size={28} className="text-blue-500" />
              <div>
                <Heading as="h2">
                  Nepal Domestic Delivery Guide
                </Heading>
                <p className="text-slate-500 text-sm">
                  Delivery timelines, courier partners, and provincial coverage.
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => navigate("/help")}>
              All Help Topics
            </Button>
          </div>

          <div className="topic-guide-body">
            <h3>Transit Timelines Across Nepal</h3>
            <div className="transit-regions-grid">
              <div className="region-card">
                <strong>
                  Kathmandu Valley (Kathmandu, Lalitpur, Bhaktapur)
                </strong>
                <span className="region-eta">1–2 Business Days</span>
                <p className="text-xs text-slate-500 mt-1">
                  Same-day or next-day express courier dispatch from Kathmandu hub.
                </p>
              </div>
              <div className="region-card">
                <strong>Gandaki Province (Pokhara, Syangja, Tanahun)</strong>
                <span className="region-eta">2–3 Business Days</span>
                <p className="text-xs text-slate-500 mt-1">
                  Dedicated express courier transport along the Prithvi Highway corridor.
                </p>
              </div>
              <div className="region-card">
                <strong>
                  Koshi, Lumbini & Madhesh (Biratnagar, Butwal, Chitwan, Birgunj)
                </strong>
                <span className="region-eta">2–4 Business Days</span>
                <p className="text-xs text-slate-500 mt-1">
                  Regional logistics hubs with doorstep verification and signature.
                </p>
              </div>
              <div className="region-card">
                <strong>
                  Karnali & Sudurpashchim (Surkhet, Dhangadhi, Mahendranagar)
                </strong>
                <span className="region-eta">3–5 Business Days</span>
                <p className="text-xs text-slate-500 mt-1">
                  Provincial express line-haul to regional headquarters.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6 Category Help Cards (Shown on main /help) */}
      {!activeTopic && (
        <section className="help-categories-section">
          <div className="section-head mb-6">
            <span className="section-eyebrow">Browse by Department</span>
            <Heading as="h2">Help Categories</Heading>
          </div>

          <div className="help-categories-grid">
            {categories.map((cat) => (
              <div
                key={cat.key}
                className="help-category-card"
                onClick={() => navigate(cat.link)}
                role="button"
                tabIndex={0}
              >
                <div className="cat-card-icon-wrap">{cat.icon}</div>
                <h3 className="cat-card-title">{cat.title}</h3>
                <p className="cat-card-desc">{cat.description}</p>
                <span className="cat-card-link">
                  Explore Topics <ArrowRight size={14} />
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Frequently Asked Questions Accordion */}
      <section className="help-faq-section">
        <div className="section-head mb-6">
          <span className="section-eyebrow">Clear Answers</span>
          <Heading as="h2">Frequently Asked Questions</Heading>
        </div>

        <div className="faq-accordion-list">
          {currentFaqs.map((faq, index) => {
            const isOpen = openFaqIndex === index
            return (
              <div
                key={index}
                className={`faq-accordion-item ${isOpen ? "is-open" : ""}`}
              >
                <button
                  className="faq-question-btn"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  type="button"
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`faq-chevron ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="faq-answer-body">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Still Need Help Banner */}
      <section className="help-contact-banner">
        <div className="contact-banner-content">
          <div className="contact-banner-icon">
            <MessageCircle size={28} className="text-amber-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Still Have Questions?
            </h3>
            <p className="text-slate-600 text-sm">
              Our dedicated Kathmandu Concierge Desk is ready to assist you with
              product specifications, provincial delivery, or order status.
            </p>
          </div>
        </div>

        <div className="contact-banner-actions">
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate("/contact")}
          >
            Contact Concierge Desk <ArrowRight size={16} />
          </Button>
          <AppLink to="/account" className="button button--secondary">
            My Account
          </AppLink>
        </div>
      </section>
    </div>
  )
}
