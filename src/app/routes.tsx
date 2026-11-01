import { createBrowserRouter } from "react-router"
import { StorefrontShell } from "../components/StorefrontShell"
import { HomePage } from "../pages/HomePage"
import { PlaceholderPage } from "../pages/PlaceholderPage"
import { GlobalErrorBoundary } from "../components/GlobalErrorBoundary"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: StorefrontShell,
    ErrorBoundary: GlobalErrorBoundary,
    children: [
      { index: true, Component: HomePage },
      {
        path: "categories",
        lazy: () =>
          import("../pages/AllCategoriesPage").then((m) => ({
            Component: m.AllCategoriesPage,
          })),
      },
      {
        path: "category/:slug",
        lazy: () =>
          import("../pages/SearchResultsPage").then((m) => ({
            Component: m.SearchResultsPage,
          })),
      },
      {
        path: "search",
        lazy: () =>
          import("../pages/SearchResultsPage").then((m) => ({
            Component: m.SearchResultsPage,
          })),
      },
      {
        path: "brand/:brand",
        lazy: () =>
          import("../pages/SearchResultsPage").then((m) => ({
            Component: m.SearchResultsPage,
          })),
      },
      {
        path: "deals",
        lazy: () =>
          import("../pages/SearchResultsPage").then((m) => ({
            Component: m.SearchResultsPage,
          })),
      },
      {
        path: "product/:productId",
        lazy: () =>
          import("../pages/ProductDetailPage").then((m) => ({
            Component: m.ProductDetailPage,
          })),
      },
      {
        path: "wishlist",
        lazy: () =>
          import("../pages/WishlistPage").then((m) => ({
            Component: m.WishlistPage,
          })),
      },
      // Page 09 — Shopping Cart
      {
        path: "cart",
        lazy: () =>
          import("../pages/CartPage").then((m) => ({
            Component: m.CartPage,
          })),
      },
      // Page 10 — Multi-Step Checkout & Confirmation
      {
        path: "checkout",
        lazy: () =>
          import("../pages/CheckoutPage").then((m) => ({
            Component: m.CheckoutPage,
          })),
      },
      {
        path: "checkout/confirmation/:orderId",
        lazy: () =>
          import("../pages/OrderConfirmationPage").then((m) => ({
            Component: m.OrderConfirmationPage,
          })),
      },
      // Page 11 — Authentication (Login & Signup)
      {
        path: "login",
        lazy: () =>
          import("../pages/AuthPage").then((m) => ({
            Component: m.AuthPage,
          })),
      },
      {
        path: "signin",
        lazy: () =>
          import("../pages/AuthPage").then((m) => ({
            Component: m.AuthPage,
          })),
      },
      {
        path: "register",
        lazy: () =>
          import("../pages/AuthPage").then((m) => ({
            Component: m.AuthPage,
          })),
      },
      {
        path: "signup",
        lazy: () =>
          import("../pages/AuthPage").then((m) => ({
            Component: m.AuthPage,
          })),
      },
      {
        path: "forgot-password",
        lazy: () =>
          import("../pages/AuthPage").then((m) => ({
            Component: m.AuthPage,
          })),
      },
      {
        path: "reset-password",
        lazy: () =>
          import("../pages/AuthPage").then((m) => ({
            Component: m.AuthPage,
          })),
      },
      // Page 12 — My Account Dashboard
      {
        path: "account",
        lazy: () =>
          import("../pages/AccountPage").then((m) => ({
            Component: m.AccountPage,
          })),
      },
      // Owner / Vendor Dashboard
      {
        path: "owner",
        lazy: () =>
          import("../pages/OwnerDashboardPage").then((m) => ({
            Component: m.OwnerDashboardPage,
          })),
      },
      {
        path: "owner/products",
        lazy: () =>
          import("../pages/OwnerDashboardPage").then((m) => ({
            Component: m.OwnerDashboardPage,
          })),
      },
      {
        path: "owner/orders",
        lazy: () =>
          import("../pages/OwnerDashboardPage").then((m) => ({
            Component: m.OwnerDashboardPage,
          })),
      },
      {
        path: "owner/settings",
        lazy: () =>
          import("../pages/OwnerDashboardPage").then((m) => ({
            Component: m.OwnerDashboardPage,
          })),
      },
      {
        path: "admin",
        lazy: () =>
          import("../pages/OwnerDashboardPage").then((m) => ({
            Component: m.OwnerDashboardPage,
          })),
      },
      {
        path: "admin/products",
        lazy: () =>
          import("../pages/OwnerDashboardPage").then((m) => ({
            Component: m.OwnerDashboardPage,
          })),
      },
      {
        path: "admin/orders",
        lazy: () =>
          import("../pages/OwnerDashboardPage").then((m) => ({
            Component: m.OwnerDashboardPage,
          })),
      },
      {
        path: "admin/settings",
        lazy: () =>
          import("../pages/OwnerDashboardPage").then((m) => ({
            Component: m.OwnerDashboardPage,
          })),
      },
      {
        path: "account/settings",
        lazy: () =>
          import("../pages/AccountPage").then((m) => ({
            Component: m.AccountPage,
          })),
      },
      {
        path: "account/profile",
        lazy: () =>
          import("../pages/AccountPage").then((m) => ({
            Component: m.AccountPage,
          })),
      },
      {
        path: "account/addresses",
        lazy: () =>
          import("../pages/AccountPage").then((m) => ({
            Component: m.AccountPage,
          })),
      },
      {
        path: "account/preferences",
        lazy: () =>
          import("../pages/AccountPage").then((m) => ({
            Component: m.AccountPage,
          })),
      },
      {
        path: "account/security",
        lazy: () =>
          import("../pages/AccountPage").then((m) => ({
            Component: m.AccountPage,
          })),
      },
      // Page 13 — My Orders & Order Details
      {
        path: "account/orders",
        lazy: () =>
          import("../pages/OrdersPage").then((m) => ({
            Component: m.OrdersPage,
          })),
      },
      {
        path: "account/orders/:orderId",
        lazy: () =>
          import("../pages/OrderDetailPage").then((m) => ({
            Component: m.OrderDetailPage,
          })),
      },
      {
        path: "account/track",
        lazy: () =>
          import("../pages/OrderTrackingPage").then((m) => ({
            Component: m.OrderTrackingPage,
          })),
      },
      {
        path: "account/track/:orderId",
        lazy: () =>
          import("../pages/OrderTrackingPage").then((m) => ({
            Component: m.OrderTrackingPage,
          })),
      },
      {
        path: "account/wishlist",
        lazy: () =>
          import("../pages/WishlistPage").then((m) => ({
            Component: m.WishlistPage,
          })),
      },
      // Page 14 — International Order Tracking
      {
        path: "track-order",
        lazy: () =>
          import("../pages/OrderTrackingPage").then((m) => ({
            Component: m.OrderTrackingPage,
          })),
      },
      {
        path: "track-order/:orderId",
        lazy: () =>
          import("../pages/OrderTrackingPage").then((m) => ({
            Component: m.OrderTrackingPage,
          })),
      },
      // Page 15 — Help Center & Supporting Information
      {
        path: "help",
        lazy: () =>
          import("../pages/HelpCenterPage").then((m) => ({
            Component: m.HelpCenterPage,
          })),
      },
      {
        path: "help/:topic",
        lazy: () =>
          import("../pages/HelpCenterPage").then((m) => ({
            Component: m.HelpCenterPage,
          })),
      },
      {
        path: "contact",
        lazy: () =>
          import("../pages/ContactSupportPage").then((m) => ({
            Component: m.ContactSupportPage,
          })),
      },
      {
        path: "about",
        lazy: () =>
          import("../pages/AboutPage").then((m) => ({
            Component: m.AboutPage,
          })),
      },
      {
        path: "privacy",
        lazy: () =>
          import("../pages/LegalPage").then((m) => ({
            Component: m.LegalPage,
          })),
      },
      {
        path: "terms",
        lazy: () =>
          import("../pages/LegalPage").then((m) => ({
            Component: m.LegalPage,
          })),
      },
      // Fallback
      { path: "*", Component: PlaceholderPage },
    ],
  },
])
