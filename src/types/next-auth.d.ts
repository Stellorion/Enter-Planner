import NextAuth from 'next-auth';

interface UserBase {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userRole: string;
  accessToken?: string;
  provider?: string;
}

declare module 'next-auth' {
  interface User extends UserBase {}

  interface Session {
    user: UserBase;
    accessToken?: string;
    provider?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends UserBase {
    accessToken?: string;
    provider?: string;
  }
}
