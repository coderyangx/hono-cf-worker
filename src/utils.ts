import type { Context } from 'hono';

export const responseSupabaseData = (c: Context, res: any) => {
  const { data, error } = res;
  if (error) return responseError(c, error, 'supabase 数据查询失败');
  return c.json(data);
};

export const responseError = (c: Context, err: Error, title?: string) => {
  return c.json(
    {
      error: title || '接口调用失败',
      // @ts-ignore
      details: err?.message || '',
    },
    500,
  );
};
