import { useSearchParams } from 'react-router-dom'
import CartPanel from '@/components/CartPanel'
import ProductList from '@/features/products/ProductList'

function ProductsPage() {
  // The search lives in the URL (/products?search=lampe), not in a useState: a reload, a shared
  // link or the back button keep it.
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''

  function handleSearchChange(value: string) {
    // replace: one history entry for the whole typing, not one per key. An empty field removes
    // the parameter, so the plain /products URL stays clean.
    setSearchParams(value === '' ? {} : { search: value }, { replace: true })
  }

  return (
    <main className="products-page">
      <section className="intro-band products-intro">
        <div className="intro-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> La sélection du studio</p>
          <h1>Nos <em>essentiels.</em></h1>
          <p className="intro-description">Des objets utiles, choisis pour durer et accompagner le quotidien.</p>
        </div>
      </section>
      <div className="shop-layout">
        <section className="catalog-section" aria-labelledby="products-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">La boutique</p>
              <h2 id="products-title">Tous les produits</h2>
            </div>
            <label className="form-field catalog-search">
              Rechercher un produit
              <input
                type="search"
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
              />
            </label>
          </div>
          <ProductList search={search} />
        </section>
        <CartPanel />
      </div>
    </main>
  )
}

export default ProductsPage
