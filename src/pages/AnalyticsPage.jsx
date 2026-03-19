import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/shared/SectionHeader';
import { formatCurrency } from '../lib/utils';

export function AnalyticsPage() {
  const { data } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => (await api.get('/analytics')).data.data,
  });

  const teamQuery = useQuery({
    queryKey: ['teamAnalytics'],
    queryFn: async () => (await api.get('/analytics/team')).data.data,
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Analytics"
        title="See what is driving pipeline velocity"
        description="Visualize lead source quality, stage distribution, rep output, and follow-up pressure trends."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <p className="mb-4 text-lg font-semibold">Leads by source</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data?.leadsBySource || []} dataKey="value" nameKey="name" outerRadius={110} fill="#1eb487" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <p className="mb-4 text-lg font-semibold">Pipeline by stage</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.dealsByStage || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#1eb487" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <p className="mb-4 text-lg font-semibold">Monthly conversion trend</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.monthlyConversions || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="created" fill="#38bdf8" radius={[10, 10, 0, 0]} />
                <Bar dataKey="won" fill="#1eb487" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <p className="mb-4 text-lg font-semibold">Top sales reps</p>
          <div className="space-y-4">
            {(data?.topSalesReps || []).map((rep) => (
              <div key={rep.name} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{rep.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{rep.deals} deals</p>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Revenue managed {formatCurrency(rep.revenue)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <p className="mb-4 text-lg font-semibold">Team performance snapshot</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(teamQuery.data || []).map((member) => (
            <div key={member._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-semibold">{member.name}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{member.role.replaceAll('_', ' ')}</p>
              <p className="mt-4 text-sm">Leads: {member.leadsCount}</p>
              <p className="text-sm">Deals: {member.dealsCount}</p>
              <p className="text-sm">Won deals: {member.wonDeals}</p>
              <p className="text-sm">Pipeline value: {formatCurrency(member.pipelineRevenue)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
