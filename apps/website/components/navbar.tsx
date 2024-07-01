import Link from "next/link";

import { Feather, ShoppingCart } from "~/components/icons";
import { Container } from "~/components/container";

async function getNavLinks() {
  return [
    {
      _id: "1",
      label: "Shop",
      href: "/shop",
    },
    {
      _id: "2",
      label: "Learn",
      href: "/learn",
    },
    {
      _id: "3",
      label: "About",
      href: "/about",
    },
    {
      _id: "4",
      label: "Blog",
      href: "/blog",
    },
  ];
}

export async function Navbar() {
  const links = await getNavLinks();
  return (
    <div className="p-4">
      <Container className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-4">
          <Link href="/" className="flex items-baseline gap-2">
            <Feather size={32} className="text-[#523015] self-center" />
            <span className="font-semibold text-[24px]/[1.5] text-black">
              Quill
            </span>
          </Link>
          <nav>
            <ul className="flex items-center text-[16px]/[1.5] text-black/70">
              {links.map((item) => (
                <li key={item._id} className="inline-flex hover:text-black/100">
                  <Link
                    href={item.href}
                    className="inline-block h-fit px-3 py-1.5 transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <ul className="flex items-baseline text-[16px]/[1.5] text-black/70">
          <li className="inline-flex hover:text-black/100">
            <Link
              href="/help"
              className="inline-block h-fit px-3 py-1.5 transition"
            >
              Help
            </Link>
          </li>
          <li className="inline-flex hover:text-black/100">
            <Link
              href="/account"
              className="inline-block h-fit px-3 py-1.5 transition"
            >
              Account
            </Link>
          </li>
          <li className="inline-flex self-center hover:cursor-pointer hover:text-black/100">
            <span className="inline-block h-fit px-3 py-1.5 transition">
              <ShoppingCart size={24} />
            </span>
          </li>
        </ul>
      </Container>
    </div>
  );
}
