import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { useAuthStore } from '../auth/authStore';
import { getSocket } from '../../services/socket';

export function useNotifications() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.accessToken);
  const [liveUnread, setLiveUnread] = useState(null);

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get('/notifications');
      return response.data.data;
    },
  });

  useEffect(() => {
    const socket = getSocket(token);
    if (!socket) return;

    const onNew = (notification) => {
      queryClient.setQueryData(['notifications'], (current) => {
        const items = current?.items || [];
        const unreadCount = (current?.unreadCount || 0) + 1;
        setLiveUnread(unreadCount);
        return { items: [notification, ...items], unreadCount };
      });
    };

    const onReadAll = () => {
      queryClient.setQueryData(['notifications'], (current) => ({
        ...(current || { items: [] }),
        unreadCount: 0,
      }));
      setLiveUnread(0);
    };

    socket.on('notification:new', onNew);
    socket.on('notification:read_all', onReadAll);

    return () => {
      socket.off('notification:new', onNew);
      socket.off('notification:read_all', onReadAll);
    };
  }, [queryClient, token]);

  return {
    items: query.data?.items || [],
    recent: (query.data?.items || []).slice(0, 5),
    unreadCount: liveUnread ?? query.data?.unreadCount ?? 0,
    isLoading: query.isLoading,
  };
}
