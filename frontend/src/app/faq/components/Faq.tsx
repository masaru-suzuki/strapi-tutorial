export interface FAQ {
  id: number;
  title: string;
  loginOnly: boolean;
  faq_categories: {
    data: Array<{
      id: number;
      label: string;
      url: string;
    }>;
  };
}
