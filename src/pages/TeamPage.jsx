import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/shared/SectionHeader';

export function TeamPage() {
  const { data } = useQuery({
    queryKey: ['team'],
    queryFn: async () => (await api.get('/users')).data.data,
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Team"
        title="Manage your revenue organization"
        description="Admins and managers can view teammates, roles, and presence state from a single workspace page."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(data || []).map((member) => (
          <Card key={member._id}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{member.name}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{member.email}</p>
              </div>
              <span className={`h-3 w-3 rounded-full ${member.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            </div>
            <p className="mt-4 text-sm capitalize">{member.role.replaceAll('_', ' ')}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{member.title || 'No title set'}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
