import * as React from "react";
import dynamic from "next/dynamic";
import Header from "~/components/ui/layout/Header";

const HankoAuth = dynamic(
	() => import('~/components/auth/HankoAuth'),
	{ ssr: false },
)

export default function SignIn() {
  const [error, setError] = React.useState<Error | null>(null)
  return (
    <>
      <Header title="Sign In" />
      <main className='bg-gray-50 w-full h-screen flex flex-col items-center justify-center px-4'>
        <div className='max-w-sm w-full text-gray-600 dark:text-gray-300'>
          <div className='text-center'>
            <div className='text-red py-10'>{error?.message}</div>
            <HankoAuth setError={setError} />
          </div>
        </div>
      </main>
    </>
  );
}