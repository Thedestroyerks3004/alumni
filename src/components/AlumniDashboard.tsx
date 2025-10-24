import { useEffect, useState } from 'react';
import { LogOut, IndianRupee } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { ContributeDialog } from './ContributeDialog';
import { StudentDetailsDialog } from './StudentDetailsDialog';

interface AlumniDashboardProps {
  user: any;
  accessToken: string;
  onLogout: () => void;
}

export function AlumniDashboard({ user, accessToken, onLogout }: AlumniDashboardProps) {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showContributeDialog, setShowContributeDialog] = useState(false);
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-adaf32ad/scholarships`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setScholarships(data.scholarships);
      }
    } catch (error) {
      console.log('Error fetching scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContribute = (scholarship: any) => {
    setSelectedScholarship(scholarship);
    setShowContributeDialog(true);
  };

  const handleViewStudent = async (studentId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-adaf32ad/scholarship/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedStudent(data);
        setShowStudentDialog(true);
      }
    } catch (error) {
      console.log('Error fetching student details:', error);
    }
  };

  const handleContributionSuccess = () => {
    setShowContributeDialog(false);
    fetchScholarships();
  };

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

        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 style={{
              background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Students Seeking Scholarships
            </h2>
            <p className="text-gray-600">Support students by contributing to their education</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading scholarships...</p>
            </div>
          ) : scholarships.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow">
              <p className="text-gray-500">No scholarship requests at the moment</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b" style={{ background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)' }}>
                    <tr>
                      <th className="px-6 py-4 text-left text-white">Student Name</th>
                      <th className="px-6 py-4 text-left text-white">Department</th>
                      <th className="px-6 py-4 text-left text-white">Year</th>
                      <th className="px-6 py-4 text-left text-white">Amount Required</th>
                      <th className="px-6 py-4 text-left text-white">Progress</th>
                      <th className="px-6 py-4 text-left text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scholarships.map((scholarship, index) => {
                      const progress = (scholarship.totalReceived / scholarship.amountRequired) * 100;
                      return (
                        <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleViewStudent(scholarship.studentId)}
                              className="text-[#8E2DE2] hover:underline"
                            >
                              {scholarship.studentName}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{scholarship.studentDepartment}</td>
                          <td className="px-6 py-4 text-gray-600">Year {scholarship.studentYear}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-gray-700">
                              <IndianRupee size={16} />
                              <span>{scholarship.totalReceived.toLocaleString('en-IN')}</span>
                              <span className="text-gray-400">/</span>
                              <span>{scholarship.amountRequired.toLocaleString('en-IN')}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{
                                    width: `${Math.min(progress, 100)}%`,
                                    background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)'
                                  }}
                                />
                              </div>
                              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleContribute(scholarship)}
                              className="px-4 py-2 rounded-lg text-white text-sm transition-all hover:shadow-lg"
                              style={{
                                background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)'
                              }}
                            >
                              Contribute
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {showContributeDialog && selectedScholarship && (
        <ContributeDialog
          open={showContributeDialog}
          onClose={() => setShowContributeDialog(false)}
          scholarship={selectedScholarship}
          accessToken={accessToken}
          onSuccess={handleContributionSuccess}
        />
      )}

      {showStudentDialog && selectedStudent && (
        <StudentDetailsDialog
          open={showStudentDialog}
          onClose={() => setShowStudentDialog(false)}
          student={selectedStudent.student}
          scholarship={selectedStudent.scholarship}
        />
      )}
    </div>
  );
}
