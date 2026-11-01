import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Edit2,
  HelpCircle,
  Landmark,
  Lock,
  MapPin,
  Package,
  QrCode,
  ShieldCheck,
  Smartphone,
  Truck,
  Wallet,
  Zap,
} from "lucide-react"
import { useNavigate } from "react-router"
import {
  AppLink,
  Badge,
  Button,
  Heading,
  Input,
  Select,
} from "../components/ui"
import { EsewaLogo, FonepayLogo } from "../components/PaymentLogos"
import { useCommerce } from "../lib/commerceContext"
import {
  NEPAL_PROVINCES,
  SHIPPING_METHODS,
  type NepalAddress,
  type NepalProvince,
  type PaymentMethodId,
  type ShippingMethod,
} from "../lib/commerceStore"
import { formatNpr } from "../lib/search"

export function CheckoutPage() {
  const navigate = useNavigate()
  const {
    cartItems,
    cartCount,
    totals,
    user,
    selectedShipping,
    setSelectedShipping,
    createOrder,
    appliedPromo,
    addAddress,
  } = useCommerce()

  // 4 Steps: 1 = Contact, 2 = Address, 3 = Shipping & Payment, 4 = Review
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)

  // Step 1: Contact State
  const [email, setEmail] = useState(
    user.email || "aayush.shrestha@abcevpart.com.np",
  )
  const [phone, setPhone] = useState(user.phone || "+977 9841234567")
  const [emailError, setEmailError] = useState("")
  const [phoneError, setPhoneError] = useState("")

  // Step 2: Address State
  const defaultSavedAddr =
    user.addresses.find((a) => a.isDefault) || user.addresses[0]
  const [selectedSavedAddrId, setSelectedSavedAddrId] = useState<string>(
    defaultSavedAddr?.id || "new",
  )
  const [fullName, setFullName] = useState(
    defaultSavedAddr?.fullName || user.fullName || "",
  )
  const [province, setProvince] = useState<NepalProvince>(
    defaultSavedAddr?.province || "Bagmati Province",
  )
  const [district, setDistrict] = useState(
    defaultSavedAddr?.district || "Kathmandu",
  )
  const [city, setCity] = useState(defaultSavedAddr?.city || "Kathmandu Metro")
  const [ward, setWard] = useState(defaultSavedAddr?.ward || "Ward 2")
  const [street, setStreet] = useState(
    defaultSavedAddr?.street || "Lazimpat, Near Radisson Way, House #42",
  )
  const [postalCode, setPostalCode] = useState(
    defaultSavedAddr?.postalCode || "44600",
  )
  const [deliveryInstructions, setDeliveryInstructions] = useState(
    defaultSavedAddr?.deliveryInstructions ||
      "Ring bell at main gate. Gate code 4290.",
  )
  const [saveToAccount, setSaveToAccount] = useState(true)

  // Step 3: Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("fonepay")
  const [isProcessing, setIsProcessing] = useState(false)
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false)

  // Handle saved address selection
  const handleSelectSavedAddress = (addrId: string) => {
    setSelectedSavedAddrId(addrId)
    const addr = user.addresses.find((a) => a.id === addrId)
    if (addr) {
      setFullName(addr.fullName)
      setProvince(addr.province)
      setDistrict(addr.district)
      setCity(addr.city)
      setWard(addr.ward)
      setStreet(addr.street)
      setPostalCode(addr.postalCode)
      setDeliveryInstructions(addr.deliveryInstructions || "")
    }
  }

  // Validations
  const validateStep1 = () => {
    let valid = true
    if (!email || !email.includes("@")) {
      setEmailError(
        "Please enter a valid email address for order notifications.",
      )
      valid = false
    } else {
      setEmailError("")
    }
    if (!phone || phone.trim().length < 10) {
      setPhoneError(
        "Please enter a valid Nepal phone number (e.g. +977 98XXXXXXXX).",
      )
      valid = false
    } else {
      setPhoneError("")
    }
    return valid
  }

  const validateStep2 = () => {
    if (!fullName.trim() || !street.trim() || !city.trim()) {
      alert("Please fill out all required address fields.")
      return false
    }
    return true
  }

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep1()) setCurrentStep(2)
  }

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep2()) {
      if (saveToAccount && selectedSavedAddrId === "new") {
        addAddress({
          fullName,
          phone,
          email,
          country: "Nepal",
          province,
          district,
          city,
          ward,
          street,
          postalCode,
          deliveryInstructions,
          isDefault: user.addresses.length === 0,
        })
      }
      setCurrentStep(3)
    }
  }

  const handleNextStep3 = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep(4)
  }

  // Complete Order
  const handleCompleteOrder = () => {
    setIsProcessing(true)

    const finalAddress: NepalAddress = {
      id:
        selectedSavedAddrId === "new"
          ? `addr_${Date.now()}`
          : selectedSavedAddrId,
      fullName,
      phone,
      email,
      country: "Nepal",
      province,
      district,
      city,
      ward,
      street,
      postalCode,
      deliveryInstructions,
    }

    setTimeout(() => {
      const order = createOrder({
        address: finalAddress,
        shippingMethod: selectedShipping,
        paymentMethod,
      })
      setIsProcessing(false)
      navigate(`/checkout/confirmation/${order.id}`)
    }, 1200)
  }

  // If cart is empty and user just navigated directly to /checkout
  if (cartItems.length === 0) {
    return (
      <div className="container ubuy-checkout-empty">
        <Package size={52} className="text-slate-400 mb-4" />
        <Heading as="h1">Your Checkout Cart is Empty</Heading>
        <p>
          Please select items from our catalogue before proceeding to
          checkout.
        </p>
        <Button onClick={() => navigate("/search")} size="lg" variant="primary">
          Explore Products
        </Button>
      </div>
    )
  }

  const selectedProvinceData =
    NEPAL_PROVINCES.find((p) => p.province === province) || NEPAL_PROVINCES[0]

  return (
    <div className="ubuy-checkout-page">
      {/* Focused Checkout Header */}
      <header className="checkout-minimal-header">
        <div className="container checkout-minimal-header__inner">
          <AppLink className="checkout-brand" to="/">
            <span className="clean-brand__mark">
              <Zap size={18} className="fill-current text-white" />
            </span>
            <span className="checkout-brand__title">
              ABC EV <strong>PART</strong>
              <small className="checkout-subbrand"> · Checkout</small>
            </span>
          </AppLink>

          <div className="checkout-security-badge">
            <Lock size={15} className="text-emerald-500" />
            <span>Secure SSL Checkout</span>
          </div>

          <AppLink to="/cart" className="return-cart-link">
            <ArrowLeft size={16} /> Return to Cart
          </AppLink>
        </div>
      </header>

      {/* Main Checkout Body */}
      <main className="container checkout-main-layout">
        {/* Mobile Expandable Order Summary Bar */}
        <div className="checkout-mobile-summary-toggle lg:hidden">
          <button
            className="mobile-summary-trigger"
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            type="button"
          >
            <div className="flex items-center gap-2">
              <Package size={17} className="text-amber-500" />
              <span>
                {mobileSummaryOpen ? "Hide" : "Show"} Order Summary ({cartCount}{" "}
                items)
              </span>
              {mobileSummaryOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
            <strong className="mobile-summary-total">
              {formatNpr(totals.payNowTotal)}
            </strong>
          </button>

          {mobileSummaryOpen && (
            <div className="mobile-summary-dropdown">
              <div className="mobile-item-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="mobile-item-row">
                    <img src={item.image} alt="" className="mobile-item-img" />
                    <div className="mobile-item-meta">
                      <strong>{item.name}</strong>
                      <span>
                        Qty {item.quantity} ·{" "}
                        {formatNpr(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mobile-summary-totals">
                <div>
                  <span>Subtotal:</span>
                  <strong>{formatNpr(totals.subtotal)}</strong>
                </div>
                <div>
                  <span>Delivery:</span>
                  <strong>
                    {totals.shippingFee === 0
                      ? "Free"
                      : formatNpr(totals.shippingFee)}
                  </strong>
                </div>
                <div>
                  <span>Nepal 13% VAT:</span>
                  <strong>{formatNpr(totals.vat)}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stepper Progress Indicator */}
        <nav aria-label="Checkout Progress" className="checkout-stepper-bar">
          <div
            className={`step-node ${currentStep >= 1 ? "is-active" : ""} ${
              currentStep > 1 ? "is-completed" : ""
            }`}
          >
            <span className="step-number">
              {currentStep > 1 ? <Check size={14} /> : "1"}
            </span>
            <span className="step-text">Contact</span>
          </div>
          <div className="step-connector" />

          <div
            className={`step-node ${currentStep >= 2 ? "is-active" : ""} ${
              currentStep > 2 ? "is-completed" : ""
            }`}
          >
            <span className="step-number">
              {currentStep > 2 ? <Check size={14} /> : "2"}
            </span>
            <span className="step-text">Address</span>
          </div>
          <div className="step-connector" />

          <div
            className={`step-node ${currentStep >= 3 ? "is-active" : ""} ${
              currentStep > 3 ? "is-completed" : ""
            }`}
          >
            <span className="step-number">
              {currentStep > 3 ? <Check size={14} /> : "3"}
            </span>
            <span className="step-text">Payment</span>
          </div>
          <div className="step-connector" />

          <div className={`step-node ${currentStep === 4 ? "is-active" : ""}`}>
            <span className="step-number">4</span>
            <span className="step-text">Review</span>
          </div>
        </nav>

        {/* Two-Column Form and Sticky Summary */}
        <div className="checkout-content-grid">
          {/* Left Column: Form Steps */}
          <div className="checkout-steps-panel">
            {/* STEP 1: CONTACT INFORMATION */}
            <section
              className={`checkout-step-card ${
                currentStep === 1 ? "is-current" : "is-collapsed"
              }`}
            >
              <div className="step-header">
                <div className="flex items-center gap-3">
                  <span className="step-circle-badge">1</span>
                  <Heading as="h2">Contact Information</Heading>
                </div>
                {currentStep > 1 && (
                  <button
                    className="step-edit-btn"
                    onClick={() => setCurrentStep(1)}
                    type="button"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                )}
              </div>

              {currentStep === 1 ? (
                <form className="step-form-body" onSubmit={handleNextStep1}>
                  <div className="form-group">
                    <label htmlFor="contact-email">Email Address *</label>
                    <Input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="e.g. yourname@domain.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setEmailError("")
                      }}
                    />
                    {emailError && (
                      <span className="field-error">{emailError}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-phone">Phone Number *</label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      required
                      placeholder="+977 98XXXXXXXX"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value)
                        setPhoneError("")
                      }}
                    />
                    {phoneError && (
                      <span className="field-error">{phoneError}</span>
                    )}
                  </div>

                  <div className="step-actions-footer">
                    <Button size="lg" type="submit" variant="primary">
                      Continue to Address <ArrowRight size={16} />
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="step-summary-view">
                  <span className="summary-pill">{email}</span>
                  <span className="summary-pill">{phone}</span>
                </div>
              )}
            </section>

            {/* STEP 2: DELIVERY ADDRESS (NEPAL FOCUS) */}
            <section
              className={`checkout-step-card ${
                currentStep === 2 ? "is-current" : "is-collapsed"
              }`}
            >
              <div className="step-header">
                <div className="flex items-center gap-3">
                  <span className="step-circle-badge">2</span>
                  <Heading as="h2">Delivery Address</Heading>
                </div>
                {currentStep > 2 && (
                  <button
                    className="step-edit-btn"
                    onClick={() => setCurrentStep(2)}
                    type="button"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                )}
              </div>

              {currentStep === 2 ? (
                <form className="step-form-body" onSubmit={handleNextStep2}>
                  {/* Saved Addresses quick-picker for signed-in users */}
                  {user.addresses.length > 0 && (
                    <div className="saved-addresses-selector mb-4">
                      <label className="section-sublabel">
                        Select from your saved Nepal addresses:
                      </label>
                      <div className="saved-addr-cards-grid">
                        {user.addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className={`saved-addr-card ${
                              selectedSavedAddrId === addr.id
                                ? "is-selected"
                                : ""
                            }`}
                            onClick={() => handleSelectSavedAddress(addr.id)}
                            role="button"
                            tabIndex={0}
                          >
                            <div className="saved-addr-card__head">
                              <strong>{addr.fullName}</strong>
                              {addr.isDefault && (
                                <Badge tone="brand">Default</Badge>
                              )}
                            </div>
                            <p className="saved-addr-card__text">
                              {addr.street}, {addr.ward}, {addr.city},{" "}
                              {addr.province}
                            </p>
                            <span className="saved-addr-card__phone">
                              {addr.phone}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="addr-name">Recipient Full Name *</label>
                      <Input
                        id="addr-name"
                        required
                        placeholder="e.g. Aayush Shrestha"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="addr-country">Country</label>
                      <Input
                        id="addr-country"
                        disabled
                        value="Nepal 🇳🇵"
                        className="bg-slate-50 font-medium"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="addr-province">Province *</label>
                      <select
                        id="addr-province"
                        className="select"
                        value={province}
                        onChange={(e) => {
                          const prov = e.target.value as NepalProvince
                          setProvince(prov)
                          const firstDist =
                            NEPAL_PROVINCES.find((p) => p.province === prov)
                              ?.majorDistricts[0] || "Kathmandu"
                          setDistrict(firstDist)
                        }}
                      >
                        {NEPAL_PROVINCES.map((p) => (
                          <option key={p.province} value={p.province}>
                            {p.province}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="addr-district">District / Region *</label>
                      <select
                        id="addr-district"
                        className="select"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                      >
                        {selectedProvinceData.majorDistricts.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label htmlFor="addr-city">City / Municipality *</label>
                      <Input
                        id="addr-city"
                        required
                        placeholder="e.g. Kathmandu Metro / Pokhara"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="addr-ward">Ward No. *</label>
                      <Input
                        id="addr-ward"
                        required
                        placeholder="e.g. Ward 2"
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="addr-postal">
                        Postal Code (Optional)
                      </label>
                      <Input
                        id="addr-postal"
                        placeholder="e.g. 44600"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="addr-street">
                      Street Address / Locality / Landmark *
                    </label>
                    <Input
                      id="addr-street"
                      required
                      placeholder="e.g. Lazimpat, Near Radisson Hotel, House #42"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="addr-instructions">
                      Delivery Instructions for Local Courier
                    </label>
                    <Input
                      id="addr-instructions"
                      placeholder="e.g. Ring gate bell, leave with security, call before arrival"
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                    />
                  </div>

                  <div className="step-actions-footer">
                    <Button
                      size="md"
                      type="button"
                      variant="secondary"
                      onClick={() => setCurrentStep(1)}
                    >
                      Back
                    </Button>
                    <Button size="lg" type="submit" variant="primary">
                      Continue to Payment <ArrowRight size={16} />
                    </Button>
                  </div>
                </form>
              ) : currentStep > 2 ? (
                <div className="step-summary-view">
                  <MapPin size={16} className="text-amber-500 shrink-0" />
                  <span>
                    <strong>{fullName}</strong> · {street}, {ward}, {city},{" "}
                    {district}, {province} (Nepal)
                  </span>
                </div>
              ) : null}
            </section>

            {/* STEP 3: SHIPPING & PAYMENT */}
            <section
              className={`checkout-step-card ${
                currentStep === 3 ? "is-current" : "is-collapsed"
              }`}
            >
              <div className="step-header">
                <div className="flex items-center gap-3">
                  <span className="step-circle-badge">3</span>
                  <Heading as="h2">Shipping & Payment</Heading>
                </div>
                {currentStep > 3 && (
                  <button
                    className="step-edit-btn"
                    onClick={() => setCurrentStep(3)}
                    type="button"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                )}
              </div>

              {currentStep === 3 ? (
                <form className="step-form-body" onSubmit={handleNextStep3}>
                  {/* Shipping Options */}
                  <div className="shipping-methods-block mb-6">
                    <h3 className="subheading-title flex items-center gap-2">
                      <Truck size={17} className="text-amber-500" />
                      Shipping Method
                    </h3>

                    <div className="shipping-radio-list">
                      {SHIPPING_METHODS.map((method) => (
                        <label
                          key={method.id}
                          className={`shipping-option-card ${
                            selectedShipping.id === method.id
                              ? "is-selected"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={selectedShipping.id === method.id}
                            onChange={() => setSelectedShipping(method)}
                            className="sr-only"
                          />
                          <div className="shipping-option-radio-indicator" />
                          <div className="shipping-option-content">
                            <div className="shipping-option-title-row">
                              <strong>{method.name}</strong>
                              <span className="shipping-option-rate">
                                {formatNpr(method.rateNpr)}
                              </span>
                            </div>
                            <span className="shipping-option-time">
                              {method.transitTime}
                            </span>
                            <p className="shipping-option-desc">
                              {method.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="payment-methods-block">
                    <div className="payment-head-row">
                      <h3 className="subheading-title flex items-center gap-2">
                        <Wallet size={17} className="text-amber-500" />
                        Payment Method
                      </h3>
                      <span className="demo-mode-pill">
                        Demo Mode
                      </span>
                    </div>

                    <div className="demo-payment-alert">
                      <ShieldCheck
                        size={18}
                        className="text-amber-600 shrink-0"
                      />
                      <span>
                        Simulated payment environment. No live charges will be made.
                      </span>
                    </div>

                    <div className="payment-options-grid">
                      {/* Fonepay / QR */}
                      <label
                        className={`payment-option-card ${
                          paymentMethod === "fonepay" ? "is-selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "fonepay"}
                          onChange={() => setPaymentMethod("fonepay")}
                          className="sr-only"
                        />
                        <div className="payment-option-main">
                          <div className="payment-icon-box payment-icon-box--fonepay">
                            <FonepayLogo className="w-12 h-8" />
                          </div>
                          <div className="payment-method-info">
                            <strong className="payment-method-title">
                              Fonepay / Nepal QR
                            </strong>
                            <small className="payment-method-desc">
                              Instant scan from any Nepal banking app
                            </small>
                          </div>
                        </div>
                        <span className="payment-badge">Most Popular</span>
                      </label>

                      {/* eSewa / Wallet */}
                      <label
                        className={`payment-option-card ${
                          paymentMethod === "esewa" ? "is-selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "esewa"}
                          onChange={() => setPaymentMethod("esewa")}
                          className="sr-only"
                        />
                        <div className="payment-option-main">
                          <div className="payment-icon-box payment-icon-box--esewa">
                            <EsewaLogo className="w-12 h-8" />
                          </div>
                          <div className="payment-method-info">
                            <strong className="payment-method-title">
                              eSewa Direct Wallet
                            </strong>
                            <small className="payment-method-desc">
                              Nepal digital wallet direct settlement
                            </small>
                          </div>
                        </div>
                        <span className="payment-badge">Instant</span>
                      </label>

                      {/* International Cards */}
                      <label
                        className={`payment-option-card ${
                          paymentMethod === "card" ? "is-selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          className="sr-only"
                        />
                        <div className="payment-option-main">
                          <div className="payment-icon-box payment-icon-box--card">
                            <CreditCard size={22} />
                          </div>
                          <div className="payment-method-info">
                            <strong className="payment-method-title">
                              Credit / Debit Card
                            </strong>
                            <small className="payment-method-desc">
                              Visa, Mastercard with 3D Secure
                            </small>
                          </div>
                        </div>
                        <span className="payment-badge">Debit / Credit</span>
                      </label>

                      {/* Wire Transfer */}
                      <label
                        className={`payment-option-card ${
                          paymentMethod === "wire" ? "is-selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "wire"}
                          onChange={() => setPaymentMethod("wire")}
                          className="sr-only"
                        />
                        <div className="payment-option-main">
                          <div className="payment-icon-box payment-icon-box--wire">
                            <Landmark size={22} />
                          </div>
                          <div className="payment-method-info">
                            <strong className="payment-method-title">
                              Bank Wire / Swift
                            </strong>
                            <small className="payment-method-desc">
                              Nepal Investment Mega Bank / Nabil Bank
                            </small>
                          </div>
                        </div>
                        <span className="payment-badge">B2B Pro</span>
                      </label>
                    </div>
                  </div>

                  <div className="step-actions-footer">
                    <Button
                      size="md"
                      type="button"
                      variant="secondary"
                      onClick={() => setCurrentStep(2)}
                    >
                      Back
                    </Button>
                    <Button size="lg" type="submit" variant="primary">
                      Review Order & Confirm <ArrowRight size={16} />
                    </Button>
                  </div>
                </form>
              ) : currentStep > 3 ? (
                <div className="step-summary-view">
                  <span className="summary-pill">{selectedShipping.name}</span>
                  <span className="summary-pill">
                    Payment: {paymentMethod.toUpperCase()} (Demo Mode)
                  </span>
                </div>
              ) : null}
            </section>

            {/* STEP 4: REVIEW & CONFIRM */}
            {currentStep === 4 && (
              <section className="checkout-step-card is-current">
                <div className="step-header">
                  <div className="flex items-center gap-3">
                    <span className="step-circle-badge">4</span>
                    <Heading as="h2">Review Your Order & Confirm</Heading>
                  </div>
                </div>

                <div className="step-form-body">
                  <p className="review-intro">
                    Please review your delivery address, shipping method, and
                    payment details before placing your order.
                  </p>

                  {/* Summary Blocks Grid */}
                  <div className="review-blocks-grid">
                    <div className="review-block">
                      <div className="review-block-head">
                        <strong>Delivery Destination</strong>
                        <button onClick={() => setCurrentStep(2)} type="button">
                          Edit
                        </button>
                      </div>
                      <p>{fullName}</p>
                      <p>
                        {street}, {ward}
                      </p>
                      <p>
                        {city}, {district}, {province}
                      </p>
                      <p>{phone}</p>
                    </div>

                    <div className="review-block">
                      <div className="review-block-head">
                        <strong>Shipping Carrier</strong>
                        <button onClick={() => setCurrentStep(3)} type="button">
                          Edit
                        </button>
                      </div>
                      <p>
                        <strong>{selectedShipping.name}</strong>
                      </p>
                      <p>{selectedShipping.transitTime}</p>
                      <p>{formatNpr(selectedShipping.rateNpr)}</p>
                    </div>

                    <div className="review-block">
                      <div className="review-block-head">
                        <strong>Payment Method</strong>
                        <button onClick={() => setCurrentStep(3)} type="button">
                          Edit
                        </button>
                      </div>
                      <p>
                        <strong>
                          {paymentMethod === "fonepay"
                            ? "Fonepay / Nepal QR"
                            : paymentMethod === "esewa"
                            ? "eSewa Direct Wallet"
                            : paymentMethod === "card"
                            ? "Credit / Debit Card"
                            : "Bank Wire / Swift"}
                        </strong>
                      </p>
                      <p className="text-amber-700">
                        Demo Verification Simulated
                      </p>
                    </div>
                  </div>

                  {/* Items list preview */}
                  <div className="review-items-list">
                    <h4 className="review-items-heading">
                      Purchased Items ({cartCount})
                    </h4>
                    {cartItems.map((item) => (
                      <div key={item.id} className="review-item-row">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="review-item-thumb"
                        />
                        <div className="review-item-meta">
                          <strong>{item.name}</strong>
                          <span>
                            Brand: {item.brand}{" "}
                            {item.variant ? ` · ${item.variant}` : ""}
                          </span>
                        </div>
                        <div className="review-item-qty">
                          Qty {item.quantity}
                        </div>
                        <div className="review-item-total">
                          {formatNpr(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Explicit Demo Notice */}
                  <div className="demo-order-warning-banner">
                    <ShieldCheck
                      size={20}
                      className="text-amber-600 shrink-0"
                    />
                    <div>
                      <strong>Demo Environment Confirmation:</strong>
                      <p>
                        Clicking "Complete Demo Checkout" will simulate
                        authorized payment confirmation and create a persisted
                        customer order record in your local session. No real
                        banking transaction occurs.
                      </p>
                    </div>
                  </div>

                  <div className="step-actions-footer">
                    <Button
                      size="md"
                      type="button"
                      variant="secondary"
                      onClick={() => setCurrentStep(3)}
                      disabled={isProcessing}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      type="button"
                      variant="primary"
                      className="complete-order-btn"
                      onClick={handleCompleteOrder}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <span className="spinner-loader" /> Authorizing Demo
                          Transaction...
                        </>
                      ) : (
                        <>
                          Complete Demo Checkout (
                          {formatNpr(totals.payNowTotal)}){" "}
                          <CheckCircle2 size={18} />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Sticky Order Summary */}
          <aside className="checkout-summary-column">
            <div className="checkout-summary-card">
              <div className="card-head-row">
                <Heading as="h3">Order Summary</Heading>
                <span className="order-id-badge">
                  {cartItems.reduce((s, i) => s + i.quantity, 0)}{" "}
                  {cartItems.reduce((s, i) => s + i.quantity, 0) === 1
                    ? "item"
                    : "items"}
                </span>
              </div>

              <div className="checkout-items-preview-stack">
                {cartItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="summary-item-micro">
                    <img src={item.image} alt={item.name} />
                    <div className="micro-info">
                      <span className="micro-title">{item.name}</span>
                      <span className="micro-meta">
                        Qty {item.quantity} × {formatNpr(item.price)}
                      </span>
                    </div>
                  </div>
                ))}
                {cartItems.length > 3 && (
                  <span className="micro-more">
                    +{cartItems.length - 3} more items in build
                  </span>
                )}
              </div>

              <div className="summary-divider" />

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Product Subtotal</span>
                  <strong>{formatNpr(totals.subtotal)}</strong>
                </div>
                <div className="summary-row">
                  <span>Nepal Delivery Fee</span>
                  <strong>
                    {totals.shippingFee === 0
                      ? "Free Delivery"
                      : formatNpr(totals.shippingFee)}
                  </strong>
                </div>
                <div className="summary-row">
                  <span>Nepal VAT (13%)</span>
                  <strong>{formatNpr(totals.vat)}</strong>
                </div>
                {totals.discount > 0 && (
                  <div className="summary-row summary-row--discount">
                    <span>Discount</span>
                    <strong>− {formatNpr(totals.discount)}</strong>
                  </div>
                )}
                <div className="summary-divider" />
                <div className="summary-row summary-row--total">
                  <div>
                    <span>Total Payable</span>
                    <div className="text-xs text-slate-500 font-normal">
                      NPR All-Inclusive
                    </div>
                  </div>
                  <div className="text-right">
                    <strong className="text-2xl text-amber-600">
                      {formatNpr(totals.payNowTotal)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="checkout-guarantee-box">
                <ShieldCheck size={17} className="text-emerald-600 shrink-0" />
                <span>
                  <strong>All-Inclusive Pricing:</strong> 13% VAT & delivery fees included upfront. Zero hidden charges upon delivery in Nepal.
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
