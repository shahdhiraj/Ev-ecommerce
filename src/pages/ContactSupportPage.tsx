import { useState } from "react"
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  Paperclip,
  Phone,
  Send,
  ShieldCheck,
  Zap,
} from "lucide-react"
import { useSearchParams } from "react-router"
import {
  AppLink,
  Badge,
  Button,
  Heading,
  Input,
  Select,
} from "../components/ui"
import { useCommerce } from "../lib/commerceContext"

export function ContactSupportPage() {
  const [searchParams] = useSearchParams()
  const orderRefFromUrl = searchParams.get("orderId") || ""
  const { user, notify } = useCommerce()

  const [name, setName] = useState(user.fullName || "")
  const [email, setEmail] = useState(user.email || "")
  const [topic, setTopic] = useState("Shipping & Delivery in Nepal")
  const [orderId, setOrderId] = useState(orderRefFromUrl)
  const [message, setMessage] = useState("")
  const [fileName, setFileName] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedTicket, setSubmittedTicket] = useState<{
    id: string
    time: string
  } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      const ticketId = `TICK-NP-${Math.floor(10000 + Math.random() * 90000)}`
      setSubmittedTicket({
        id: ticketId,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })
      notify(`Support inquiry submitted: Ticket ${ticketId}`)
    }, 800)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
    }
  }

  return (
    <div className="ubuy-contact-page container">
      {/* Page Header */}
      <div className="contact-page-header">
        <Heading as="h1">Contact Support Desk</Heading>
        <p className="contact-header-desc">
          Have an inquiry about delivery in Nepal, order status, warranty, or invoicing? Our Kathmandu team is here to help.
        </p>
      </div>

      <div className="contact-layout-grid">
        {/* Left Column: Interactive Form */}
        <div className="contact-form-panel">
          {submittedTicket ? (
            <div className="ticket-success-card">
              <CheckCircle2 size={48} className="text-emerald-500 mb-3" />
              <Heading as="h2">Inquiry Successfully Registered</Heading>
              <div className="ticket-number-pill">
                Ticket Reference: <strong>{submittedTicket.id}</strong>
              </div>
              <p className="ticket-success-text">
                Your request has been logged with our Kathmandu concierge
                operations desk. A copy has been dispatched to{" "}
                <strong>{email}</strong>. Our logistics liaison will follow up
                within 2 business hours.
              </p>

              {/* Demo Mode Notice */}
              <div className="ticket-demo-notice">
                <ShieldCheck size={16} className="text-amber-600 shrink-0" />
                <span>
                  <strong>Demo Mode Simulation:</strong> This ticket was
                  processed locally to demonstrate user feedback and error
                  handling. No live email was dispatched.
                </span>
              </div>

              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => {
                  setSubmittedTicket(null)
                  setMessage("")
                  setFileName(null)
                }}
              >
                Submit Another Request
              </Button>
            </div>
          ) : (
            <form className="contact-form-card" onSubmit={handleSubmit}>
              <div className="form-head-title">
                <h3>Submit an Inquiry</h3>
                <span className="text-xs text-slate-500">
                  * Required fields
                </span>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="ct-name">Your Full Name *</label>
                  <Input
                    id="ct-name"
                    required
                    placeholder="e.g. Aayush Shrestha"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ct-email">Email Address *</label>
                  <Input
                    id="ct-email"
                    type="email"
                    required
                    placeholder="e.g. yourname@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="ct-topic">Inquiry Topic</label>
                  <select
                    id="ct-topic"
                    className="select"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  >
                    <option value="Shipping & Delivery in Nepal">
                      Shipping & Delivery in Nepal
                    </option>
                    <option value="Order Status">
                      Order Tracking & Status
                    </option>
                    <option value="Returns & Warranty">
                      Returns & Warranty Claims
                    </option>
                    <option value="Payment & Invoicing">
                      Payment Gateway & 13% VAT Invoice
                    </option>
                    <option value="Technical Specifications">
                      Product Fitment & Technical Specs
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="ct-order">Order Reference (Optional)</label>
                  <Input
                    id="ct-order"
                    placeholder="e.g. UB-NP-902148"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="ct-message">Your Message / Request *</label>
                <textarea
                  id="ct-message"
                  required
                  rows={5}
                  className="contact-textarea"
                  placeholder="Please describe your question or issue in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Optional File Attachment */}
              <div className="file-attachment-row">
                <label className="file-upload-btn">
                  <Paperclip size={16} />
                  <span>
                    {fileName
                      ? `Attached: ${fileName}`
                      : "Attach photo or document (Optional)"}
                  </span>
                  <input
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                {fileName && (
                  <button
                    type="button"
                    className="clear-file-btn"
                    onClick={() => setFileName(null)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <Button
                size="lg"
                type="submit"
                variant="primary"
                className="submit-inquiry-btn"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Transmitting Request..."
                  : "Submit Request to Concierge"}{" "}
                <Send size={16} />
              </Button>
            </form>
          )}
        </div>

        {/* Right Column: Contact Channels & Office Info */}
        <aside className="contact-channels-panel">
          <div className="channel-card">
            <h3 className="channel-card-title">Direct Contact Channels</h3>

            <div className="channel-item">
              <div className="channel-icon-wrap text-emerald-600">
                <Phone size={20} />
              </div>
              <div>
                <strong>Kathmandu Phone Hotline</strong>
                <span className="block text-slate-700 font-medium">
                  +977 1-4428900
                </span>
                <small className="text-slate-500">
                  Sunday – Friday: 9:00 AM – 6:00 PM NPT
                </small>
              </div>
            </div>

            <div className="channel-item">
              <div className="channel-icon-wrap text-amber-500">
                <Mail size={20} />
              </div>
              <div>
                <strong>Concierge Email Support</strong>
                <span className="block text-slate-700 font-medium">
                  support@abcevpart.com.np
                </span>
                <small className="text-slate-500">
                  Average response time: &lt; 2 hours
                </small>
              </div>
            </div>

            <div className="channel-item">
              <div className="channel-icon-wrap text-blue-500">
                <MessageCircle size={20} />
              </div>
              <div>
                <strong>Live WhatsApp Assistance</strong>
                <span className="block text-slate-700 font-medium">
                  +977 9801987654
                </span>
                <small className="text-slate-500">
                  Instant courier & delivery support
                </small>
              </div>
            </div>

            <div className="channel-item">
              <div className="channel-icon-wrap text-purple-500">
                <MapPin size={20} />
              </div>
              <div>
                <strong>Fulfillment Hub & Office</strong>
                <span className="block text-slate-700 font-medium">
                  Lazimpat, Kathmandu 44600, Nepal
                </span>
                <small className="text-slate-500">
                  Near Radisson Way, Central Hub
                </small>
              </div>
            </div>
          </div>

          <div className="channel-card customs-assurance-card">
            <ShieldCheck size={24} className="text-emerald-600 mb-2" />
            <h4 className="font-semibold text-slate-900">
              Nepal Nationwide Delivery Guarantee
            </h4>
            <p className="text-xs text-slate-600">
              We ensure safe, verified doorstep delivery across all 7 provinces of Nepal with full courier tracking and zero surprise delivery fees.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
