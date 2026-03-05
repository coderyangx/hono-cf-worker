import { Hono } from 'hono';
import { renderer } from './renderer';

const app = new Hono();

app.use(renderer);

app.get('/', (c) => {
  return c.render(<h2>Hello HTML</h2>);
});

app.get('/api', (c) => {
  return c.json({ message: 'Hello Api!' });
});

export default app;
