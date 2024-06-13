import qs from 'qs';
import { flattenAttributes, getStrapiURL } from '@/lib/utils';
import { unstable_noStore as noStore } from 'next/cache';
import { getAuthToken } from './services/get-token';

const baseUrl = getStrapiURL();

async function fetchData(url: string) {
  const authToken = await getAuthToken();

  const headers = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    const response = await fetch(url, authToken ? headers : {});
    const data = await response.json();
    return flattenAttributes(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export async function getHomePageData() {
  noStore();
  const url = new URL('/api/home-page', baseUrl);

  url.search = qs.stringify({
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

  return await fetchData(url.href);
}

export async function getGlobalData() {
  const url = new URL('/api/global', baseUrl);

  url.search = qs.stringify({
    populate: [
      'header.logoText',
      'header.ctaButton',
      'footer.logoText',
      'footer.socialLink',
    ],
  });

  return await fetchData(url.href);
}

export async function getGlobalPageMetadata() {
  const url = new URL('/api/global', baseUrl);

  url.search = qs.stringify({
    fields: ['title', 'description'],
  });

  return await fetchData(url.href);
}

export async function getSummaries() {
  const url = new URL('/api/summaries', baseUrl);
  return fetchData(url.href);
}
