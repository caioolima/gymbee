interface BeeIconProps {
  className?: string;
}

export function BeeIcon({ className = "w-6 h-6" }: BeeIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bee body */}
      <ellipse
        cx="12"
        cy="12"
        rx="8"
        ry="5"
        fill="#FCD34D"
        stroke="#F59E0B"
        strokeWidth="1"
      />
      
      {/* Bee stripes */}
      <ellipse
        cx="12"
        cy="10"
        rx="6"
        ry="1"
        fill="#F59E0B"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="6"
        ry="1"
        fill="#F59E0B"
      />
      <ellipse
        cx="12"
        cy="14"
        rx="6"
        ry="1"
        fill="#F59E0B"
      />
      
      {/* Bee head */}
      <circle
        cx="12"
        cy="8"
        r="3"
        fill="#FCD34D"
        stroke="#F59E0B"
        strokeWidth="1"
      />
      
      {/* Bee eyes */}
      <circle
        cx="10.5"
        cy="7"
        r="0.8"
        fill="#1F2937"
      />
      <circle
        cx="13.5"
        cy="7"
        r="0.8"
        fill="#1F2937"
      />
      
      {/* Bee antennae */}
      <line
        x1="10"
        y1="6"
        x2="9"
        y2="4"
        stroke="#1F2937"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="6"
        x2="15"
        y2="4"
        stroke="#1F2937"
        strokeWidth="1"
        strokeLinecap="round"
      />
      
      {/* Antennae tips */}
      <circle
        cx="9"
        cy="4"
        r="0.5"
        fill="#1F2937"
      />
      <circle
        cx="15"
        cy="4"
        r="0.5"
        fill="#1F2937"
      />
      
      {/* Bee wings */}
      <ellipse
        cx="8"
        cy="10"
        rx="2"
        ry="3"
        fill="#E5E7EB"
        fillOpacity="0.7"
        stroke="#9CA3AF"
        strokeWidth="0.5"
      />
      <ellipse
        cx="16"
        cy="10"
        rx="2"
        ry="3"
        fill="#E5E7EB"
        fillOpacity="0.7"
        stroke="#9CA3AF"
        strokeWidth="0.5"
      />
    </svg>
  );
}
