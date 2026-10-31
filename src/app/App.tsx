import { RouterProvider } from "react-router"
import { CommerceProvider } from "../lib/commerceContext"
import { router } from "./routes"

export default function App() {
  return (
    <CommerceProvider>
      <RouterProvider router={router} />
    </CommerceProvider>
  )
}
