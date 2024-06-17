export interface Category {
  categoryLabel: string;
  categoryUrl: string;
  faqs: Array<{
    id: number;
    title: string;
    loginOnly: boolean;
  }>;
}
