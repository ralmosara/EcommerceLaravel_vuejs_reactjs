import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema, type RegisterFormData } from '@/utils/validators';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      // Redirect to home page after successful registration
      navigate('/', { replace: true });
    } catch (error) {
      // Error handling is done in the AuthContext with toast
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-punk-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white uppercase tracking-wider">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-punk-orange hover:text-punk-coral transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-punk-gray border border-punk-black p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-punk-black bg-punk-black text-white placeholder-gray-500 focus:outline-none focus:border-punk-orange transition-colors"
                {...register('name')}
              />
              {errors.name?.message && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-punk-black bg-punk-black text-white placeholder-gray-500 focus:outline-none focus:border-punk-orange transition-colors"
                {...register('email')}
              />
              {errors.email?.message && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone (Optional)</label>
              <input
                type="tel"
                autoComplete="tel"
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 border border-punk-black bg-punk-black text-white placeholder-gray-500 focus:outline-none focus:border-punk-orange transition-colors"
                {...register('phone')}
              />
              <p className="mt-1 text-sm text-gray-500">Optional, but helpful for order updates</p>
              {errors.phone?.message && <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Create a strong password"
                className="w-full px-3 py-2 border border-punk-black bg-punk-black text-white placeholder-gray-500 focus:outline-none focus:border-punk-orange transition-colors"
                {...register('password')}
              />
              <p className="mt-1 text-sm text-gray-500">Must be at least 8 characters with uppercase, lowercase, and number</p>
              {errors.password?.message && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                className="w-full px-3 py-2 border border-punk-black bg-punk-black text-white placeholder-gray-500 focus:outline-none focus:border-punk-orange transition-colors"
                {...register('password_confirmation')}
              />
              {errors.password_confirmation?.message && <p className="mt-1 text-sm text-red-400">{errors.password_confirmation.message}</p>}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                fullWidth
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              By creating an account, you agree to our{' '}
              <Link
                to="/terms"
                className="text-punk-orange hover:text-punk-coral transition-colors"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy"
                className="text-punk-orange hover:text-punk-coral transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-punk-orange hover:text-punk-coral transition-colors"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
