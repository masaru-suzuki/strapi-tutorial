import { FeatureSection } from '@/components/custom/FeaturesSection';
import { HeroSection } from '@/components/custom/HeroSection';
import { flattenAttributes, getStrapiURL } from '@/lib/utils';
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
        feature: {
          populate: true,
        },
      },
    },
  },
});

function blockRenderer(block: any) {
  switch (block.__component) {
    case 'layout.hero-section':
      return <HeroSection key={block.id} data={block} />;
    case 'layout.features-section':
      return <FeatureSection key={block.id} data={block} />;
    default:
      return null;
  }
}

async function getStrapiData(path: string) {
  const baseUrl = getStrapiURL();

  const url = new URL(path, baseUrl);
  url.search = homePageQuery;

  try {
    const response = await fetch(url.href, { cache: 'no-store' });
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
  const { blocks } = strapiData;

  if (!blocks) return <div>No Blocks Found</div>;

  return <main>{blocks.map((block: any) => blockRenderer(block))}</main>;
}
