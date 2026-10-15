export default async function Fetcher(url: string) {
  const res = await fetch(url);

  // Throw so SWR reports an error instead of treating an error body as data.
  if (!res.ok) {
    throw new Error(`Request to ${url} failed with status ${res.status}`);
  }

  return res.json();
}
