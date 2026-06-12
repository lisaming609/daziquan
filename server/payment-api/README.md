# Payment API Skeleton

这个目录是正式支付上线时的最小后端骨架。GitHub Pages 只能托管静态页面，真实支付必须部署在独立 HTTPS 后端服务上。

## 本地运行

```bash
npm install
npm run dev
```

## 接口

- `POST /api/payments/orders/:orderId/pay`：创建支付单，返回平台支付参数。
- `POST /api/payment/wechat/notify`：微信支付回调入口，生产环境必须验签并做幂等更新。
- `POST /api/payments/orders/:orderId/mock-paid`：仅开发环境可用，用于前端联调。

## 上线提醒

生产环境必须接入数据库、商户证书、签名验签、订单幂等、退款和超时关闭逻辑。
