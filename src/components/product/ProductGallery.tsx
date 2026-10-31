import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Maximize2,
  X,
  ZoomIn,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Badge, Button, IconButton } from "../ui"

export function ProductGallery({
  images,
  productName,
}: {
  images: string[]
  productName: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const pointerStart = useRef<number | null>(null)

  const goTo = (index: number) =>
    setActiveIndex((index + images.length) % images.length)

  useEffect(() => {
    if (!lightboxOpen) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false)
      if (event.key === "ArrowLeft") goTo(activeIndex - 1)
      if (event.key === "ArrowRight") goTo(activeIndex + 1)
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [activeIndex, lightboxOpen])

  useEffect(() => {
    if (!lightboxOpen)
      document.querySelector<HTMLButtonElement>(".pdp-image-trigger")?.focus()
  }, [lightboxOpen])

  const closeLightbox = () => setLightboxOpen(false)

  return (
    <>
      <div className="pdp-gallery">
        <div className="pdp-thumbnails" aria-label="Product images">
          {images.map((image, index) => (
            <Button
              aria-label={`View product image ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={activeIndex === index ? "is-active" : ""}
              key={`${image}-${index}`}
              onClick={() => goTo(index)}
              type="button"
              variant="ghost"
            >
              <img
                alt=""
                loading={index === 0 ? "eager" : "lazy"}
                src={image}
              />
            </Button>
          ))}
        </div>
        <div
          className="pdp-main-image"
          onPointerDown={(event) => {
            pointerStart.current = event.clientX
          }}
          onPointerUp={(event) => {
            if (pointerStart.current === null) return
            const distance = event.clientX - pointerStart.current
            if (Math.abs(distance) > 45)
              goTo(activeIndex + (distance < 0 ? 1 : -1))
            pointerStart.current = null
          }}
        >
          <Button
            aria-label={`Open fullscreen image ${activeIndex + 1}`}
            className="pdp-image-trigger"
            onClick={() => setLightboxOpen(true)}
            type="button"
            variant="ghost"
          >
            <img
              alt={`${productName} - View ${activeIndex + 1}`}
              key={images[activeIndex]}
              src={images[activeIndex]}
            />
          </Button>
          <div className="pdp-image-actions">
            <span>
              {activeIndex + 1} / {images.length}
            </span>
            <IconButton
              label="Zoom product image"
              onClick={() => setLightboxOpen(true)}
            >
              <ZoomIn size={18} />
            </IconButton>
            <IconButton
              label="View product image fullscreen"
              onClick={() => setLightboxOpen(true)}
            >
              <Maximize2 size={18} />
            </IconButton>
          </div>
          <IconButton
            className="gallery-arrow gallery-arrow--prev"
            label="Previous product image"
            onClick={() => goTo(activeIndex - 1)}
          >
            <ChevronLeft size={22} />
          </IconButton>
          <IconButton
            className="gallery-arrow gallery-arrow--next"
            label="Next product image"
            onClick={() => goTo(activeIndex + 1)}
          >
            <ChevronRight size={22} />
          </IconButton>
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="product-lightbox"
          onMouseDown={closeLightbox}
          role="presentation"
        >
          <div
            aria-label="Product image fullscreen viewer"
            aria-modal="true"
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
          >
            <IconButton label="Close fullscreen viewer" onClick={closeLightbox}>
              <X size={20} />
            </IconButton>
            <img
              alt={`${productName} - Fullscreen View`}
              src={images[activeIndex]}
            />
            <div>
              <IconButton
                label="Previous fullscreen image"
                onClick={() => goTo(activeIndex - 1)}
              >
                <ChevronLeft size={22} />
              </IconButton>
              <span>
                {activeIndex + 1} of {images.length}
              </span>
              <IconButton
                label="Next fullscreen image"
                onClick={() => goTo(activeIndex + 1)}
              >
                <ChevronRight size={22} />
              </IconButton>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
