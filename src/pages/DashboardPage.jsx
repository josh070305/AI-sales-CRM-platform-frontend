import { useQuery } from '@tanstack/react-query';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/shared/SectionHeader';
import { formatCurrency } from '../lib/utils';
import api from '../services/api';
import { useNotifications } from '../features/notifications/useNotifications';

const trendData = [
  { name: 'Jan', value: 120000 },
  { name: 'Feb', value: 165000 },
  { name: 'Mar', value: 182000 },
  { name: 'Apr', value: 226000 },
  { name: 'May', value: 244000 },
  { name: 'Jun', value: 292000 },
];

export function DashboardPage() {
  const { recent } = useNotifications();
  const { data } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await api.get('/analytics/dashboard')).data.data,
  });

  const cards = [
    ['Total leads', data?.totalLeads || 0],
    ['Active deals', data?.activeDeals || 0],
    ['Won deals', data?.wonDeals || 0],
    ['Lost deals', data?.lostDeals || 0],
    ['Overdue follow-ups', data?.overdueFollowUps || 0],
    ['Assigned tasks', data?.assignedTasks || 0],
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Revenue cockpit"
        title="Your sales operations in one live workspace"
        description="Track pipeline health, follow-up pressure, forecast value, and team activity from one dashboard."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Revenue forecast</p>
              <h3 className="mt-2 text-2xl font-semibold">{formatCurrency(data?.revenueForecast)}</h3>
            </div>
            <p className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-200">
              Conversion {data?.conversionRate || 0}%
            </p>
          </div>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1eb487" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#1eb487" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area type="monotone" dataKey="value" stroke="#1eb487" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Recent notifications</p>
          <div className="mt-5 space-y-4">
            {recent.length ? (
              recent.map((item) => (
                <div key={item._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.message}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No recent notifications.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
