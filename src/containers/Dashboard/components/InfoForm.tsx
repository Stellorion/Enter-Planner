'use client';

import FormInput from '@/src/components/ui/inputs/AuthInput';

interface InfoFormProps {
  register: any;
  errors: any;
  isLoading: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function InfoForm({ register, errors, isLoading, onSubmit }: InfoFormProps) {
  const validateName = (value: string) => {
    if (!value || value.trim() === '') return true;
    return value.trim().length >= 2 || 'Must be at least 2 characters';
  };

  const validateEmail = (value: string) => {
    if (!value || value.trim() === '') return true;
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) || 'Invalid email address';
  };

  return (
    <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 shadow-xl p-6">
      <h2 className="mb-4 text-xl font-semibold">Personal Information</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(event);
        }}
        className="flex w-full flex-col justify-center space-y-4"
      >
        <div className="mb-4 flex space-x-2">
          <FormInput
            type="text"
            placeholder="First Name"
            register={register('firstName', {
              validate: validateName,
            })}
            error={errors.firstName?.message}
            className="w-1/2"
          />
          <FormInput
            type="text"
            placeholder="Last Name"
            register={register('lastName', {
              validate: validateName,
            })}
            error={errors.lastName?.message}
            className="w-1/2"
          />
        </div>

        <FormInput
          type="email"
          placeholder="Email"
          register={register('email', {
            validate: validateEmail,
          })}
          error={errors.email?.message}
        />

        <button
          className="w-full rounded-sm bg-blue-600 py-2 text-gray-200 transition hover:bg-blue-700 dark:hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
