import { type Image } from "sanity";

async function getFeaturedProducts() {
  return [
    {
      _id: "1",
      title: "Cambiano Classic - Ethergraf",
      price: "€119,00",
      slug: "cambiano-classic-ethergraf",
    },
    {
      _id: "2",
      title: "Cambiano Classic - Ethergraf",
      price: "€119,00",
      slug: "cambiano-classic-ethergraf",
    },
    {
      _id: "3",
      title: "Cambiano Classic - Ethergraf",
      price: "€119,00",
      slug: "cambiano-classic-ethergraf",
    },
    {
      _id: "4",
      title: "Cambiano Classic - Ethergraf",
      price: "€119,00",
      slug: "cambiano-classic-ethergraf",
    },
    {
      _id: "5",
      title: "Cambiano Classic - Ethergraf",
      price: "€119,00",
      slug: "cambiano-classic-ethergraf",
    },
    {
      _id: "6",
      title: "Cambiano Classic - Ethergraf",
      price: "€119,00",
      slug: "cambiano-classic-ethergraf",
    },
  ];
}

export async function FeaturedProductsList() {
  const products = await getFeaturedProducts();

  return (
    <ul className="flex gap-8 overflow-x-auto hide-scrollbar px-[var(--container-outer-width)] -mx-[var(--container-outer-width)]">
      {products.map((product) => (
        <li key={product._id}>
          <FeaturedProduct data={product} />
        </li>
      ))}
    </ul>
  );
}

function FeaturedProduct({
  data,
}: {
  data: { title: string; price: string; slug: string; coverImage?: Image };
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-[300px] aspect-square bg-[#523015] rounded-2xl overflow-hidden object-center object-cover" />
      <div className="flex flex-col gap-2">
        <span className="font-medium leading-[1.5]">{data.title}</span>
        <span className="font-light leading-[1.5]">{data.price}</span>
      </div>
    </div>
  );
}
