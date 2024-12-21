import { getCachedGlobal } from '@/utilities/getGlobals';
import React from 'react';

import type { Footer } from '@/payload-types';

import { CMSLink } from '@/components/Link';
//import { getTranslate } from '@/tolgee/server';

export async function Footer() {
  //const t = await getTranslate();
  const footerData: Footer = await getCachedGlobal('footer', 1)();

  const navItems = footerData?.navItems || [];

  return (
    <footer className="bottom-0 mt-10 w-full border-y-2 py-8 text-center text-sm">
      {/**<p>&copy; 2014-2024 José Cordeiro. {t('footer:copyright')} {t('footer:built')} ❤️</p>*/}
      <p>&copy; 2014-2024 José Cordeiro. Todos os direitos reservados. Feito com ❤️</p>
      <div className="mt-2">
        <nav>
          {navItems.map(({ link }, i) => {
            return (
              <CMSLink className="text-primary-500 mx-2" key={i} {...link} />
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
