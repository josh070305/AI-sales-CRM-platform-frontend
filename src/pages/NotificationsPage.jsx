import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/shared/SectionHeader';
import { useNotifications } from '../features/notifications/useNotifications';
import { formatDate } from '../lib/utils';

export function NotificationsPage() {
  const queryClient = useQueryClient();
  const { items, unreadCount } = useNotifications();

  const markAll = useMutation({
    mutationFn: async () => (await api.patch('/notifications/read-all')).data.data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markOne = useMutation({
    mutationFn: async (id) => (await api.patch(`/notifications/${id}/read`)).data.data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Notifications"
        title="Live operational signal"
        description="Assignment changes, due follow-ups, deal movement, messages, and security events all surface here."
        action={<Button onClick={() => markAll.mutate()}>Mark all as read ({unreadCount})</Button>}
      />
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item._id}>
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.message}</p>
                <p className="mt-2 text-xs text-slate-400">{formatDate(item.createdAt)}</p>
              </div>
              {!item.readAt ? (
                <Button variant="outline" onClick={() => markOne.mutate(item._id)}>
                  Mark read
                </Button>
              ) : (
                <span className="text-sm text-slate-400">Read</span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
