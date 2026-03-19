import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [tokenPreview, setTokenPreview] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    setTokenPreview(data.data?.resetTokenPreview || '');
  }

  return (
    <Card className="border-white/10 bg-white/10 p-8 text-white">
      <h2 className="text-3xl font-semibold">Reset password</h2>
      <p className="mt-2 text-sm text-slate-300">For local development the API returns a preview token instead of emailing it.</p>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email" />
        <Button className="w-full py-3">Generate reset token</Button>
      </form>
      {tokenPreview ? <p className="mt-5 text-sm text-brand-200">Reset token preview: {tokenPreview}</p> : null}
    </Card>
  );
}
