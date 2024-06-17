import type { Schema, Attribute } from '@strapi/strapi';

export interface ComponentsFaqCategory extends Schema.Component {
  collectionName: 'components_components_faq_categories';
  info: {
    displayName: 'faqCategory';
  };
  attributes: {
    faqs: Attribute.Relation<
      'components.faq-category',
      'oneToMany',
      'api::faq.faq'
    >;
  };
}

export interface ComponentsFaq extends Schema.Component {
  collectionName: 'components_components_faqs';
  info: {
    displayName: 'Faq';
    description: '';
  };
  attributes: {
    loginOnly: Attribute.Boolean & Attribute.DefaultTo<false>;
    question: Attribute.String & Attribute.Required;
    answer: Attribute.Blocks & Attribute.Required;
  };
}

export interface ComponentsFeature extends Schema.Component {
  collectionName: 'components_components_features';
  info: {
    displayName: 'Feature';
    description: '';
  };
  attributes: {
    heading: Attribute.String;
    subHeading: Attribute.Text;
    icon: Attribute.Enumeration<['CLOCK_ICON', 'CHECK_ICON', 'CLOUD_ICON']>;
  };
}

export interface ComponentsLink extends Schema.Component {
  collectionName: 'components_components_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    url: Attribute.String;
    text: Attribute.String;
    isExternal: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface LayoutFaqGroups extends Schema.Component {
  collectionName: 'components_layout_faq_groups';
  info: {
    displayName: 'FAQ Groups';
    description: '';
  };
  attributes: {
    faqs: Attribute.Component<'components.faq', true>;
    heading: Attribute.String;
  };
}

export interface LayoutFeaturesSection extends Schema.Component {
  collectionName: 'components_layout_features_sections';
  info: {
    displayName: 'Features Section';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    descripiton: Attribute.Text;
    feature: Attribute.Component<'components.feature', true>;
  };
}

export interface LayoutFooter extends Schema.Component {
  collectionName: 'components_layout_footers';
  info: {
    displayName: 'Footer';
  };
  attributes: {
    logoText: Attribute.Component<'components.link'>;
    text: Attribute.Text;
    socialLink: Attribute.Component<'components.link', true>;
  };
}

export interface LayoutHeader extends Schema.Component {
  collectionName: 'components_layout_headers';
  info: {
    displayName: 'Header';
    description: '';
  };
  attributes: {
    logoText: Attribute.Component<'components.link', true>;
    ctaButton: Attribute.Component<'components.link'>;
  };
}

export interface LayoutHeroSection extends Schema.Component {
  collectionName: 'components_layout_hero_sections';
  info: {
    displayName: 'Hero Section';
    description: '';
  };
  attributes: {
    heading: Attribute.String;
    subHeading: Attribute.Text;
    image: Attribute.Media<'images'>;
    link: Attribute.Component<'components.link'>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'components.faq-category': ComponentsFaqCategory;
      'components.faq': ComponentsFaq;
      'components.feature': ComponentsFeature;
      'components.link': ComponentsLink;
      'layout.faq-groups': LayoutFaqGroups;
      'layout.features-section': LayoutFeaturesSection;
      'layout.footer': LayoutFooter;
      'layout.header': LayoutHeader;
      'layout.hero-section': LayoutHeroSection;
    }
  }
}
