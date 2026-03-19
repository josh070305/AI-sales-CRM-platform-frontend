import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '../../services/socket';
import { useAuthStore } from '../auth/authStore';

export function useSocketPresence() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const socket = getSocket(token);
    if (!socket) return;

    const onPresence = ({ userId, isOnline }) => {
      queryClient.setQueryData(['team'], (current = []) =>
        current.map((user) => (user._id === userId ? { ...user, isOnline } : user))
      );
    };

    socket.on('presence:update', onPresence);
    return () => socket.off('presence:update', onPresence);
  }, [queryClient, token]);
}
