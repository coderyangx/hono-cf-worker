import { Hono, type Handler } from 'hono';
import supabase from '../supabase';
import { responseSupabaseData } from '../utils';

const TABLE_PRODUCTS = 'products';
const TABLE_ORDERS = 'orders';

const getProducts: Handler = async (c) => {
  const res = await supabase.from(TABLE_PRODUCTS).select('*');
  console.log('获取商品列表', res);
  return responseSupabaseData(c, res);
};

// 增加
export const createProduct: Handler = async (c) => {
  const { product } = await c.req.json<CreateProductData>();
  const res = await supabase.from(TABLE_PRODUCTS).insert([product]).select().single();
  return responseSupabaseData(c, res);
};

// 删除
export const deleteProduct: Handler = async (c) => {
  const { id } = c.req.param();
  console.log('删除商品 id', id);
  if (!id) return c.json({ error: '缺少商品id' }, 400);

  const { error } = await supabase.from(TABLE_PRODUCTS).delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
};

// 修改
export const updateProduct: Handler = async (c) => {
  const { id, updateProduct } = await c.req.json();

  const res = await supabase
    .from(TABLE_PRODUCTS)
    .update(updateProduct)
    .eq('id', id)
    .select()
    .single();
  return responseSupabaseData(c, res);
};

// 对商品按价格排序 + 对商品按照价格范围筛选
export const getProductsAndFilter: Handler = async (c) => {
  const { sortby, filters } = await c.req.json<{
    sortby?: any;
    filters?: { field: string; method: string; value: string | number }[];
  }>();
  // sortby?: { field: string; ascending: boolean };
  // filters?: { field: string; method: string; value: string | number }[];

  let query = supabase.from(TABLE_PRODUCTS).select('*');
  // 排序
  if (sortby) {
    query = query.order(sortby.field, { ascending: sortby.ascending });
  }
  // 过滤
  if (filters && filters.length > 0) {
    filters.forEach((filter) => {
      query = query?.[filter.method]?.(filter.field, filter.value);
    });
  }
  const res = await query;
  return responseSupabaseData(c, res);
};

// 对订单查找关联商品表的信息（商品信息会根据对应的外键查找返回）
export const getOrders: Handler = async (c) => {
  const res = await supabase.from('orders').select('*, products(*)');
  return responseSupabaseData(c, res);
};

export const productsRouter = new Hono();

productsRouter.get('/list', getProducts);
productsRouter.post('/add', createProduct);
productsRouter.post('/delete/:id', deleteProduct);
productsRouter.post('/update', updateProduct);
productsRouter.post('/filter', getProductsAndFilter);

export interface Product {
  id: number;
  created_at: string;
  product: string;
  productName: string;
  productDesc: string;
  price: number;
}

export interface CreateProductData {
  product: string;
  productName: string;
  productDesc: string;
  price: number;
}

// 编辑
type EditProductData = Partial<Product>;
