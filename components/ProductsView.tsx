import {Category, Product} from "@/sanity.types";
import {FC} from "react";
import ProductGrid from "@/components/ProductGrid";
import {CategorySelectorComponent} from "@/components/ui/category-selector";

interface Props {
  products: Product[];
  categories: Category[];
}

const ProductsView: FC<Props> = (props)  => {
  const { products, categories } = props;

  return (
    <div className="flex flex-col">
      {/*categories*/}
      <div className="w-full sm:w-[200px]">
        <CategorySelectorComponent categories={categories} />
      </div>

      {/*products*/}
      <div className="flex-1">
        <div>
          <ProductGrid products={products} />

          <hr className="w-1/2 sm:w-3/4"/>
        </div>
      </div>
    </div>
  )
}

export default ProductsView;
