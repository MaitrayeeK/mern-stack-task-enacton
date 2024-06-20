import { getBrands } from "@/actions/brandActions";
import AddBrand from "@/components/AddBrand";
import DeleteBrand from "@/components/DeleteBrand";
import EditBrand from "@/components/EditBrand";

async function Brands() {
  const brands = await getBrands();

  return (
    <div className="pb-16">
      <h1 className="text-xl font-bold">All Available brands</h1>

      <AddBrand />

      {brands.map((brand, i) => (
        <div key={brand.id} className="border-b-2 border-violet-400 p-4">
          <div>
            {i + 1}. Name: <span>{brand.name}</span>
          </div>
          <div>
            Brand Website:{" "}
            {brand.website ? (
              <a
                href={brand.website as string}
                className="text-violet-400"
                target="_blank"
              >
                {brand.website}
              </a>
            ) : (
              <span>No Website</span>
            )}
          </div>
          <div>
            <>
              <EditBrand brand={brand} />
              <DeleteBrand brand_id={brand.id} />
            </>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Brands;
