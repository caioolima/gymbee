'use client';

import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { DashboardLayout } from './_componentes/DashboardLayout';
import { SimpleAuthGuard } from '@/components/SimpleAuthGuard';

export default function DashboardPage() {
  const { user } = useSimpleAuth();

  return (
    <SimpleAuthGuard>
      <DashboardLayout user={user} />
    </SimpleAuthGuard>
  );
}
