'use client';

import { FaGithub, FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import SocialButton from './ui/inputs/SocialButton';

interface SocialLoginButtonsProps {
  SocialTitleText?: string;
}

const SocialLoginButtons = ({
  SocialTitleText = 'Or log in with',
}: SocialLoginButtonsProps) => {
  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    const result = await signIn(provider, {
      callbackUrl: '/calendar',
      redirect: true,
    });

    if (result?.error) {
      toast.error(
        'Social login is not configured yet. Add your Google/GitHub OAuth credentials first.'
      );
      return;
    }

    if (result?.url) {
      window.location.href = result.url;
    }
  };

  return (
    <div className="mt-4 w-full">
      <div className="mb-4 flex w-full items-center">
        <div className="grow border-t border-gray-400"></div>
        <span className="whitespace-nowrap px-3 text-gray-600 dark:text-gray-400">
          {SocialTitleText}
        </span>
        <div className="grow border-t border-gray-400"></div>
      </div>

      <div className="flex w-full flex-wrap justify-center gap-2 sm:flex-nowrap">
        <SocialButton
          icon={FaGoogle}
          label="Google"
          onClick={() => handleSocialSignIn('google')}
        />
        <SocialButton
          icon={FaGithub}
          label="GitHub"
          onClick={() => handleSocialSignIn('github')}
        />
      </div>
    </div>
  );
};

export default SocialLoginButtons;
