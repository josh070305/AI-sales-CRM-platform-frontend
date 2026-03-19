import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/shared/SectionHeader';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { useAuthStore } from '../features/auth/authStore';
import { useThemeStore } from '../features/settings/themeStore';

export function SettingsPage() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);
  const setTheme = useThemeStore((state) => state.setTheme);
  const { data } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => (await api.get('/settings')).data.data,
  });
  const [form, setForm] = useState({
    name: '',
    phoneNumber: '',
    themePreference: 'dark',
    smsAlertsEnabled: false,
  });

  useEffect(() => {
    if (data?.profile) {
      setForm({
        name: data.profile.name || '',
        phoneNumber: data.profile.phoneNumber || '',
        themePreference: data.profile.themePreference || 'dark',
        smsAlertsEnabled: data.profile.smsAlertsEnabled || false,
      });
    }
  }, [data]);

  const updateProfile = useMutation({
    mutationFn: async (payload) => (await api.patch('/settings/profile', payload)).data.data,
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      updateUser(user);
      if (user.themePreference && user.themePreference !== 'system') {
        setTheme(user.themePreference);
      }
    },
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Settings"
        title="Workspace preferences"
        description="Manage profile details, theme selection, and optional SMS alerts with graceful fallback if Twilio is not configured."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <p className="text-lg font-semibold">Profile settings</p>
          <form
            className="mt-4 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile.mutate(form);
            }}
          >
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
            <Input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="Phone number" />
            <Select value={form.themePreference} onChange={(e) => setForm({ ...form, themePreference: e.target.value })}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </Select>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.smsAlertsEnabled}
                disabled={!data?.smsAvailable}
                onChange={(e) => setForm({ ...form, smsAlertsEnabled: e.target.checked })}
              />
              Enable critical SMS alerts
            </label>
            {!data?.smsAvailable ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Twilio is not configured, so SMS alerts remain disabled.</p>
            ) : null}
            <Button type="submit">{updateProfile.isPending ? 'Saving...' : 'Save profile'}</Button>
          </form>
        </Card>

        <Card>
          <p className="text-lg font-semibold">Company settings</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Company administration endpoints are enabled on the backend for admin users. This screen surfaces core profile
            preferences and SMS capability for all roles.
          </p>
        </Card>
      </div>
    </div>
  );
}
