import { formatCurrency } from "@/utils";
import Image from "next/image";
import DeleteProduct from "./DeleteProduct";
import Link from "next/link";

function ProductRow({
  product,
  productCategories,
  brandsMap,
  numOfResultsOnCurPage,
}) {
  return (
    <>
      <tr key={product.id}>
        <td>{product.id}</td>
        <td>
          <Image
            src={product.image_url || "/images/dummy.webp"}
            alt="product image"
            width="150"
            height="100"
          />
        </td>
        <td>{product.name}</td>
        <td className="max-w-64">
          <p className="truncate w-full">{product.description}</p>
        </td>
        <td>
          <span className="line-through">
            {formatCurrency(product.old_price)}
          </span>
          <br />
          <span>{formatCurrency(product.price)}</span> <br />
          <span>{product.discount}% off</span>
        </td>
        <td>
          <div className="flex flex-col gap-2">
            {product.colors.split(",").map((color, i) => {
              return <span key={i}>{color}</span>;
            })}
          </div>
        </td>
        <td>{product.rating}</td>
        <td>{product.gender}</td>
        <td>
          <div className="flex flex-col gap-2">
            {productCategories.map((category, i) => {
              return <span key={i}>{category.name}</span>;
            })}
          </div>
        </td>
        <td>
          <div className="flex flex-col gap-2">
            {[...new Set(JSON.parse(product.brands))].map((brandId, i) => {
              return <span key={i}>{brandsMap.get(brandId)}</span>;
            })}
          </div>
        </td>
        <td>
          <div className="flex flex-col">
            {product.occasion.split(",").map((item, i) => {
              return <span key={i}>{item}</span>;
            })}
          </div>
        </td>
        <td>
          <div className="flex flex-col gap-2">
            {/* <span>
              <Link href={`/products/${product.id}`}>See More</Link>
            </span> */}
            <Link href={`/products/${product.id}/edit`}>Edit details</Link>
            <DeleteProduct
              numOfResultsOnCurPage={numOfResultsOnCurPage}
              productId={product.id}
            />
          </div>
        </td>
      </tr>
    </>
  );
}

export default ProductRow;
