import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SignupProps {
  onBack: () => void;
  onSignupSuccess: () => void;
}

export function Signup({ onBack, onSignupSuccess }: SignupProps) {
  const [userType, setUserType] = useState<'student' | 'alumni'>('student');
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    phone: '',
    department: '',
    year: '',
    semester: '',
    passedOutYear: '',
    linkedIn: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        userType,
        name: formData.name,
        rollNumber: formData.rollNumber,
        phone: formData.phone,
        department: formData.department,
        password: formData.password,
        ...(userType === 'alumni' ? {
          email: formData.email,
          passedOutYear: formData.passedOutYear,
          linkedIn: formData.linkedIn
        } : {
          year: formData.year,
          semester: formData.semester
        })
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-adaf32ad/signup`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }

      alert('Account created successfully! Please login.');
      onSignupSuccess();
    } catch (err) {
      console.log('Signup error:', err);
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF4FC] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 my-8">
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm mb-1">Hello!</p>
          <h2 className="mb-2" style={{
            background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Create Account
          </h2>
          <p className="text-sm" style={{ color: '#8E2DE2' }}>
            Sign Up to Get Started
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-500 text-sm mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full pb-2 border-b border-gray-300 focus:border-[#8E2DE2] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-500 text-sm mb-2">Roll Number</label>
            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="Enter your roll number"
              required
              className="w-full pb-2 border-b border-gray-300 focus:border-[#8E2DE2] outline-none transition-colors"
            />
          </div>

          {userType === 'alumni' ? (
            <>
              <div>
                <label className="block text-gray-500 text-sm mb-2">Email ID</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full pb-2 border-b border-gray-300 focus:border-[#8E2DE2] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-500 text-sm mb-2">Passed Out Year</label>
                <input
                  type="text"
                  name="passedOutYear"
                  value={formData.passedOutYear}
                  onChange={handleChange}
                  placeholder="e.g., 2020"
                  required
                  className="w-full pb-2 border-b border-gray-300 focus:border-[#8E2DE2] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-500 text-sm mb-2">LinkedIn Profile</label>
                <input
                  type="url"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleChange}
                  placeholder="LinkedIn URL"
                  className="w-full pb-2 border-b border-gray-300 focus:border-[#8E2DE2] outline-none transition-colors"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-gray-500 text-sm mb-2">Year of Study</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full pb-2 border-b border-gray-300 focus:border-[#8E2DE2] outline-none transition-colors bg-transparent"
                >
                  <option value="">Select year</option>
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                  <option value="4">Fourth Year</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 text-sm mb-2">Current Semester</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                  className="w-full pb-2 border-b border-gray-300 focus:border-[#8E2DE2] outline-none transition-colors bg-transparent"
                >
                  <option value="">Select semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-500 text-sm mb-2">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g., Computer Science"
              required
              className="w-full pb-2 border-b border-gray-300 focus:border-[#8E2DE2] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-500 text-sm mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
              className="w-full pb-2 border-b border-gray-300 focus:border-[#8E2DE2] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-500 text-sm mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="w-full pb-2 border-b border-gray-300 focus:border-[#8E2DE2] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-500 text-sm mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              required
              className="w-full pb-2 border-b border-gray-300 focus:border-[#8E2DE2] outline-none transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white transition-all hover:shadow-lg disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)'
            }}
          >
            {loading ? 'CREATING ACCOUNT...' : 'SUBMIT'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button 
              onClick={onBack}
              className="text-[#8E2DE2] hover:underline"
            >
              Login
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
