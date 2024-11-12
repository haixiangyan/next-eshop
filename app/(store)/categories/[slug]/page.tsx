import {getProductsByCategory} from "@/sanity/lib/products/getProductsByCategory";
import {getAllCategories} from "@/sanity/lib/products/getAllCategories";
import ProductsView from "@/components/ProductsView";

interface Props {
  params: Promise<{
    slug: string;
  }>
}

async function CategoryPage(props: Props) {
  const { params } = props;

  const { slug } = await params;

  const products = await getProductsByCategory(slug)
  const categories = await getAllCategories()

  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 px-4">
      <div className="bg-white py-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
          {' '}
          Collection
        </h1>

        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  )
}

export default CategoryPage;
