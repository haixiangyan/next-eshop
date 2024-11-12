import {stripe} from '@/lib/stripe'
import { backendClient } from "@/sanity/lib/backendClient";
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {Metadata} from "@/actions/createCheckoutSession";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  // 没有 Stripe 的签名字段，不是从 Stripe 跳转过来
  if (!sig) {
    return NextResponse.json({
      error: 'No signature',
    }, {
      status: 400
    })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // 无密钥
  if (!webhookSecret) {
    console.log('Stripe webhook secret is not set.')
    return NextResponse.json({
      error: 'Stripe webhook secret is not set.',
    }, {
      status: 400
    })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (e) {
    return NextResponse.json({
      error: `Webhook Error ${e}`
    }, {
      status: 400
    })
  }

  // 支付成功
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const order = await createOrderInSantity(session);
      console.log('Order created in Sanity:', order)
    } catch (e) {
      console.error('Error creating order in Sanity: ', e);
      return NextResponse.json({
        error: 'Error creating order'
      }, {
        status: 500
      })
    }
  }

  return NextResponse.json({ received: true })
}

async function createOrderInSantity(session: Stripe.Checkout.Session) {
  const {
    id,
    amount_total,
    currency,
    metadata, // 自定义数据
    payment_intent,
    customer,
    total_details,
  } = session;

  // 取回客户端下单的数据
  const { orderNumber, customerName, customerEmail, clerkUserId } = metadata as Metadata;

  // 取商品
  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
    {
      expand: ['data.price.product']
    }
  )

  // 生成订阅关联的商品和数量信息
  const sanityProducts = lineItemsWithProduct.data.map(item => ({
    _key: crypto.randomUUID(),
    product: {
      _type: 'reference',
      _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
    },
    quantity: item.quantity || 0,
  }))

  // 创建订单，准备插入到 DB
  const order = await backendClient.create({
    _type: 'order',
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    customerName: customerName,
    stripeCustomerId: customer,
    clerkUserId: clerkUserId,
    email: customerEmail,
    currency,
    amountDiscount: total_details?.amount_discount
      ? total_details.amount_discount / 100
      : 0,
    products: sanityProducts,
    totalPrice: amount_total ? amount_total / 100 :0,
    status: 'paid',
    orderDate: new Date().toISOString(),
  })

  return order;
}
