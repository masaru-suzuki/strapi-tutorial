import { getFaqList } from '@/data/loaders';
import { sortFAQsByCategory } from './util/sortFAQ';
import { FAQ } from './components/Faq';
import { SearchFAQ } from '@/components/custom/SearchFAQ';

interface SearchParamsProps {
  searchParams?: {
    query?: string;
  };
}

const getUserAuth = (): boolean => true;

export default async function Page({
  searchParams,
}: Readonly<SearchParamsProps>) {
  const query = searchParams?.query ?? '';
  const isAuthenticated = getUserAuth();
  const { data } = await getFaqList(query, isAuthenticated);

  const sortDataByCategory = sortFAQsByCategory(data);

  return (
    <div className="max-w-screen-md mx-auto my-12">
      <h1 className="text-xl font-extrabold">faq page</h1>
      <div className="my-8">
        <SearchFAQ />
      </div>
      <div className="my-8">
        <p className={`text-${isAuthenticated ? 'green' : 'red'}-400`}>
          {/* <p className={`text-green-400`}> */}
          isAuthenticated: {isAuthenticated ? '認証済み' : '未認証'}
        </p>
      </div>
      <div className="grid gap-8">
        {sortDataByCategory.length === 0 && <div>データがありません</div>}
        {sortDataByCategory.map((category: any, i) => {
          const { categoryLabel, categoryUrl, faqs } = category;

          return (
            <section id={`${categoryUrl}-${i}`}>
              <h2 className="text-lg font-bold">{categoryLabel}</h2>
              <ul className="mt-4">
                {faqs.map((faq: FAQ) => {
                  const { id, title, loginOnly } = faq;

                  return (
                    <li key={id} className="border-bottom border-b py-4">
                      <a href={`/faq/${id}`}>{title}</a>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

const data = [
  {
    categoryLabel: 'WineBankについて',
    categoryUrl: 'aboutCompany',
    faqs: [
      {
        id: 1,
        title: 'question1',
        loginOnly: false,
      },
      {
        id: 2,
        title: 'question2',
        loginOnly: false,
      },
    ],
  },
  {
    categoryLabel: 'ワイン投資について',
    categoryUrl: 'about',
    faqs: [
      {
        id: 3,
        title: 'question3',
        loginOnly: false,
      },
    ],
  },
];
