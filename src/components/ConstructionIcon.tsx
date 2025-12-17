import './ConstructionIcon.css'

export const ConstructionIcon = () => {
  return (
    <div className="construction-icon">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="60"
          cy="60"
          r="55"
          stroke="var(--color-primary)"
          strokeWidth="4"
          strokeDasharray="8 8"
        />
        <path
          d="M40 60 L55 45 L75 45 L90 60 L75 75 L55 75 Z"
          fill="var(--color-primary)"
          opacity="0.2"
        />
        <path
          d="M50 60 L60 50 L70 50 L80 60 L70 70 L60 70 Z"
          fill="var(--color-primary)"
        />
      </svg>
    </div>
  )
}

