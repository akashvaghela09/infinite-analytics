import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { register, reset } from '../../redux/auth/authSlice';
import { appToast } from '../../redux/app/appSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { name, email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      dispatch(appToast.error(message));
    }

    if (isSuccess || user) {
      navigate('/dashboard');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return dispatch(appToast.error('Please fill in all fields'));
    }

    if (password.length < 8) {
      return dispatch(appToast.error('Password must be at least 8 characters long'));
    }

    const userData = { name, email, password };
    dispatch(register(userData));
  };

  const handleGoogleRegister = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    window.location.href = `${baseUrl}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg-primary) p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-(--accent-500)/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-(--success)/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      
      <Card className="w-full max-w-md p-8 relative z-10" variant="elevated">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-(--accent-500) to-(--accent-700) mb-4 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <Sparkles className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-(--text-primary) tracking-tight">
            Create Account
          </h1>
          <p className="text-(--text-secondary) mt-1">Start your analytics journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            name="name"
            type="text"
            label="Full Name"
            value={name}
            onChange={handleChange}
            placeholder="Enter your full name"
            icon={User}
            required
          />
          <Input
            name="email"
            type="email"
            label="Email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email"
            icon={Mail}
            required
          />
          <Input
            name="password"
            type="password"
            label="Password"
            value={password}
            onChange={handleChange}
            placeholder="Create a password (min 8 characters)"
            icon={Lock}
            required
          />

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            loading={isLoading}
            rightIcon={ArrowRight}
          >
            Create Account
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-(--border-subtle)" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-(--bg-tertiary) text-(--text-muted)">
              or continue with
            </span>
          </div>
        </div>

        <Button 
          variant="secondary" 
          fullWidth 
          onClick={handleGoogleRegister}
        >
          <div className="flex items-center justify-center gap-2">
            <GoogleIcon className="w-5 h-5" />
            <span>Google</span>
          </div>
        </Button>

        <div className="mt-6 text-center text-sm text-(--text-secondary)">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-(--accent-400) hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
