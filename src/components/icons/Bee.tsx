import React from 'react';

type BeeProps = React.SVGProps<SVGSVGElement>;

export function Bee(props: BeeProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 13c0 3.866 3.582 7 8 7s8-3.134 8-7-3.582-7-8-7-8 3.134-8 7Z" />
      <path d="M7 13h10" />
      <path d="M6 16h12" />
      <path d="M12 6V3" />
      <path d="M9 4s1.5 1 3 1 3-1 3-1" />
      <path d="M5 9s2-2 7-2 7 2 7 2" />
      <path d="M4 13s2 2 8 2 8-2 8-2" />
      <circle cx="8.5" cy="11" r="1" fill="currentColor" />
      <circle cx="15.5" cy="11" r="1" fill="currentColor" />
    </svg>
  );
}

export default Bee;


