export async function createWechatPayOrder(order) {
  if (!process.env.WECHAT_PAY_APP_ID || !process.env.WECHAT_PAY_MCH_ID) {
    return {
      success: false,
      code: 'WECHAT_PAY_NOT_CONFIGURED',
      message: 'WeChat Pay merchant credentials are not configured.'
    };
  }

  // TODO: call WeChat Pay v3 JSAPI/H5/App order API here.
  return {
    success: true,
    paymentArgs: {
      timeStamp: String(Math.floor(Date.now() / 1000)),
      nonceStr: `nonce_${order.id}`,
      package: 'prepay_id=replace-with-real-prepay-id',
      signType: 'RSA',
      paySign: 'replace-with-real-signature'
    }
  };
}

export async function verifyWechatPayNotify(_headers, _body) {
  // TODO: verify WeChat Pay signature and decrypt resource in production.
  if (process.env.NODE_ENV === 'production') {
    throw new Error('WeChat Pay notification verification is not implemented.');
  }

  return {
    orderId: 'ORDER_PREVIEW_001',
    transactionId: `WX_${Date.now()}`,
    tradeState: 'SUCCESS'
  };
}
