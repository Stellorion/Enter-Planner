import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import ToastNotification from '@/src/components/ui/ToastNotification';
import LoginHeader from '@/src/containers/Login/components/LoginHeader';
import LoginForm from '@/src/containers/Login/components/LoginForm';
import SocialLoginSection from '@/src/components/SocialLoginButtons';

const LoginPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-200 dark:bg-gray-950">
      <div className="flex grow items-center justify-center">
        <ToastNotification />
        <div className="flex w-[90vw] flex-col rounded-xl bg-white p-8 text-gray-900 shadow-[0_10px_40px_rgba(15,23,42,0.15),0_2px_10px_rgba(37,99,235,0.08)] transition-shadow duration-300 md:w-[50vw] lg:h-[75vh] lg:w-[30vw] dark:bg-gray-900 dark:text-gray-100 dark:shadow-[0_10px_40px_rgba(0,0,0,0.4),0_0_30px_rgba(59,130,246,0.08)]">
          <div className="flex w-full flex-col items-center justify-center">
            <LoginHeader />
            <LoginForm />
            <SocialLoginSection SocialTitleText="Or log in with" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
