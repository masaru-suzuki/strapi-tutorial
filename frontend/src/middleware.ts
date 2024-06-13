import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserMeLoader } from './data/servicies/get-user-me-loader';

export async function middleware(request: NextRequest) {
  const user = await getUserMeLoader();
  const currentPath = request.nextUrl.pathname;

  console.log('############  MIDDLEWARE  ##############');
  console.log(user);
  console.log(currentPath);
  console.log('############  MIDDLEWARE  ##############');

  // ユーザー情報が存在しない場合は、ユーザーをサインインページにリダイレクト
  if (currentPath.startsWith('/dashboard') && user.ok === false) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}
