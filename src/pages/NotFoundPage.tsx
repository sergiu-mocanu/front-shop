import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <p className="eyebrow"><span className="eyebrow-dot" /> Erreur 404</p>
      <h1>Cette page n’existe pas.</h1>
      <p>La page demandée est introuvable.</p>
      <Link className="add-button" to="/">Retour à l’accueil</Link>
    </main>
  )
}

export default NotFoundPage
