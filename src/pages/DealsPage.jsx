import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/shared/SectionHeader';
import { formatCurrency, formatDate } from '../lib/utils';

const stages = ['New', 'Contacted', 'Qualified', 'Demo Scheduled', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];

export function DealsPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => (await api.get('/deals')).data.data,
  });

  const updateStage = useMutation({
    mutationFn: async ({ id, stage }) => (await api.patch(`/deals/${id}`, { stage })).data.data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deals'] }),
  });

  const grouped = useMemo(
    () =>
      stages.reduce((acc, stage) => {
        acc[stage] = (data || []).filter((deal) => deal.stage === stage);
        return acc;
      }, {}),
    [data]
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Pipeline"
        title="Drag the business forward"
        description="Move deals across stages with a kanban-style board. Each change writes stage history and triggers live updates."
      />
      <div className="grid gap-4 xl:grid-cols-4">
        {stages.map((stage) => (
          <Card key={stage} className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">{stage}</h3>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">{grouped[stage]?.length || 0}</span>
            </div>
            <div className="space-y-3">
              {(grouped[stage] || []).map((deal) => (
                <div key={deal._id} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
                  <Link to={`/app/deals/${deal._id}`} className="block">
                    <p className="font-semibold">{deal.title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{deal.customerName}</p>
                    <p className="mt-3 text-sm font-medium">{formatCurrency(deal.estimatedAmount)}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Close {formatDate(deal.expectedCloseDate)}</p>
                  </Link>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {stages
                      .filter((option) => option !== stage)
                      .slice(0, 3)
                      .map((option) => (
                        <button
                          key={option}
                          onClick={() => updateStage.mutate({ id: deal._id, stage: option })}
                          className="rounded-full border border-slate-200 px-3 py-1 text-xs dark:border-slate-700"
                        >
                          Move to {option}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
