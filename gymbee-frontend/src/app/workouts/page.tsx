'use client';

import { WorkoutsManager } from './_componentes/WorkoutsManager';
import { SimpleAuthGuard } from '@/components/SimpleAuthGuard';

export default function WorkoutsPage() {
  return (
    <SimpleAuthGuard>
      <WorkoutsManager />
    </SimpleAuthGuard>
  );
}
