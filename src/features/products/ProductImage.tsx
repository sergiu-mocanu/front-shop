// Responsive product image: the browser picks the smallest Unsplash rendition that stays sharp
// for the displayed size (`sizes`) and the screen's pixel density.
const WIDTHS = [400, 800, 1200] as const

function withWidth(url: string, width: number): string {
  const resized = new URL(url)
  resized.searchParams.set('w', String(width))
  return resized.toString()
}

type ProductImageProps = {
  src: string
  alt: string
  /** CSS `sizes`: the image's displayed width at each breakpoint. */
  sizes: string
  /** Above the fold: load at once. Otherwise the image waits until it nears the viewport. */
  eager?: boolean
  /** The page's main image (likely LCP): fetched before other images. */
  priority?: boolean
}

function ProductImage({ src, alt, sizes, eager = false, priority = false }: ProductImageProps) {
  return (
    <img
      className="product-image"
      src={withWidth(src, WIDTHS[0])}
      srcSet={WIDTHS.map((width) => `${withWidth(src, width)} ${width}w`).join(', ')}
      sizes={sizes}
      alt={alt}
      loading={eager || priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  )
}

export default ProductImage
