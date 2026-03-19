import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SectionHeader } from '../components/shared/SectionHeader';
import { getSocket } from '../services/socket';
import { useAuthStore } from '../features/auth/authStore';
import { formatDate } from '../lib/utils';

export function MessagesPage() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [body, setBody] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const [recipientId, setRecipientId] = useState('');

  const conversationsQuery = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => (await api.get('/messages/conversations')).data.data,
  });

  const usersQuery = useQuery({
    queryKey: ['message-users'],
    queryFn: async () => (await api.get('/users')).data.data,
  });

  const activeConversation = useMemo(
    () => conversationsQuery.data?.find((conversation) => conversation._id === activeConversationId) || conversationsQuery.data?.[0],
    [conversationsQuery.data, activeConversationId]
  );

  const messagesQuery = useQuery({
    queryKey: ['messages', activeConversation?._id],
    enabled: Boolean(activeConversation?._id),
    queryFn: async () => (await api.get(`/messages/conversations/${activeConversation._id}`)).data.data,
  });

  const sendMessage = useMutation({
    mutationFn: async ({ recipientId, body }) => (await api.post('/messages', { recipientId, body })).data.data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages', activeConversation?._id] });
      setBody('');
    },
  });

  useEffect(() => {
    if (!activeConversation?._id) return;
    const socket = getSocket(token);
    if (!socket) return;

    socket.emit('conversation:join', activeConversation._id);

    const onMessage = (message) => {
      queryClient.setQueryData(['messages', activeConversation._id], (current = []) => [...current, message]);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    const onTyping = ({ userId, isTyping }) => {
      setTypingUser(isTyping ? userId : null);
    };

    socket.on('message:new', onMessage);
    socket.on('message:typing', onTyping);

    return () => {
      socket.off('message:new', onMessage);
      socket.off('message:typing', onTyping);
    };
  }, [activeConversation?._id, queryClient, token]);

  const otherParticipant = activeConversation?.participants?.find((participant) => participant._id !== user?._id);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Messaging"
        title="Live internal collaboration"
        description="One-to-one messaging with unread updates, typing indicators, timestamps, and online presence."
      />

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <Card className="p-4">
          <div className="space-y-3">
            {(conversationsQuery.data || []).map((conversation) => {
              const participant = conversation.participants.find((item) => item._id !== user?._id);
              return (
                <button
                  key={conversation._id}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    activeConversation?._id === conversation._id ? 'border-brand-400 bg-brand-50 dark:bg-brand-500/10' : 'border-slate-200 dark:border-slate-800'
                  }`}
                  onClick={() => setActiveConversationId(conversation._id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{participant?.name}</p>
                    <span className={`h-2.5 w-2.5 rounded-full ${participant?.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{conversation.lastMessage?.body || 'No messages yet'}</p>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="flex min-h-[640px] flex-col">
          {activeConversation ? (
            <>
              <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
                <p className="text-lg font-semibold">{otherParticipant?.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {otherParticipant?.isOnline ? 'Online now' : 'Offline'} {typingUser === otherParticipant?._id ? '• typing…' : ''}
                </p>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto py-5">
                {(messagesQuery.data || []).map((message) => (
                  <div key={message._id} className={`flex ${message.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xl rounded-3xl px-4 py-3 text-sm ${message.sender._id === user?._id ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
                      <p>{message.body}</p>
                      <p className={`mt-2 text-xs ${message.sender._id === user?._id ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <form
                className="flex gap-3 border-t border-slate-200 pt-4 dark:border-slate-800"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage.mutate({
                    recipientId: otherParticipant?._id,
                    body,
                  });
                }}
              >
                <Input
                  value={body}
                  onChange={(e) => {
                    setBody(e.target.value);
                    const socket = getSocket(token);
                    socket?.emit('message:typing', { conversationId: activeConversation._id, isTyping: true });
                  }}
                  placeholder="Type your message"
                />
                <Button type="submit">Send</Button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <p>No conversations yet. Start a direct message.</p>
              <div className="flex w-full max-w-md gap-3">
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                >
                  <option value="">Select teammate</option>
                  {(usersQuery.data || [])
                    .filter((member) => member._id !== user?._id)
                    .map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
                </select>
                <Button
                  onClick={() => {
                    if (!recipientId || !body) return;
                    sendMessage.mutate({ recipientId, body });
                  }}
                >
                  Start
                </Button>
              </div>
              <Input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write the first message" />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
