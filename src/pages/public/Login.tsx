import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { useStore } from '../../store/useStore';

export function Login() {
  const [selectedRole, setSelectedRole] = useState<'customer' | 'worker' | 'cooperative'>('customer');
  const navigate = useNavigate();
  const { login } = useStore();

  const handleLogin = (email: string) => {
    login(email);
    if (selectedRole === 'customer') navigate('/dashboard/customer');
    if (selectedRole === 'worker') navigate('/dashboard/worker');
    if (selectedRole === 'cooperative') navigate('/dashboard/cooperative');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Shramsetu</CardTitle>
          <CardDescription>Select your role to access the demo accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex bg-slate-100 p-1 rounded-md">
            {(['customer', 'worker', 'cooperative'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`flex-1 py-2 text-sm font-medium rounded capitalize transition-colors ${
                  selectedRole === role ? 'bg-white shadow-sm text-blue-900' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {selectedRole === 'customer' && (
              <Button className="w-full" onClick={() => handleLogin('customer@test.com')}>
                Login as Priya (Customer)
              </Button>
            )}
            
            {selectedRole === 'worker' && (
              <>
                <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => handleLogin('rajesh@test.com')}>
                  Login as Rajesh (Plumber)
                </Button>
                <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => handleLogin('sunita@test.com')}>
                  Login as Sunita (Caregiver)
                </Button>
              </>
            )}

            {selectedRole === 'cooperative' && (
              <Button className="w-full bg-slate-800 hover:bg-slate-900" onClick={() => handleLogin('admin@coop.com')}>
                Login as Cooperative Admin
              </Button>
            )}
          </div>
          
          <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100">
            This is a demonstration environment. No passwords required.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
