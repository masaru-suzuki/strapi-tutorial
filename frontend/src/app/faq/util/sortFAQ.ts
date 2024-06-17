import { Category } from '../components/CategoryHeading';
import { FAQ } from '../components/Faq';

export function sortFAQsByCategory(faqs: FAQ[]): Category[] {
  const categoryMap: { [key: number]: Category } = {};

  faqs.forEach((faq) => {
    const category = faq.faq_categories.data[0];
    const categoryId = category.id;

    if (!categoryMap[categoryId]) {
      categoryMap[categoryId] = {
        categoryLabel: category.label,
        categoryUrl: category.url,
        faqs: [],
      };
    }

    categoryMap[categoryId].faqs.push({
      id: faq.id,
      title: faq.title,
      loginOnly: faq.loginOnly,
    });
  });

  return Object.values(categoryMap);
}
