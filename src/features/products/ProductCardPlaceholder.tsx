// Loading placeholder with the real card's markup and classes, so it takes the same size at every
// breakpoint: the grid has its final height before the products arrive, and nothing below it
// (the cart panel on mobile) shifts. Hidden from screen readers; the list announces the loading.
function ProductCardPlaceholder() {
  return (
    <article className="product-card is-placeholder" aria-hidden="true">
      <div className="product-image-wrap" />
      <div className="product-details">
        <div className="product-title-row">
          <h3>&nbsp;</h3>
          <span className="product-price">&nbsp;</span>
        </div>
        <p>&nbsp;<br />&nbsp;</p>
        <div className="product-actions">
          <span className="stock-status">&nbsp;</span>
          <span className="add-button">&nbsp;</span>
        </div>
      </div>
    </article>
  )
}

export default ProductCardPlaceholder
