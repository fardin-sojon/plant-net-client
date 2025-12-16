import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { TbFidgetSpinner } from 'react-icons/tb';

const ResetPassword = () => {
    const { resetPassword, loading, setLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const emailFromLogin = location.state?.email || '';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: emailFromLogin,
        },
    });

    const onSubmit = async (data) => {
        try {
            await resetPassword(data.email);
            setLoading(false);
            toast.success('Password reset email sent! Check your inbox.');
            navigate('/login');
        } catch (err) {
            // console.log(err);
            toast.error(err.message);
            setLoading(false);
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-white'>
            <div className='flex flex-col max-w-md w-full p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900'>
                <div className='mb-8 text-center'>
                    <h1 className='my-3 text-4xl font-bold'>Reset Password</h1>
                    <p className='text-sm text-gray-400'>
                        Enter your email to receive a reset link
                    </p>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='space-y-6'
                >
                    <div className='space-y-4'>
                        <div>
                            <label htmlFor='email' className='block mb-2 text-sm'>
                                Email address
                            </label>
                            <input
                                type='email'
                                id='email'
                                placeholder='Enter Your Email Here'
                                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900'
                                {...register("email", { required: true })}
                            />
                            {errors.email?.type === "required" && (
                                <p className="text-red-500">Email is required.</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type='submit'
                            className='bg-lime-500 w-full rounded-md py-3 text-white'
                        >
                            {loading ? (
                                <TbFidgetSpinner className='animate-spin m-auto' />
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
