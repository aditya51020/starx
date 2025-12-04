import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async data => {
    try {
      await login(data.email, data.password);
      toast.success('Logged in');
      navigate('/admin');
    } catch (e) {
      toast.error(e.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <input {...register('email')} placeholder="Email" className="input mb-4" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        <input {...register('password')} type="password" placeholder="Password" className="input mb-4" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        <button type="submit" className="btn-primary w-full">Login</button>
      </form>
    </div>
  );
}