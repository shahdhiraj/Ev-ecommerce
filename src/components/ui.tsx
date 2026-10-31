import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react"
import { Link, type LinkProps } from "react-router"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "icon"
  size?: "sm" | "md" | "lg"
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const sizeClass =
    variant === "icon" ? `button--icon-${size}` : `button--${size}`
  return (
    <button
      className={`button button--${variant} ${sizeClass} ${className}`}
      type={type}
      {...props}
    />
  )
}

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`input ${className}`} {...props} />
}

export function Select({
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`select ${className}`} {...props} />
}

export function Choice({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`choice ${className}`} {...props} />
}

type AppLinkProps = LinkProps & {
  variant?: "plain" | "button" | "subtle"
}

export function AppLink({
  variant = "plain",
  className = "",
  ...props
}: AppLinkProps) {
  return <Link className={`link link--${variant} ${className}`} {...props} />
}

export function Heading({
  as: Element = "h2",
  eyebrow,
  children,
  className = "",
}: {
  as?: "h1" | "h2" | "h3" | "p"
  eyebrow?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`heading-block ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Element>{children}</Element>
    </div>
  )
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode
  tone?: "neutral" | "brand" | "success"
}) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

export function IconButton({
  label,
  children,
  className = "",
  size = "md",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  children: ReactNode
  size?: "sm" | "md" | "lg"
}) {
  return (
    <Button
      aria-label={label}
      className={className}
      size={size}
      type={type}
      variant="icon"
      {...props}
    >
      {children}
    </Button>
  )
}
