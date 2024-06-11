import { flattenAttributes } from '@/lib/utils';
import QueryString from 'qs';

const homePageQuery = QueryString.stringify({
  populate: {
    blocks: {
      populate: {
        image: {
          fields: ['url', 'alternativeText'],
        },
        link: {
          populate: true,
        },
      },
    },
  },
});

async function getStrapiData(path: string) {
  const baseUrl = 'http://localhost:1337';
  const url = new URL(path, baseUrl);
  url.search = homePageQuery;

  try {
    const response = await fetch(url.href);
    const data = await response.json();
    const flattenedData = flattenAttributes(data);
    console.dir(flattenedData, { depth: null });

    return flattenedData;
  } catch (error) {
    console.error(error);
  }
}

export default async function Home() {
  const strapiData = await getStrapiData('/api/home-page');
  const { title, description } = strapiData;

  return (
    <main className="container mx-auto py-6">
      <h1 className="text-5xl font-bold">{title}</h1>
      <p className="text-xl mt-4">{description}</p>
    </main>
  );
}
