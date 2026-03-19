import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });
    navigate('/login');
  }

  return (
    <Card className="border-white/10 bg-white/10 p-8 text-white">
      <h2 className="text-3xl font-semibold">Create a new password</h2>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" />
        <Button className="w-full py-3">Update password</Button>
      </form>
    </Card>
  );
}
