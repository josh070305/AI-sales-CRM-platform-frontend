import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import api from '../services/api';
import { SectionHeader } from '../components/shared/SectionHeader';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../lib/utils';

const initialForm = {
  fullName: '',
  email: '',
  phoneNumber: '',
  company: '',
  source: 'Website',
  industry: '',
  estimatedValue: 0,
  status: 'new',
  priority: 'medium',
  notes: '',
};

export function LeadsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '' });
  const [form, setForm] = useState(initialForm);

  const { data } = useQuery({
    queryKey: ['leads', filters],
    queryFn: async () => (await api.get('/leads', { params: filters })).data.data,
  });

  const createLead = useMutation({
    mutationFn: async (payload) => (await api.post('/leads', payload)).data.data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setOpen(false);
      setForm(initialForm);
    },
  });

  const items = useMemo(() => data?.items || [], [data]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Lead management"
        title="Track every inbound opportunity with context"
        description="Create, filter, assign, and qualify leads across your team without losing timeline visibility."
        action={
          <Button className="gap-2" onClick={() => setOpen(true)}>
            <Plus size={16} />
            New lead
          </Button>
        }
      />

      <Card className="grid gap-4 lg:grid-cols-[1fr_180px_180px]">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-10"
            placeholder="Search name, company, email, or phone"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal</option>
          <option value="negotiation">Negotiation</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </Select>
        <Select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </Select>
      </Card>

      <div className="grid gap-4">
        {items.map((lead) => (
          <Link to={`/app/leads/${lead._id}`} key={lead._id}>
            <Card className="transition hover:-translate-y-0.5">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold">{lead.fullName}</h3>
                    <Badge variant={lead.priority === 'high' || lead.priority === 'urgent' ? 'warning' : 'default'}>
                      {lead.priority}
                    </Badge>
                    <Badge variant={lead.status === 'converted' ? 'success' : 'brand'}>{lead.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {lead.company} • {lead.email} • {lead.phoneNumber || 'No phone'}
                  </p>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  <p>Estimated value</p>
                  <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{formatCurrency(lead.estimatedValue)}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create new lead">
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            createLead.mutate({ ...form, estimatedValue: Number(form.estimatedValue) });
          }}
        >
          <Input placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Phone number" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
          <Input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <Input placeholder="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
          <Input placeholder="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
          <Input
            type="number"
            placeholder="Estimated value"
            value={form.estimatedValue}
            onChange={(e) => setForm({ ...form, estimatedValue: e.target.value })}
          />
          <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>
          <div className="md:col-span-2">
            <Textarea placeholder="Context and notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit">{createLead.isPending ? 'Creating...' : 'Create lead'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
