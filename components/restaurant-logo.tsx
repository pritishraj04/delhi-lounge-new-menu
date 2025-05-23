export function RestaurantLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      width="120"
      height="60"
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M60 10C42.33 10 28 24.33 28 42C28 59.67 42.33 74 60 74C77.67 74 92 59.67 92 42C92 24.33 77.67 10 60 10Z"
        fill="#FFD700"
        fillOpacity="0.2"
      />
      <path
        d="M60 15C45.09 15 33 27.09 33 42C33 56.91 45.09 69 60 69C74.91 69 87 56.91 87 42C87 27.09 74.91 15 60 15ZM60 64C47.85 64 38 54.15 38 42C38 29.85 47.85 20 60 20C72.15 20 82 29.85 82 42C82 54.15 72.15 64 60 64Z"
        fill="#FFD700"
      />
      <path d="M48 30L72 30" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
      <path d="M45 36H75" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
      <path d="M48 42H72" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
      <path d="M52 48H68" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
      <path d="M56 54H64" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
      <text
        x="60"
        y="80"
        textAnchor="middle"
        fill="#FFD700"
        fontFamily="var(--font-playfair)"
        fontSize="12"
        fontWeight="600"
      >
        THE DELHI LOUNGE
      </text>
    </svg>
  )
}
