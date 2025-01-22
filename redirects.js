const redirects = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  };

  const settings = {
    destination: '/dashboard/settings/account',
    permanent: true,
    source: '/dashboard/settings',
  };

  const notifications = {
    destination: '/dashboard/notifications/unread',
    permanent: true,
    source: '/dashboard/notifications',
  };

  const redirects = [internetExplorerRedirect, settings, notifications];

  return redirects;
};

export default redirects;
