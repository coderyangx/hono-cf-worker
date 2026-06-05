import type { Context } from 'hono';

export const responseSupabaseData = (c: Context, res: any) => {
  const { data, error } = res;
  console.log('sss', data, error);
  if (error) return c.json(responseError(500, error.details || 'supabase 数据查询失败'));
  return c.json(data);
};

// export const responseError = (c: Context, err: Error, title?: string) => {
//   return c.json(
//     {
//       error: title || '接口调用失败',
//       // @ts-ignore
//       message: err?.message || '',
//     },
//     500, // 前端收到的 http 状态码
//   );
// };

export function responseError(code: number, message: string) {
  return {
    code,
    message,
    data: null,
  };
}
