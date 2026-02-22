import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Mail } from 'lucide-react';
import { authService } from '../../services';

const LoginPage: React.FC = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await authService.login(email, password);
      nav('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="font-headline font-black text-5xl uppercase tracking-tighter mb-2">
            The Daily Developer
          </h1>
          <p className="font-mono text-sm text-ink/60 uppercase tracking-widest">
            Admin Login
          </p>
        </div>

        {/* Login Form */}
        <div className="border-4 border-ink bg-newsprint p-8 shadow-[8px_8px_0_0_rgba(var(--rgb-ink),1)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-mono text-sm font-bold uppercase tracking-wide mb-2">
                <Mail size={16} className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-ink font-body text-base focus:outline-none focus:ring-2 focus:ring-ink/20"
                placeholder="admin@example.com"
                autoFocus
                disabled={loading}
              />
            </div>

            <div>
              <label className="block font-mono text-sm font-bold uppercase tracking-wide mb-2">
                <Key size={16} className="inline mr-2" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-ink font-body text-base focus:outline-none focus:ring-2 focus:ring-ink/20"
                placeholder="Enter password"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-600 p-3">
                <p className="font-mono text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-ink text-newsprint font-mono uppercase tracking-wide hover:bg-ink/90 transition-colors border-2 border-ink disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Login to Admin'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t-2 border-ink/20">
            <p className="font-mono text-xs text-ink/60 text-center">
              Secured with Firebase Authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
