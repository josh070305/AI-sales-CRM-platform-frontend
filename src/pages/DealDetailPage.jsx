import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/shared/SectionHeader';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { formatCurrency, formatDate } from '../lib/utils';

const stages = ['New', 'Contacted', 'Qualified', 'Demo Scheduled', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];

export function DealDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [stage, setStage] = useState('Qualified');
  const [stageNote, setStageNote] = useState('');

  const { data } = useQuery({
    queryKey: ['deal', id],
    queryFn: async () => (await api.get(`/deals/${id}`)).data.data,
  });

  const updateDeal = useMutation({
    mutationFn: async (payload) => (await api.patch(`/deals/${id}`, payload)).data.data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deal', id] }),
  });

  const deal = data?.deal;
  if (!deal) return null;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Deal detail"
        title={deal.title}
        description={`${deal.customerName} • ${deal.stage} • ${formatCurrency(deal.estimatedAmount)}`}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Expected close</p>
              <p className="mt-2 font-semibold">{formatDate(deal.expectedCloseDate)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Probability</p>
              <p className="mt-2 font-semibold">{deal.probability}%</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Lead</p>
              <p className="mt-2 font-semibold">{deal.lead?.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Assigned rep</p>
              <p className="mt-2 font-semibold">{deal.assignedTo?.name}</p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-lg font-semibold">Stage history</p>
            <div className="mt-4 space-y-3">
              {deal.stageLogs.map((item, index) => (
                <div key={`${item.stage}-${index}`} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{item.stage}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(item.changedAt)}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-lg font-semibold">Update stage</p>
          <form
            className="mt-4 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateDeal.mutate({ stage, stageNote });
            }}
          >
            <Select value={stage} onChange={(e) => setStage(e.target.value)}>
              {stages.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <Textarea value={stageNote} onChange={(e) => setStageNote(e.target.value)} placeholder="Reason, context, or outcome" />
            <Button type="submit" className="w-full">
              {updateDeal.isPending ? 'Updating...' : 'Save stage update'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
