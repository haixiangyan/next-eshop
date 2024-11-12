import {defineQuery} from "next-sanity";
import {sanityFetch} from "@/sanity/lib/live";

export const getProductBySlug = async (slug: string) => {
  const PRODUCT_BY_ID_QUERY = defineQuery(`
    * [
      _type == 'product' && slug.current == $slug
    ] | order(name asc)
  `)

  try {
    const product = await sanityFetch({
      query: PRODUCT_BY_ID_QUERY,
      params: {
        slug,
      }
    })

    console.log('product', product);

    return product.data?.[0] || null;
  } catch (e) {
    console.error('Error fetching product by ID:', e);
    return null;
  }
}
