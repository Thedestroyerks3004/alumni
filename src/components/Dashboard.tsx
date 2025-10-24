import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Users, GraduationCap, IndianRupee } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface DashboardProps {
  onLoginClick: () => void;
}

export function Dashboard({ onLoginClick }: DashboardProps) {
  const [stats, setStats] = useState({
    activeAlumni: 0,
    studentsWithScholarship: 0,
    totalContributions: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-adaf32ad/stats`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.log('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF4FC] to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-12">
          <div></div>
          <button
            onClick={onLoginClick}
            className="px-6 py-2 rounded-lg text-white"
            style={{
              background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)'
            }}
          >
            Login
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="mb-4" style={{
              background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Alumni-Student Scholarship Portal
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connecting alumni and students to foster educational opportunities. 
              Our platform enables alumni to support students through scholarships, 
              building a stronger community and empowering the next generation of leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 mb-2">Active Alumni</p>
                  <p className="text-3xl" style={{
                    background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {stats.activeAlumni}
                  </p>
                </div>
                <div className="p-3 rounded-full" style={{
                  background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)'
                }}>
                  <Users className="text-white" size={24} />
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                Alumni actively participating in the program
              </p>
            </Card>

            <Card className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 mb-2">Scholarship Recipients</p>
                  <p className="text-3xl" style={{
                    background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {stats.studentsWithScholarship}
                  </p>
                </div>
                <div className="p-3 rounded-full" style={{
                  background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)'
                }}>
                  <GraduationCap className="text-white" size={24} />
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                Students receiving scholarship support
              </p>
            </Card>

            <Card className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 mb-2">Total Contributions</p>
                  <p className="text-3xl flex items-center gap-1" style={{
                    background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    <IndianRupee size={28} />
                    {stats.totalContributions.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-3 rounded-full" style={{
                  background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)'
                }}>
                  <IndianRupee className="text-white" size={24} />
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                Total amount contributed by alumni
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
