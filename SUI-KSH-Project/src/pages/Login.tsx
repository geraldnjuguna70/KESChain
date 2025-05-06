import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCcw, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Login component for user authentication 
const Login = () => {
  const { login, register, demoLogin, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email || !password || (isRegistering && !name)) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    
    try {
      let success;
      if (isRegistering) {
        success = await register(name, email, password);
      } else {
        success = await login(email, password);
      }
      
      if (success) {
        navigate('/');
      } else {
        setErrorMessage(isRegistering ? 'Registration failed' : 'Invalid credentials');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const handleDemoAccess = async () => {
    const success = await demoLogin();
    if (success) {
      navigate('/');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center">
              <RefreshCcw className="h-7 w-7 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {isRegistering ? 'Create your account' : 'Sign in to SUI-KSH DEX'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isRegistering 
              ? 'Start trading between SUI and KSH' 
              : 'Enter your credentials to access your account'}
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow">
          {errorMessage && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errorMessage}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isRegistering && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required={isRegistering}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input mt-1"
                  placeholder="John Doe"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input mt-1"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isRegistering ? 'new-password' : 'current-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input mt-1"
                placeholder="••••••••"
              />
            </div>
            
            {!isRegistering && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary/80">
                    Forgot your password?
                  </a>
                </div>
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full py-3 text-base"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    {isRegistering ? 'Creating account...' : 'Signing in...'}
                  </>
                ) : (
                  isRegistering ? 'Create Account' : 'Sign in'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="btn btn-outline w-full"
              >
                {isRegistering ? 'Back to Login' : 'Register'}
              </button>
              <button
                onClick={handleDemoAccess}
                disabled={isLoading}
                className="btn btn-outline w-full"
              >
                Demo Access
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;