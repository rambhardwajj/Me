import { notFound } from 'next/navigation';

/** Any other address under /uber: answered by /uber's own not-found page, not the main site's. */
export default function Missing() {
  notFound();
}
