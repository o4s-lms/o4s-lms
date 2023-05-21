/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { signIn, useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { type FieldValues, type SubmitHandler, useForm } from 'react-hook-form';

import Input from "~/app/components/inputs/Input";
import Button from "~/app/components/shared/Button";
import { toast } from "react-hot-toast";
import LoadingModal from '~/app/components/modals/LoadingModal';

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
	const session = useSession();
  const router = useRouter();
	const emailParam = useSearchParams();
	const [email, setEmail] = useState(emailParam.get('email') || '');
	const [sessionStatus, setSessionStatus] = useState(false);
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
	const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
	

	useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/lms')
    }
		if (session?.status === 'loading') {
			setSessionStatus(false);
		}
		setSessionStatus(true);
  }, [session?.status, router, setSessionStatus]);

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      email: email
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

		signIn('email', {
			email: data.email,
			redirect: false
		})
		.then((callback) => {
			if (callback?.error) {
				toast.error('Something is wrong!');
			}

			if (callback?.ok) {
				setIsMagicLinkSent(true);
			}

		})
		.finally(() => setIsLoading(false))
   
  }

	if (!sessionStatus) {
		return <LoadingModal />;
	}

  return (
		<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
			{!isMagicLinkSent && (
      <div 
        className="
        bg-white
          px-4
          py-8
          shadow
          sm:rounded-lg
          sm:px-10
        "
      >
				
        <form 
          className="space-y-6" 
          onSubmit={handleSubmit(onSubmit)}
        >
					
          <Input 
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            id="email" 
            label="Email address" 
            type="email"
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>
				
					<div 
						className="
							flex 
							gap-2 
							justify-center 
							text-sm 
							mt-6 
							px-2 
							text-gray-500
						"
					>
						<div>
							{variant === 'LOGIN' ? 'New to LMS?' : 'Already have an account?'} 
						</div>
						<div 
							onClick={toggleVariant} 
							className="underline cursor-pointer"
						>
							{variant === 'LOGIN' ? 'Create an account' : 'Login'}
						</div>
					</div>
				
      </div>
			)}
			{isMagicLinkSent && (
					<div className="mt-3">
						<div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
							<div className="flex">
								<div className="py-1"><svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
									<div>
										<p className="font-bold">A magic link email was sent. 🪄</p>
										<p className="text-sm">Make sure to check your spam folder.</p>
									</div>
							</div>
						</div>
					</div>
			)}
    </div>
  );
}
 
export default AuthForm;