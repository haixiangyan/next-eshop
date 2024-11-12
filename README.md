# next-eshop

学习参考：https://www.youtube.com/watch?v=o-fgWea75O4

## 如何使用

本地开发：

```shell
npm install --legacy-peer-deps

npm run dev
```

正式编译：

```shell
npm install --legacy-peer-deps

npm run build

npm run start
```

自动生成数据库 TS 类型：

```shell
npm run typegen
```

## .env 配置

```shell
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_PROJECT_ID="grfx3p9n"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"


SANITY_STUDIO_PROJECT_ID="xxx"
SANITY_STUDIO_DATASET="production"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

SANITY_API_TOKEN=sk4ArtfTxxx
SANITY_API_READ_TOKEN=skjRL0xxx

STRIPE_SECRET_KEY=sk_test_xxx

STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## 支付测试卡

https://docs.stripe.com/testing
