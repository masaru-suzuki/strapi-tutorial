import { getStrapiURL } from '@/lib/utils';

// strapiのユーザー登録APIのリクエストボディの型
// https://docs.strapi.io/dev-docs/plugins/graphql#usage-with-the-users--permissions-plugin
interface RegisterUserProps {
  username: string;
  password: string;
  email: string;
}

interface LoginUserProps {
  identifier: string;
  password: string;
}

const baseUrl = getStrapiURL();

/**
 *
 * @param userData
 * @returns
 */
export async function registerUserService(userData: RegisterUserProps) {
  const url = new URL('/api/auth/local/register', baseUrl);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...userData }),
      cache: 'no-cache',
    });

    return response.json();
  } catch (error) {
    console.error('Registration Service Error:', error);
  }
}

export async function loginUserService(userData: LoginUserProps) {
  const url = new URL('/api/auth/local', baseUrl);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...userData }),
      cache: 'no-cache',
    });

    return response.json();
  } catch (error) {
    console.error('Login Service Error:', error);
    throw error;
  }
}
