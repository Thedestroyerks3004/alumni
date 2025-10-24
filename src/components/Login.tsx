import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface LoginProps {
  onBack: () => void;
  onLoginSuccess: (accessToken: string, user: any) => void;
}

export function Login({ onBack, onLoginSuccess }: LoginProps) {
  const [userType, setUserType] = useState<'student' | 'alumni'>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-adaf32ad/login`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userType,
            identifier,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      if (remember) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      onLoginSuccess(data.accessToken, data.user);
    } catch (err) {
      console.log('Login error:', err);
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF4FC] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm mb-1">Hello!</p>
          <h2 className="mb-2" style={{
            background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Good Morning
          </h2>
          <p className="text-sm" style={{ color: '#8E2DE2' }}>
            Login Your Account
          </p>
        </div>

        <div className="flex rounded-lg overflow-hidden mb-6">
          <button
            onClick={() => setUserType('student')}
            className="flex-1 py-3 transition-all"
            style={{
              background: userType === 'student' 
                ? 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)' 
                : '#F1F3F6',
              color: userType === 'student' ? 'white' : '#777'
            }}
          >
            STUDENT
          </button>
          <button
            onClick={() => setUserType('alumni')}
            className="flex-1 py-3 transition-all"
            style={{
              background: userType === 'alumni' 
                ? 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)' 
                : '#F1F3F6',
              color: userType === 'alumni' ? 'white' : '#777'
            }}
          >
            ALUMNI
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-500 text-sm mb-2">
              {userType === 'student' ? 'Roll Number' : 'Email ID'}
            </label>
            <input
              type={userType === 'alumni' ? 'email' : 'text'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={userType === 'student' ? 'Enter your roll number' : 'Enter your email'}
              required
              className="w-full pb-2 border-b border-gray-300 focus:border-[#8E2DE2] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-500 text-sm mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full pb-2 border-b border-gray-300 focus:border-[#8E2DE2] outline-none transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded"
              />
              Remember
            </label>
            <a href="#" className="text-[#8E2DE2] hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white transition-all hover:shadow-lg disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)'
            }}
          >
            {loading ? 'LOGGING IN...' : 'SUBMIT'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Create Account?{' '}
            <button 
              onClick={onBack}
              className="text-[#8E2DE2] hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="text-gray-500 text-sm flex items-center gap-1 mx-auto hover:text-gray-700"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
