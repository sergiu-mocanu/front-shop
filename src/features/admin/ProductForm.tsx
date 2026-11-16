import { useState, type FormEvent } from 'react'
import { useSaveProduct } from '@/features/products/queries'
import type { CreateProductInput, Product } from '@/types/ecommerce'

type ProductFormProps = {
  /** The product to edit; absent to create one. */
  product?: Product
  /** Called after a successful save, or on cancel. */
  onDone: () => void
}

// What the inputs hold: text inputs work with strings, so the price is a string until submit.
type FormValues = Omit<CreateProductInput, 'price' | 'category' | 'description' | 'image_url' | 'badge'> & {
  price: string
  category: string
  description: string
  image_url: string
  badge: string
}

function toValues(product?: Product): FormValues {
  return {
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    price: product ? String(product.price) : '',
    category: product?.category ?? '',
    description: product?.description ?? '',
    image_url: product?.image_url ?? '',
    badge: product?.badge ?? '',
    in_stock: product?.in_stock ?? true,
  }
}

// Back to the row's shape: numbers as numbers, empty optional fields as null (not '').
function toInput(values: FormValues): CreateProductInput {
  const orNull = (text: string) => text.trim() || null
  return {
    name: values.name.trim(),
    slug: values.slug.trim(),
    price: Number(values.price),
    category: orNull(values.category),
    description: orNull(values.description),
    image_url: orNull(values.image_url),
    badge: orNull(values.badge),
    in_stock: values.in_stock,
  }
}

// "Carafe Rosée" -> "carafe-rosee": accents stripped, anything else becomes a dash.
function slugify(text: string): string {
  return text
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // é = e + accent mark: drop the mark
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Creation and edition share one form. The parent gives it a `key` per product, so switching
// products remounts it with fresh state.
function ProductForm({ product, onDone }: ProductFormProps) {
  const [values, setValues] = useState(() => toValues(product))
  // While creating, the slug follows the name until the admin edits the slug by hand.
  const [slugEdited, setSlugEdited] = useState(Boolean(product))
  const save = useSaveProduct()

  const set = <K extends keyof FormValues>(field: K, value: FormValues[K]) =>
    setValues((current) => ({ ...current, [field]: value }))

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    save.mutate({ id: product?.id, input: toInput(values) }, { onSuccess: onDone })
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{product ? `Modifier « ${product.name} »` : 'Nouveau produit'}</h2>
      <div className="product-form-grid">
        <label className="form-field">
          Nom
          <input
            required
            value={values.name}
            onChange={(event) => {
              set('name', event.target.value)
              if (!slugEdited) set('slug', slugify(event.target.value))
            }}
          />
        </label>
        <label className="form-field">
          Slug (adresse de la fiche)
          <input
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            title="Minuscules, chiffres et tirets, ex. carafe-rosee"
            value={values.slug}
            onChange={(event) => { setSlugEdited(true); set('slug', event.target.value) }}
          />
        </label>
        <label className="form-field">
          Prix (€)
          <input
            required
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={values.price}
            onChange={(event) => set('price', event.target.value)}
          />
        </label>
        <label className="form-field">
          Catégorie
          <input value={values.category} onChange={(event) => set('category', event.target.value)} />
        </label>
        <label className="form-field">
          Badge (facultatif)
          <input value={values.badge} onChange={(event) => set('badge', event.target.value)} />
        </label>
        <label className="form-field">
          Image (URL Unsplash)
          <input
            type="url"
            pattern="https://images\.unsplash\.com/.*"
            title="Une adresse https://images.unsplash.com/…"
            value={values.image_url}
            onChange={(event) => set('image_url', event.target.value)}
          />
        </label>
        <label className="form-field product-form-wide">
          Description
          <textarea rows={3} value={values.description} onChange={(event) => set('description', event.target.value)} />
        </label>
        <label className="form-check">
          <input type="checkbox" checked={values.in_stock} onChange={(event) => set('in_stock', event.target.checked)} />
          En stock
        </label>
      </div>
      {save.isError && <p className="error-message product-form-error" role="alert">{save.error.message}</p>}
      <div className="product-form-actions">
        <button className="add-button" type="button" onClick={onDone} disabled={save.isPending}>Annuler</button>
        <button className="add-button is-primary" type="submit" disabled={save.isPending}>
          {save.isPending ? 'Enregistrement…' : product ? 'Enregistrer' : 'Créer le produit'}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
