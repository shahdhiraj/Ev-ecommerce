import { useEffect, useState } from "react"
import { ChevronRight, FileText, Lock, Scale, ShieldCheck } from "lucide-react"
import { useLocation } from "react-router"
import { AppLink, Badge, Heading } from "../components/ui"

export function LegalPage() {
  const location = useLocation()
  const isPrivacy = location.pathname.includes("privacy")

  const title = isPrivacy
    ? "Privacy & Data Protection Policy"
    : "Terms of Service & Consumer Rights"
  const effectiveDate = "October 2026"

  const sections = isPrivacy
    ? [
        { id: "collection", title: "1. Information We Collect" },
        {
          id: "courier-disclosure",
          title: "2. Courier Delivery & Address Disclosure",
        },
        {
          id: "payment-security",
          title: "3. Payment & Financial Data Security",
        },
        { id: "cookies", title: "4. Cookies & Web Analytics" },
        { id: "retention", title: "5. Data Retention & User Rights" },
        { id: "contact-officer", title: "6. Privacy Compliance Liaison" },
      ]
    : [
        { id: "introduction", title: "1. Platform Use & Eligibility" },
        {
          id: "landed-cost",
          title: "2. Transparent Pricing & 13% VAT Guarantee",
        },
        {
          id: "shipping-delivery",
          title: "3. Domestic Doorstep Delivery in Nepal",
        },
        {
          id: "returns-warranty",
          title: "4. Returns, Defect Inspection & Warranty",
        },
        {
          id: "payments-pricing",
          title: "5. Pricing in NPR & Currency Conversion",
        },
        {
          id: "governing-law",
          title: "6. Governing Law & Jurisdiction (Nepal)",
        },
      ]

  const [activeSection, setActiveSection] = useState(sections[0].id)

  const scrollTo = (id: string) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="ubuy-legal-page container">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="ubuy-breadcrumbs">
        <AppLink to="/">Home</AppLink>
        <ChevronRight size={14} className="crumb-sep" />
        <span className="crumb-active">{title}</span>
      </nav>

      {/* Header */}
      <div className="legal-header-block">
        <Heading as="h1">{title}</Heading>
        <p className="legal-date-meta">
          Effective as of {effectiveDate} · Applicable to purchases and
          doorstep delivery across Nepal
        </p>
      </div>

      {/* Layout with Sticky Table of Contents and Main Legal Content */}
      <div className="legal-layout-grid">
        {/* Table of Contents */}
        <aside className="legal-toc-aside" aria-label="Table of Contents">
          <div className="toc-card">
            <h3 className="toc-heading">Table of Contents</h3>
            <nav className="toc-nav">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  className={`toc-link ${
                    activeSection === sec.id ? "is-active" : ""
                  }`}
                  onClick={() => scrollTo(sec.id)}
                  type="button"
                >
                  {sec.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content Column */}
        <main className="legal-content-article">
          {isPrivacy ? (
            /* PRIVACY POLICY CONTENT */
            <>
              <section id="collection" className="legal-section">
                <h2>1. Information We Collect</h2>
                <p>
                  To facilitate order processing, verification, and doorstep
                  delivery across Nepal, ABC EV PART collects essential customer
                  information including your full legal name, delivery address
                  within Nepal (province, district, municipality, ward, and
                  locality), verified contact phone number (+977), and email
                  address.
                </p>
                <p>
                  We also collect device telemetry and browser interaction logs
                  to ensure platform security, prevent fraudulent payment
                  attempts, and preserve your shopping cart and garage
                  preferences across sessions.
                </p>
              </section>

              <section id="courier-disclosure" className="legal-section">
                <h2>2. Courier Delivery & Address Disclosure</h2>
                <p>
                  To fulfill orders across Nepal, recipient name, delivery address,
                  and mobile contact numbers are shared securely with authorized domestic courier partners
                  (Express Nepal Courier, Nepal Post EMS, and regional logistics providers).
                </p>
                <p>
                  This information is used strictly to coordinate transit, dispatch tracking SMS,
                  and execute verified doorstep delivery within your district and ward.
                </p>
              </section>

              <section id="payment-security" className="legal-section">
                <h2>3. Payment & Financial Data Security</h2>
                <p>
                  All payment transactions conducted on ABC EV PART are encrypted
                  via TLS 1.3 protocol. Credit card information is processed
                  directly through PCI-DSS Level 1 compliant gateway partners
                  with mandatory 3D Secure validation.
                </p>
                <p>
                  Domestic payments routed through Fonepay QR, eSewa, or Khalti
                  are authenticated directly within your respective banking or
                  wallet applications. ABC EV PART does not store your banking
                  credentials or PINs.
                </p>
              </section>

              <section id="cookies" className="legal-section">
                <h2>4. Cookies & Web Analytics</h2>
                <p>
                  We use strictly necessary cookies to maintain your shopping
                  cart state, garage wishlist, and authenticated session.
                  Analytical cookies assist us in measuring catalog search
                  performance and page latency across mobile networks in Nepal.
                </p>
              </section>

              <section id="retention" className="legal-section">
                <h2>5. Data Retention & User Rights</h2>
                <p>
                  Order documentation and tax receipts are retained for the
                  duration mandated by the Nepal Inland Revenue Department for
                  commercial tax verification. You possess the right to access,
                  rectify, or request the deletion of your personal account
                  records by contacting our privacy compliance liaison.
                </p>
              </section>

              <section id="contact-officer" className="legal-section">
                <h2>6. Privacy Compliance Liaison</h2>
                <p>
                  For inquiries regarding data protection policies or to submit
                  a formal personal data inquiry, contact:
                </p>
                <div className="legal-contact-box">
                  <strong>ABC EV PART Privacy & Compliance Desk</strong>
                  <p>Email: privacy@abcevpart.com.np</p>
                  <p>Physical Address: Lazimpat, Kathmandu 44600, Nepal</p>
                </div>
              </section>
            </>
          ) : (
            /* TERMS OF SERVICE CONTENT */
            <>
              <section id="introduction" className="legal-section">
                <h2>1. Platform Use & Eligibility</h2>
                <p>
                  By accessing ABC EV PART and utilizing our online store
                  services, you agree to comply with these Terms of Service and
                  affirm that you are at least 18 years of age or possess legal
                  guardian authorization under Nepal contract law.
                </p>
              </section>

              <section id="landed-cost" className="legal-section">
                <h2>2. Transparent Pricing & 13% VAT Guarantee</h2>
                <p>
                  ABC EV PART provides an all-inclusive pricing model in Nepali Rupees (NPR).
                  The total displayed at checkout reflects the product price, domestic delivery fee,
                  and 13% Nepal VAT in full compliance with Nepal Inland Revenue guidelines.
                </p>
                <p>
                  Under our <strong>Transparent Pricing Guarantee</strong>, you will never be asked
                  to pay additional fees, fuel surcharges, or hidden costs upon doorstep arrival.
                </p>
              </section>

              <section id="shipping-delivery" className="legal-section">
                <h2>3. Domestic Doorstep Delivery in Nepal</h2>
                <p>
                  Orders are dispatched from our central warehouse in Kathmandu for scheduled delivery
                  across all 7 provinces. Typical transit takes 1 to 2 business days in Kathmandu Valley,
                  and 2 to 4 business days for major provincial cities and regional districts.
                </p>
              </section>

              <section id="returns-warranty" className="legal-section">
                <h2>4. Returns, Defect Inspection & Warranty</h2>
                <p>
                  Customers are entitled to a 7-day inspection window upon
                  physical receipt of the package. If a product is verified to
                  be defective, non-functional, or discordant with
                  specifications, ABC EV PART will arrange reverse air logistics for
                  replacement or refund to your original payment method.
                </p>
              </section>

              <section id="payments-pricing" className="legal-section">
                <h2>5. Pricing in NPR & Currency Conversion</h2>
                <p>
                  All catalog prices, shipping fees, and taxes are stated and
                  billed in Nepalese Rupees (NPR). Where foreign exchange
                  conversion applies to overseas OEM procurement, rates are
                  updated daily according to Nepal Rastra Bank reference rates.
                </p>
              </section>

              <section id="governing-law" className="legal-section">
                <h2>6. Governing Law & Jurisdiction (Nepal)</h2>
                <p>
                  These Terms of Service are governed by and construed in
                  accordance with the laws of Nepal, including the Electronic
                  Transactions Act and Consumer Protection Act. Any disputes
                  shall be subject to the exclusive jurisdiction of the courts
                  of Kathmandu, Nepal.
                </p>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
