import { ConstructionIcon } from '../components/ConstructionIcon'
import './ConstructionPage.css'

export const ConstructionPage = () => {
  return (
    <div className="construction-container">
      <div className="construction-content">
        <ConstructionIcon />
        <h1 className="construction-title">Site em Construção</h1>
        <p className="construction-message">
          Estamos trabalhando para trazer uma experiência incrível para você.
          Em breve, estaremos no ar!
        </p>
        <div className="construction-divider"></div>
        <p className="construction-footer">
          Marshall - Em breve
        </p>
      </div>
    </div>
  )
}

