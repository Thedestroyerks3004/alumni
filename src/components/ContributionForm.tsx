import { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface ContributionFormProps {
  user: any;
  accessToken: string;
  onBack: () => void;
  onSuccess: () => void;
}

export function ContributionForm({ user, accessToken, onBack, onSuccess }: ContributionFormProps) {
  const maxSemesters = parseInt(user.semester) - 1;
  
  const [formData, setFormData] = useState({
    amountRequired: '',
    totalCGPA: '',
    reason: ''
  });

  const [semesterGPA, setSemesterGPA] = useState<{ semester: number; gpa: string }[]>(
    Array.from({ length: maxSemesters }, (_, i) => ({ semester: i + 1, gpa: '' }))
  );

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGPAChange = (index: number, value: string) => {
    const updated = [...semesterGPA];
    updated[index].gpa = value;
    setSemesterGPA(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    if (!formData.amountRequired || !formData.totalCGPA) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate all semester GPAs
    for (let i = 0; i < semesterGPA.length; i++) {
      if (!semesterGPA[i].gpa) {
        setError(`Please enter GPA for Semester ${i + 1}`);
        return;
      }
      const gpa = parseFloat(semesterGPA[i].gpa);
      if (isNaN(gpa) || gpa < 0 || gpa > 10) {
        setError(`Invalid GPA for Semester ${i + 1}. Must be between 0 and 10`);
        return;
      }
    }

    const cgpa = parseFloat(formData.totalCGPA);
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      setError('Invalid CGPA. Must be between 0 and 10');
      return;
    }

    const amount = parseInt(formData.amountRequired);
    if (isNaN(amount) || amount <= 0) {
      setError('Invalid amount');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-adaf32ad/scholarship`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amountRequired: amount,
            totalCGPA: cgpa,
            reason: formData.reason,
            semesterGPA: semesterGPA.map(s => ({ semester: s.semester, gpa: parseFloat(s.gpa) }))
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit scholarship request');
      }

      alert('Scholarship request submitted successfully!');
      onSuccess();
    } catch (err) {
      console.log('Error submitting scholarship:', err);
      setError('Failed to submit scholarship request. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF4FC] to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="mb-2" style={{
              background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Scholarship Application
            </h2>
            <p className="text-gray-600 text-sm">
              Fill in your details to request scholarship support
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details */}
            <div className="space-y-4">
              <h3 className="text-gray-700">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm bg-gradient-to-br from-[#EEF4FC] to-white p-4 rounded-lg">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="text-gray-800">{user.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Roll Number</p>
                  <p className="text-gray-800">{user.rollNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">Department</p>
                  <p className="text-gray-800">{user.department}</p>
                </div>
                <div>
                  <p className="text-gray-500">Year & Semester</p>
                  <p className="text-gray-800">Year {user.year}, Sem {user.semester}</p>
                </div>
              </div>
            </div>

            {/* Scholarship Details */}
            <div>
              <label className="block text-gray-500 text-sm mb-2">
                Amount Required (in ₹) *
              </label>
              <input
                type="number"
                name="amountRequired"
                value={formData.amountRequired}
                onChange={handleChange}
                placeholder="Enter amount needed"
                required
                min="1"
                className="w-full pb-2 border-b border-gray-300 focus:border-[#8E2DE2] outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-sm mb-2">
                Reason for Scholarship (Optional)
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Briefly describe why you need this scholarship"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-[#8E2DE2] outline-none transition-colors resize-none"
              />
            </div>

            {/* Academic Performance */}
            <div>
              <h3 className="text-gray-700 mb-4">Academic Performance</h3>
              
              <div className="mb-4">
                <label className="block text-gray-500 text-sm mb-2">
                  Total CGPA *
                </label>
                <input
                  type="number"
                  name="totalCGPA"
                  value={formData.totalCGPA}
                  onChange={handleChange}
                  placeholder="e.g., 8.5"
                  required
                  step="0.01"
                  min="0"
                  max="10"
                  className="w-full pb-2 border-b border-gray-300 focus:border-[#8E2DE2] outline-none transition-colors"
                />
              </div>

              <div className="space-y-3">
                <p className="text-gray-600 text-sm">Semester-wise GPA *</p>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {semesterGPA.map((sem, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 w-24">Semester {sem.semester}</span>
                      <input
                        type="number"
                        value={sem.gpa}
                        onChange={(e) => handleGPAChange(index, e.target.value)}
                        placeholder="GPA"
                        required
                        step="0.01"
                        min="0"
                        max="10"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-[#8E2DE2] outline-none transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  * Enter GPA for all completed semesters (Semester 1 to {maxSemesters})
                </p>
              </div>
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
              {loading ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
