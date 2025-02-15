import { LinkProps } from 'next/link';

interface BaseNavItem {
  id?: string;
  title: string;
  badge?: string;
  icon?: React.ElementType;
  isFavorite?: boolean;
}

type NavLink = BaseNavItem & {
  url: LinkProps['href'];
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps['href'] })[];
  url?: never;
};

type NavItem = NavCollapsible | NavLink;

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarData {
  navGroups: NavGroup[];
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink };
