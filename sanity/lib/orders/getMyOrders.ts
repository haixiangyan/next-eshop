import {defineQuery} from "next-sanity";
import {sanityFetch} from "@/sanity/lib/live";

export async function getMyOrders(userId: string) {
  if (!userId) {
    throw new Error('User ID is required.');
  }

  // products[]: Expand the array
  // -> reference
  const MY_ORDERS_QUERY = defineQuery(`
    *[_type=='order' && clerkUserId == $userId] | order(orderDate desc) {
      ...,
      products[] {
        ...,
        product ->
      }
    }
  `);

  try {
    const orders = await sanityFetch({
      query: MY_ORDERS_QUERY,
      params: { userId }
    })

    return orders.data || [];
  } catch (e) {
    console.error('Error fetching my orders by ID:', e);
    return [];
  }
}
