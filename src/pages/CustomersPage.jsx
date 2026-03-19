import { useQuery } from '@tanstack/react-query';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/shared/SectionHeader';
import { formatCurrency, formatDate } from '../lib/utils';
import api from '../services/api';

export function CustomersPage() {
  const { data } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => (await api.get('/deals')).data.data.filter((deal) => deal.stage !== 'Lost'),
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Customers"
        title="Active accounts and open opportunities"
        description="A lightweight customer view generated from your converted lead and deal data."
      />
      <div className="grid gap-4">
        {(data || []).map((deal) => (
          <Card key={deal._id}>
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h3 className="text-xl font-semibold">{deal.customerName}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Deal: {deal.title} • Stage: {deal.stage}
                </p>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <p>Value {formatCurrency(deal.estimatedAmount)}</p>
                <p className="mt-1">Expected close {formatDate(deal.expectedCloseDate)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
