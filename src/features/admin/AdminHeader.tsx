import { NavLink } from 'react-router-dom'

// The intro band shared by the admin pages, with the tabs between them. NavLink marks the current
// tab (aria-current="page", plus the is-active class); `end` stops /admin matching /admin/orders.
function AdminHeader({ title }: { title: string }) {
  return (
    <section className="orders-intro admin-intro">
      <p className="eyebrow"><span className="eyebrow-dot" /> Administration</p>
      <h1>{title}<em>.</em></h1>
      <nav className="admin-tabs" aria-label="Administration">
        <NavLink end to="/admin" className={({ isActive }) => `admin-tab${isActive ? ' is-active' : ''}`}>
          Catalogue
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => `admin-tab${isActive ? ' is-active' : ''}`}>
          Commandes
        </NavLink>
      </nav>
    </section>
  )
}

export default AdminHeader
