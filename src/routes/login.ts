import { Hono, type Handler } from 'hono';
import supabase from '../supabase';
import { responseSupabaseData } from '../utils';

const TABLE_PRODUCTS = 'products';
const TABLE_ORDERS = 'orders';

// 注册
export const signUp: Handler = async (c) => {
  const { email, password, options } = await c.req.json<Sign & { options: any }>();
  const res = await supabase.auth.signUp({
    email,
    password,
    options,
  });
  return responseSupabaseData(c, res);
};

// 登录
export const signIn: Handler = async (c) => {
  const { email, password } = await c.req.json<Sign>();
  const res = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return responseSupabaseData(c, res);
};

// 退出
export const logout: Handler = async (c) => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

// 获取用户信息
export const getCurrentUser: Handler = async (c) => {
  const { data: session } = await supabase.auth.getSession();
  console.log('getCurrentUser session', session);

  const res1 = await supabase.auth.getUser();
  const { data, error } = res1;
  console.log('getCurrentUser userinfo', data?.user, res1);

  if (!session.session && !data?.user) return null;

  supabase.auth.onAuthStateChange(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log('onAuthStateChange userinfo', user);
  });

  if (error) throw new Error(error.message);
  return data?.user;
};

const loginRoute = new Hono();

loginRoute.post('/signup', signUp);
loginRoute.post('/login', signIn);
loginRoute.post('/logout', logout);

export interface Sign {
  email: string;
  password: string;
}
