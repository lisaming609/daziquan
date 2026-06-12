import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createWechatPayOrder, verifyWechatPayNotify } from './wechatPay.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8787);
const orders = new Map();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || true }));
app.use(express.json({ type: ['application/json', '*/json'] }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/payments/orders/:orderId/pay', async (req, res) => {
  const order = orders.get(req.params.orderId) || {
    id: req.params.orderId,
    status: 'pending',
    amount: req.body.amount || 0,
    activityId: req.body.activityId || ''
  };
  orders.set(order.id, order);

  const result = await createWechatPayOrder(order);
  res.status(result.success ? 200 : 503).json(result);
});

app.post('/api/payment/wechat/notify', async (req, res) => {
  try {
    const notify = await verifyWechatPayNotify(req.headers, req.body);
    const order = orders.get(notify.orderId) || { id: notify.orderId };

    if (order.status !== 'paid' && notify.tradeState === 'SUCCESS') {
      order.status = 'paid';
      order.transactionId = notify.transactionId;
      order.paidAt = new Date().toISOString();
      orders.set(order.id, order);
    }

    res.json({ code: 'SUCCESS', message: '成功' });
  } catch (error) {
    res.status(400).json({ code: 'FAIL', message: error.message });
  }
});

app.post('/api/payments/orders/:orderId/mock-paid', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(403).json({ success: false, message: 'Mock payment is disabled in production.' });
    return;
  }

  const order = orders.get(req.params.orderId) || { id: req.params.orderId };
  order.status = 'paid';
  order.paidAt = new Date().toISOString();
  orders.set(order.id, order);
  res.json({ success: true, order });
});

app.listen(port, () => {
  console.log(`Payment API listening on http://127.0.0.1:${port}`);
});
