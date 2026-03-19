import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { useAuthStore } from '../features/auth/authStore';
import { useToast } from '../hooks/useToast';

export function RegisterPage() {
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'sales_executive',
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.push({ title: 'Registration failed', description: 'Name is required.' });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.push({ title: 'Registration failed', description: 'Enter a valid email address.' });
      return;
    }
    if (form.password.length < 8) {
      toast.push({ title: 'Registration failed', description: 'Password must be at least 8 characters.' });
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate('/app/dashboard');
    } catch (error) {
      const details = error.response?.data?.data;
      const message = Array.isArray(details)
        ? details.map((item) => item.msg).join(', ')
        : error.response?.data?.message || 'Registration failed.';

      toast.push({
        title: 'Registration failed',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-white/10 bg-white/10 p-8 text-white">
      <h2 className="text-3xl font-semibold">Create workspace access</h2>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
        <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Work email" />
        <Input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
        />
        <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="admin">Admin</option>
          <option value="sales_manager">Sales Manager</option>
          <option value="sales_executive">Sales Executive</option>
        </Select>
        <Button className="w-full py-3" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
      <p className="mt-3 text-xs text-slate-400">Password must be at least 8 characters.</p>
      <p className="mt-5 text-sm text-slate-300">
        Already have access? <Link to="/login">Sign in</Link>
      </p>
    </Card>
  );
}
