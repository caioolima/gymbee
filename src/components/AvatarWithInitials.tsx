'use client';

interface AvatarWithInitialsProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showOnlineStatus?: boolean;
}

export function AvatarWithInitials({ 
  name, 
  size = 'md', 
  className = '',
  showOnlineStatus = false 
}: AvatarWithInitialsProps) {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-accent to-yellow-400 rounded-full flex items-center justify-center shadow-lg relative ${className}`}>
      <span 
        className="text-background font-bold tracking-wider"
        style={{ fontFamily: 'var(--font-poppins)' }}
      >
        {initials}
      </span>
      
      {/* Online Status */}
      {showOnlineStatus && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
      )}
    </div>
  );
}

