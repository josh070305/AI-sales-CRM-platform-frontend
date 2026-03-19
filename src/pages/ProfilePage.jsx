import { useAuthStore } from '../features/auth/authStore';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/shared/SectionHeader';

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Profile" title="Your workspace identity" description="Role, preferences, and contact data used across the CRM." />
      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Name</p>
            <p className="mt-2 text-xl font-semibold">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
            <p className="mt-2 text-xl font-semibold">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Role</p>
            <p className="mt-2 text-xl font-semibold capitalize">{user?.role?.replaceAll('_', ' ')}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Phone</p>
            <p className="mt-2 text-xl font-semibold">{user?.phoneNumber || 'Not set'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
