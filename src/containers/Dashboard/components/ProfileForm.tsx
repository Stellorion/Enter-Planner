'use client';

import { useState } from 'react';
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

  // Profile form
  const profileForm = useForm<ProfileInputs>();
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = profileForm;

  // Password form
  const passwordForm = useForm<PasswordInputs>();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, watch: watchPassword, reset: resetPassword } = passwordForm;

  const onProfileSubmit: SubmitHandler<ProfileInputs> = async (data) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setIsLoading(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to update profile');
    }
  };

  const onPasswordSubmit: SubmitHandler<PasswordInputs> = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
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

      if (!response.ok) {
        throw new Error('Failed to update password');
      }

      setIsLoading(false);
      toast.success('Password updated successfully');
      resetPassword();
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to update password');
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