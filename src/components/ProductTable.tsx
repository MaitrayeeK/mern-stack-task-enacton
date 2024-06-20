import {
  MapBrandIdsToName,
  getAllProductCategories,
} from "@/actions/productActions";
import ProductRow from "./ProductRow";
import Empty from "./Empty";

async function ProductTable({ products, numOfResultsOnCurPage }) {
  if (products.length === 0) {
    return <Empty />;
  }

  const brandsArr = new Set();
  for (let i = 0; i < products.length; i++) {
    const productBrands = JSON.parse(products.at(i)?.brands as string);
    productBrands?.forEach((productBrand) => {
      brandsArr.add(productBrand);
    });
  }

  const brandsId = [...brandsArr];
  const brandsMap = await MapBrandIdsToName(brandsId);
  const productCategories = await getAllProductCategories(products);

  return (
    <table>
      <thead>
        <tr>
          <th>Product Id</th>
          <th>Image</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Colors</th>
          <th>Rating</th>
          <th>Gender</th>
          <th>Categories</th>
          <th>Brands</th>
          <th>Occasion</th>
          <th>Operations</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => {
          return (
            <ProductRow
              key={product.id}
              product={product}
              productCategories={productCategories.get(product.id)}
              brandsMap={brandsMap}
              numOfResultsOnCurPage={numOfResultsOnCurPage}
            />
          );
        })}
      </tbody>
    </table>
  );
}

export default ProductTable;
