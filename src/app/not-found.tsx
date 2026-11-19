import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-page px-4 py-10 md:px-6">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="mt-2"><Link href="/">Go to the home page</Link></p>
    </main>
  );
}
