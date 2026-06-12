# 搭子圈 MateCircle 网页端上线项目

这是可以直接部署到 GitHub Pages 的网页端项目。仓库根目录的 `index.html` 是当前可分享的网页预览版，`source/matecircle-uniapp` 是正式 `uni-app + Vue3` 多端源码。

## GitHub Pages 上线

推送后：

1. 仓库会通过 GitHub Actions 部署 GitHub Pages。
2. 如首次部署未自动启用，请进入仓库 `Settings -> Pages`，Source 选择 `GitHub Actions`。
3. 等待 `Deploy static web preview to GitHub Pages` 工作流完成。
4. 访问 `https://lisaming609.github.io/daziquan/`。

## 本地预览

```bash
python -m http.server 8765
```

然后打开：

```text
http://127.0.0.1:8765/index.html
```

## 测试账号

详见 [docs/TEST_ACCOUNTS.md](docs/TEST_ACCOUNTS.md)。

## 真实支付

GitHub Pages 只能托管静态网页，不能安全承载支付密钥、商户证书、支付回调等服务端能力。真实支付上线必须接入后端服务，详见 [docs/PAYMENT_PRODUCTION.md](docs/PAYMENT_PRODUCTION.md)。

最小后端骨架已放在：

```text
server/payment-api
```
