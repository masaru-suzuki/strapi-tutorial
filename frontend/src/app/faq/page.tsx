import { getFaqList } from '@/data/loaders';
import { sortFAQsByCategory } from './util/sortFAQ';
import { FAQ } from './components/Faq';

export default async function Page() {
  const { data } = await getFaqList();
  const sortDataByCategory = sortFAQsByCategory(data);

  return (
    <div className="">
      <h1 className="text-xl font-extrabold">faq page</h1>

      {sortDataByCategory.map((category: any, i) => {
        const { categoryLabel, categoryUrl, faqs } = category;

        return (
          <section id={`${categoryUrl}-${i}`}>
            <h2 className="text-lg font-bold">{categoryLabel}</h2>
            <ul>
              {faqs.map((faq: FAQ) => {
                console.log(faq);
                const { id, title, loginOnly } = faq;

                return (
                  <li key={id}>
                    <a href={`/faq/${id}`}>{title}</a>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
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
