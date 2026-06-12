# 真实支付上线方案

## 结论

GitHub Pages 只能托管静态网页，不能直接实现真实支付闭环。真实支付必须有后端服务负责：

- 创建支付订单
- 保存订单状态
- 调用微信支付 / 支付宝 / Stripe 等支付网关
- 接收支付回调
- 校验签名
- 幂等更新订单
- 通知前端支付结果

## 推荐架构

```text
uni-app H5 / 小程序 / App
        |
        | HTTPS API
        v
业务后端 Node.js / Java / Go
        |
        | 商户证书 / API Key / Webhook Secret
        v
微信支付 / 支付宝 / Stripe
        |
        | 支付回调 notify/webhook
        v
业务后端更新订单、活动报名、群聊权限
```

## 前端接口

当前前端通过统一支付适配层调用支付能力。上线时应将 mock 支付关闭：

```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=https://api.your-domain.com/api
VITE_USE_UNICLOUD=false
```

## 后端接口契约

### payOrder

创建支付单并返回平台支付参数。

```json
{
  "orderId": "ORDER_123"
}
```

返回示例：

```json
{
  "success": true,
  "paymentArgs": {
    "timeStamp": "1710000000",
    "nonceStr": "nonce",
    "package": "prepay_id=xxx",
    "signType": "RSA",
    "paySign": "xxx"
  }
}
```

### paymentNotify

支付平台服务端回调。后端必须验证签名，并做幂等处理：

1. 查询订单是否存在。
2. 若已支付，直接返回成功。
3. 更新订单为已支付。
4. 更新活动报名人数。
5. 更新用户参与次数。
6. 创建或加入活动群聊。

## 平台建议

- 微信小程序：微信支付 JSAPI / 小程序支付。
- H5 微信内：微信 JSAPI 支付，需要公众号或服务号授权。
- 普通 H5 浏览器：微信 H5 支付或支付宝 H5 支付。
- App：微信 App 支付 / 支付宝 App 支付。

## 上线前必备

- 营业执照和主体认证
- 微信支付或支付宝商户号
- HTTPS 后端域名
- 支付回调公网地址
- 数据库订单表
- 支付密钥和证书安全存储
- 退款、取消、超时关闭订单逻辑
