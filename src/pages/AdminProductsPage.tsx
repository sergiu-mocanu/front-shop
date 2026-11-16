import { useState } from 'react'
import ConfirmDialog from '@/components/ConfirmDialog'
import DataTable, { type Column } from '@/components/DataTable'
import AdminHeader from '@/features/admin/AdminHeader'
import ProductForm from '@/features/admin/ProductForm'
import { useDeleteProduct, useProducts } from '@/features/products/queries'
import type { Product } from '@/types/ecommerce'

// What the form shows: nothing, a new product, or the product being edited.
type Editing = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; product: Product }

// /admin: the catalogue table, the create/edit form, and deletion behind a confirmation.
function AdminProductsPage() {
  const products = useProducts()
  const deleteProduct = useDeleteProduct()
  const [editing, setEditing] = useState<Editing>({ mode: 'closed' })
  const [toDelete, setToDelete] = useState<Product | null>(null)

  const closeDelete = () => {
    setToDelete(null)
    deleteProduct.reset() // forget the last error, so it doesn't show on the next dialog
  }

  const columns: Column<Product>[] = [
    { header: 'Produit', cell: (product) => <strong>{product.name}</strong> },
    { header: 'Catégorie', cell: (product) => product.category ?? '—' },
    { header: 'Prix', cell: (product) => `${product.price} €`, className: 'is-numeric' },
    { header: 'Stock', cell: (product) => (product.in_stock ? 'En stock' : 'Épuisé') },
    {
      header: 'Actions',
      cell: (product) => (
        <div className="row-actions">
          <button className="add-button" type="button" onClick={() => setEditing({ mode: 'edit', product })}>
            Modifier<span className="visually-hidden"> {product.name}</span>
          </button>
          <button className="add-button is-danger" type="button" onClick={() => setToDelete(product)}>
            Supprimer<span className="visually-hidden"> {product.name}</span>
          </button>
        </div>
      ),
    },
  ]

  return (
    <main className="orders-page">
      <AdminHeader title="Catalogue" />
      <section className="orders-content">
        {editing.mode === 'closed' ? (
          <button className="add-button is-primary admin-new" type="button" onClick={() => setEditing({ mode: 'create' })}>
            Nouveau produit <span aria-hidden="true">＋</span>
          </button>
        ) : (
          <ProductForm
            key={editing.mode === 'edit' ? editing.product.id : 'new'}
            product={editing.mode === 'edit' ? editing.product : undefined}
            onDone={() => setEditing({ mode: 'closed' })}
          />
        )}
        {products.status === 'pending' ? (
          <p className="fetch-message" role="status">Chargement du catalogue…</p>
        ) : products.status === 'error' ? (
          <p className="fetch-message error-message" role="alert">{products.error.message}</p>
        ) : (
          <DataTable
            caption="Produits du catalogue"
            columns={columns}
            rows={products.data}
            rowKey={(product) => product.id}
            empty="Le catalogue est vide."
          />
        )}
      </section>
      <ConfirmDialog
        open={toDelete !== null}
        title="Supprimer ce produit ?"
        confirmLabel="Supprimer"
        pending={deleteProduct.isPending}
        error={deleteProduct.error?.message}
        onConfirm={() => toDelete && deleteProduct.mutate(toDelete.id, { onSuccess: closeDelete })}
        onCancel={closeDelete}
      >
        <p>« {toDelete?.name} » sera retiré du catalogue. Cette action est définitive.</p>
      </ConfirmDialog>
    </main>
  )
}

export default AdminProductsPage
