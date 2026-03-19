import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../features/auth/authStore';
import { useToast } from '../hooks/useToast';

export function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [form, setForm] = useState({ email: 'admin@aicrm.com', password: 'Password123!' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/app/dashboard');
    } catch (error) {
      toast.push({
        title: 'Login failed',
        description: error.response?.data?.message || 'Check your credentials and try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-white/10 bg-white/10 p-8 text-white">
      <h2 className="text-3xl font-semibold">Welcome back</h2>
      <p className="mt-2 text-sm text-slate-300">Use the seeded demo account or your own registered workspace login.</p>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
        <Input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
        />
        <Button className="w-full py-3" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
        <Link to="/forgot-password">Forgot password?</Link>
        <Link to="/register">Create account</Link>
      </div>
    </Card>
  );
}
