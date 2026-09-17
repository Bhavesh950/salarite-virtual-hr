'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ActivityTimeline } from '@/components/activity/ActivityTimeline';

export default function ActivityPage() {
  return (
    <AppShell
      title="Activity"
      subtitle="Complete timeline of all actions and automated workflows performed by Virtual HR."
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Activity Timeline
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Audit log of all recruitment decisions, schedule updates, and automated screenings.
          </p>
        </div>

        <ActivityTimeline />
      </div>
    </AppShell>
  );
}
