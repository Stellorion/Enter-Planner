'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { InfoForm } from './InfoForm';
import { PasswordForm } from './PasswordForm';
import { ProfileInputs } from '@/src/types/Inputs';

interface PasswordInputs {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  // Profile form
  const profileForm = useForm<ProfileInputs>();
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = profileForm;

  // Password form
  const passwordForm = useForm<PasswordInputs>();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = passwordForm;

  const refreshAccountSession = async () => {
    try {
      await update();
      router.refresh();
    } catch (error) {
      console.error('Failed to refresh session:', error);
    }
  };

  const onProfileSubmit: SubmitHandler<ProfileInputs> = async (data) => {
    const payload: Record<string, string> = {};

    if (data.firstName?.trim()) payload.firstName = data.firstName.trim();
    if (data.lastName?.trim()) payload.lastName = data.lastName.trim();
    if (data.email?.trim()) payload.email = data.email.trim();

    if (Object.keys(payload).length === 0) {
      toast.error('Please enter at least one field to update');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      await refreshAccountSession();
      setIsLoading(false);
      toast.success(result.message || 'Profile updated successfully');
    } catch (error) {
      setIsLoading(false);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  const onPasswordSubmit: SubmitHandler<PasswordInputs> = async (data) => {
    if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (data.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update password');
      }

      await refreshAccountSession();
      setIsLoading(false);
      toast.success(result.message || 'Password updated successfully');
      resetPassword();
    } catch (error) {
      setIsLoading(false);
      toast.error(error instanceof Error ? error.message : 'Failed to update password');
    }
  };

  return (
    <div className="grid gap-8">
      {/* Personal Information Form */}
      <InfoForm
        register={registerProfile}
        errors={profileErrors}
        isLoading={isLoading}
        onSubmit={handleProfileSubmit(onProfileSubmit)}
      />

      {/* Change Password Form */}
      <PasswordForm
        register={registerPassword}
        errors={passwordErrors}
        isLoading={isLoading}
        onSubmit={handlePasswordSubmit(onPasswordSubmit)}
      />
    </div>
  );
}