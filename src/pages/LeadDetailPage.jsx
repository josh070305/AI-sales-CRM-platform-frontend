import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { SectionHeader } from '../components/shared/SectionHeader';
import { formatCurrency, formatDate } from '../lib/utils';

const aiActions = [
  ['summarize_lead', 'Summarize history'],
  ['follow_up_email', 'Generate email'],
  ['follow_up_whatsapp', 'Generate WhatsApp'],
  ['next_action', 'Suggest next step'],
  ['score_lead', 'Score quality'],
  ['suggest_priority', 'Suggest priority'],
];

export function LeadDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [activityForm, setActivityForm] = useState({ type: 'note', content: '', dueAt: '' });
  const [aiOutput, setAiOutput] = useState('');
  const [converting, setConverting] = useState(false);

  const { data } = useQuery({
    queryKey: ['lead', id],
    queryFn: async () => (await api.get(`/leads/${id}`)).data.data,
  });

  const createActivity = useMutation({
    mutationFn: async (payload) => (await api.post('/activities', payload)).data.data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      setActivityForm({ type: 'note', content: '', dueAt: '' });
    },
  });

  const aiMutation = useMutation({
    mutationFn: async (payload) => (await api.post('/ai/actions', payload)).data.data,
    onSuccess: (result) => setAiOutput(result.content),
  });

  const lead = data?.lead;

  async function handleConvert() {
    setConverting(true);
    await api.post(`/leads/${id}/convert`, {
      expectedCloseDate: new Date(Date.now() + 14 * 86400000),
    });
    queryClient.invalidateQueries({ queryKey: ['lead', id] });
    queryClient.invalidateQueries({ queryKey: ['deals'] });
    setConverting(false);
  }

  if (!lead) return null;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Lead detail"
        title={lead.fullName}
        description={`${lead.company} • ${lead.email} • ${lead.phoneNumber || 'No phone saved'}`}
        action={
          <Button onClick={handleConvert} disabled={converting || lead.status === 'converted'}>
            {lead.status === 'converted' ? 'Already converted' : converting ? 'Converting...' : 'Convert to deal'}
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
              <div className="mt-2 flex gap-2">
                <Badge variant="brand">{lead.status}</Badge>
                <Badge variant={lead.priority === 'high' || lead.priority === 'urgent' ? 'warning' : 'default'}>
                  {lead.priority}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Estimated value</p>
              <p className="mt-2 text-2xl font-semibold">{formatCurrency(lead.estimatedValue)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Source</p>
              <p className="mt-2 font-medium">{lead.source || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Industry</p>
              <p className="mt-2 font-medium">{lead.industry || 'Unknown'}</p>
            </div>
          </div>
          <div className="mt-6 rounded-3xl border border-slate-200 p-5 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Notes</p>
            <p className="mt-2 text-sm leading-6">{lead.notes || 'No notes yet.'}</p>
          </div>

          <div className="mt-6">
            <p className="text-lg font-semibold">Timeline</p>
            <div className="mt-4 space-y-3">
              {data.activities.map((activity) => (
                <div key={activity._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{activity.type.replace('_', ' ')}</p>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(activity.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{activity.content}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <p className="text-lg font-semibold">Log activity</p>
            <form
              className="mt-4 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                createActivity.mutate({
                  ...activityForm,
                  lead: id,
                  dueAt: activityForm.dueAt || undefined,
                });
              }}
            >
              <Select value={activityForm.type} onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}>
                <option value="note">Note</option>
                <option value="call">Call</option>
                <option value="meeting">Meeting</option>
                <option value="follow_up">Follow-up</option>
                <option value="email">Email</option>
              </Select>
              <Textarea value={activityForm.content} onChange={(e) => setActivityForm({ ...activityForm, content: e.target.value })} />
              <Input type="date" value={activityForm.dueAt} onChange={(e) => setActivityForm({ ...activityForm, dueAt: e.target.value })} />
              <Button type="submit" className="w-full">
                {createActivity.isPending ? 'Saving...' : 'Add activity'}
              </Button>
            </form>
          </Card>

          <Card>
            <p className="text-lg font-semibold">AI workspace</p>
            <div className="mt-4 grid gap-3">
              {aiActions.map(([action, label]) => (
                <Button
                  key={action}
                  variant="outline"
                  onClick={() =>
                    aiMutation.mutate({
                      action,
                      context: JSON.stringify(data, null, 2),
                      leadId: id,
                      saveToActivity: true,
                    })
                  }
                >
                  {label}
                </Button>
              ))}
            </div>
            <div className="mt-4 rounded-3xl border border-dashed border-slate-300 p-4 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:text-slate-300">
              {aiMutation.isPending ? 'Generating AI output...' : aiOutput || 'Run an AI action to generate sales-ready output.'}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
