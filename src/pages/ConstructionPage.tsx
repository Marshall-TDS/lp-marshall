import { ConstructionIcon } from '../components/ConstructionIcon'
import './ConstructionPage.css'

export const ConstructionPage = () => {
  return (
    <div className="construction-container">
      <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="https://homolog-app.marshalltds.com/assets/video-login-CDUJfm-9.mp4"
          type="video/mp4"
        />
      </video>
      <div className="video-overlay"></div>
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

