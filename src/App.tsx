import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { AccountTypeDialog } from './components/AccountTypeDialog';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { AlumniDashboard } from './components/AlumniDashboard';
import { StudentDashboard } from './components/StudentDashboard';

type View = 'dashboard' | 'login' | 'signup' | 'alumni-dashboard' | 'student-dashboard';

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>('');

  useEffect(() => {
    // Check for stored session
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAccessToken(storedToken);
        setUser(parsedUser);
        setView(parsedUser.userType === 'alumni' ? 'alumni-dashboard' : 'student-dashboard');
      } catch (error) {
        console.log('Error parsing stored user:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginClick = () => {
    setShowAccountDialog(true);
  };

  const handleAccountDialogClose = () => {
    setShowAccountDialog(false);
  };

  const handleGoToLogin = () => {
    setShowAccountDialog(false);
    setView('login');
  };

  const handleGoToSignup = () => {
    setShowAccountDialog(false);
    setView('signup');
  };

  const handleLoginSuccess = (token: string, userData: any) => {
    setAccessToken(token);
    setUser(userData);
    setView(userData.userType === 'alumni' ? 'alumni-dashboard' : 'student-dashboard');
  };

  const handleSignupSuccess = () => {
    setView('login');
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setAccessToken('');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setView('dashboard');
  };

  if (view === 'login') {
    return (
      <Login
        onBack={handleBackToDashboard}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (view === 'signup') {
    return (
      <Signup
        onBack={handleBackToDashboard}
        onSignupSuccess={handleSignupSuccess}
      />
    );
  }

  if (view === 'alumni-dashboard' && user) {
    return (
      <AlumniDashboard
        user={user}
        accessToken={accessToken}
        onLogout={handleLogout}
      />
    );
  }

  if (view === 'student-dashboard' && user) {
    return (
      <StudentDashboard
        user={user}
        accessToken={accessToken}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <>
      <Dashboard onLoginClick={handleLoginClick} />
      <AccountTypeDialog
        open={showAccountDialog}
        onClose={handleAccountDialogClose}
        onLogin={handleGoToLogin}
        onSignup={handleGoToSignup}
      />
    </>
  );
}
