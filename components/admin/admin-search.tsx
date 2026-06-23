"use client";

import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";

const AdminSearch = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const formActionUrl = pathname.includes("/admin/orders")
    ? "/admin/orders"
    : pathname.includes("/admin/users")
      ? "/admin/users"
      : "/admin/products";

  const currentQuery = searchParams.get("query") || "";

  const [queryValue, setQueryValue] = useState(currentQuery);

  const [prevQuery, setPrevQuery] = useState(currentQuery);
  if (currentQuery !== prevQuery) {
    setQueryValue(currentQuery);
    setPrevQuery(currentQuery);
  }

  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        placeholder="Search..."
        name="query"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        className="md:w-25 lg:w-75"
      />
      <button className="sr-only" type="submit">
        Search
      </button>
    </form>
  );
};

export default AdminSearch;
