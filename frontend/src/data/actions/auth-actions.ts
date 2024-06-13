'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  loginUserService,
  registerUserService,
} from '../services/auth-service';

const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: '/',
  domain: process.env.HOST ?? 'localhost',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
};

const schemaRegister = z.object({
  username: z
    .string()
    .min(3, {
      message: 'ユーザー名は3文字以上で入力してください',
    })
    .max(20, {
      message: 'ユーザー名は3文字以上20文字以下で入力してください',
    }),
  password: z
    .string()
    .min(6, {
      message: 'パスワードは6文字以上で入力してください',
    })
    .max(100, {
      message: 'パスワードは6文字以上100文字以内',
    }),
  email: z.string().email({
    message: '有効なEメールアドレスを入力してください',
  }),
});

// MEMO: prevStateの定義が必要
export async function registerUserAction(prevState: any, formData: FormData) {
  const validatedFields = schemaRegister.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    console.log('###################################################');
    console.log(
      'Validation Error: ',
      validatedFields.error.flatten().fieldErrors
    );
    console.log('###################################################');

    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      message: '入力エラーがあります。修正してください。',
    };
  }

  const responseData = await registerUserService(validatedFields.data);

  if (!responseData) {
    console.log('###################################################');
    console.log('Registration Service Error: レスポンスがありません。');
    console.log('###################################################');

    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      message: 'レスポンスがありません。',
    };
  }

  if (responseData.error) {
    console.log('###################################################');
    console.log('Strapiエラーが発生しました。', responseData.error);
    console.log('###################################################');
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: 'Strapiエラーが発生しました。',
    };
  }

  cookies().set('jwt', responseData.jwt, config);
  redirect('/dashboard');
}

const schemaLogin = z.object({
  identifier: z
    .string()
    .min(3, {
      message: 'Identifier must have at least 3 or more characters',
    })
    .max(20, {
      message: 'Please enter a valid username or email address',
    }),
  password: z
    .string()
    .min(6, {
      message: 'Password must have at least 6 or more characters',
    })
    .max(100, {
      message: 'Password must be between 6 and 100 characters',
    }),
});

export async function loginUserAction(prevState: any, formData: FormData) {
  const validatedFields = schemaLogin.safeParse({
    identifier: formData.get('identifier'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Login.',
    };
  }

  const responseData = await loginUserService(validatedFields.data);

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: 'Ops! Something went wrong. Please try again.',
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: 'Failed to Login.',
    };
  }

  cookies().set('jwt', responseData.jwt, config);

  redirect('/dashboard');
}

export async function logoutAction() {
  cookies().set('jwt', '', { ...config, maxAge: 0 });
  redirect('/');
}
