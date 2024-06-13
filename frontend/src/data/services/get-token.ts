import { cookies } from 'next/headers';

// tokenはjwt以外の場合もあるので、getAuthTokenという名前に変更
export async function getAuthToken() {
  const authToken = cookies().get('jwt')?.value;
  return authToken;
}
