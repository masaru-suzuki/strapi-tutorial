'use server';

import { z } from 'zod';

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
  console.log({ prevState });

  const validatedFields = schemaRegister.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      message: '入力内容に誤りがあります。登録に失敗しました。',
    };
  }

  return {
    ...prevState,
    data: 'ok',
  };
}
