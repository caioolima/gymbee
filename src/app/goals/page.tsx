'use client';

import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { GoalsLayout } from './_componentes/GoalsLayout';

export default function GoalsPage() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <GoalsLayout user={user} />
    </AuthGuard>
  );
}
