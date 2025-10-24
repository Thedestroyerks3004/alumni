import { useEffect, useState } from 'react';
import { LogOut, IndianRupee, GraduationCap } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { ContributionForm } from './ContributionForm';

interface StudentDashboardProps {
  user: any;
  accessToken: string;
  onLogout: () => void;
}

export function StudentDashboard({ user, accessToken, onLogout }: StudentDashboardProps) {
  const [scholarship, setScholarship] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchScholarship();
  }, []);

  const fetchScholarship = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-adaf32ad/scholarship/${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setScholarship(data.scholarship);
      }
    } catch (error) {
      console.log('Error fetching scholarship:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchScholarship();
  };

  if (showForm) {
    return (
      <ContributionForm
        user={user}
        accessToken={accessToken}
        onBack={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
      />
    );
  }

  const progress = scholarship 
    ? (scholarship.totalReceived / scholarship.amountRequired) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF4FC] to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-gray-500 text-sm">Welcome back,</p>
              <p style={{
                background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {user.name}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Logout"
            >
              <LogOut size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading profile...</p>
            </div>
          ) : (
            <>
              {/* Student Profile */}
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="text-[#8E2DE2]" size={32} />
                  <h2 style={{
                    background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Student Profile
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-500 text-sm">Name</p>
                    <p className="text-gray-800">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Roll Number</p>
                    <p className="text-gray-800">{user.rollNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Department</p>
                    <p className="text-gray-800">{user.department}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Year of Study</p>
                    <p className="text-gray-800">Year {user.year}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Current Semester</p>
                    <p className="text-gray-800">Semester {user.semester}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Phone Number</p>
                    <p className="text-gray-800">{user.phone}</p>
                  </div>
                </div>
              </div>

              {/* Scholarship Status */}
              {scholarship ? (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="mb-6" style={{
                    background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Scholarship Progress
                  </h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-[#EEF4FC] to-white p-4 rounded-lg">
                        <p className="text-gray-500 text-sm mb-1">Amount Required</p>
                        <p className="text-2xl flex items-center gap-1" style={{
                          background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}>
                          <IndianRupee size={20} />
                          {scholarship.amountRequired.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg">
                        <p className="text-gray-500 text-sm mb-1">Amount Received</p>
                        <p className="text-2xl flex items-center gap-1 text-green-600">
                          <IndianRupee size={20} />
                          {scholarship.totalReceived.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-lg">
                        <p className="text-gray-500 text-sm mb-1">Remaining</p>
                        <p className="text-2xl flex items-center gap-1 text-orange-600">
                          <IndianRupee size={20} />
                          {(scholarship.amountRequired - scholarship.totalReceived).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-700">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(progress, 100)}%`,
                            background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)'
                          }}
                        />
                      </div>
                    </div>

                    {scholarship.totalCGPA && (
                      <div className="bg-gradient-to-br from-[#EEF4FC] to-white p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Your CGPA</span>
                          <span className="text-2xl" style={{
                            background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}>
                            {scholarship.totalCGPA}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                  <GraduationCap className="mx-auto mb-4 text-[#8E2DE2]" size={48} />
                  <h3 className="mb-2" style={{
                    background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Apply for Scholarship
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You haven't applied for a scholarship yet. Submit your application to connect with alumni who can support your education.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-8 py-3 rounded-lg text-white transition-all hover:shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)'
                    }}
                  >
                    Get Contribution
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
