'use client';

import React from 'react';

import type { Header as HeaderType, Page, Post } from '@/payload-types';

import { CMSLink } from '@/components/Link';

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || [];

  const menuItems = (link) => {
    const href =
      link.type === 'reference' &&
      typeof link.reference?.value === 'object' &&
      link.reference.value.slug
        ? `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${
            link.reference.value.slug
          }`
        : link.url;

    if (!href) return null;
  };

  const listItems = navItems.map(({ link }, i) => (
    <li key={i}>
      <CMSLink
        key={i}
        {...link}
        appearance="link"
        className="relative inline-flex h-10 overflow-hidden rounded-full p-[10px] dark:text-white"
      />
    </li>
  ));

  return (
    <nav className="absolute left-[50%] top-[50%] hidden translate-x-[-50%] translate-y-[-50%] transform md:block">
      <ul key={'main-menu'} className="flex list-none items-center gap-4">
        {listItems}
      </ul>
    </nav>
  );
};
