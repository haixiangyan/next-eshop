import {defineQuery} from "next-sanity";
import {sanityFetch} from "@/sanity/lib/live";

export const getAllCategories = async () => {
  const ALL_CATEGORIES_QUERY = defineQuery(`
    *[_type=="category"] | order(name asc)
  `)

  try {
    const categories = await sanityFetch({
      query: ALL_CATEGORIES_QUERY,
    })

    console.log('categories', categories);

    return categories.data || [];
  } catch (e) {
    console.error('Error fetching all categories', e);
    return [];
  }
}
