'use client';

// Proteção desabilitada: renderiza diretamente os filhos
export function ProtectedRoute({ children }: { children: React.ReactNode; redirectTo?: string }) {
  return <>{children}</>;
}