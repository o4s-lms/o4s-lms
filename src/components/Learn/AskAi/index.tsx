'use client';

import { Main } from '@/components/Layout/Main';
import { FullPageChat } from 'flowise-embed-react';

export function AskAi() {
  return (
    <Main fixed>
      <div key="ask-ai-content" className="flex flex-1 flex-col gap-4 p-4">
        <FullPageChat
          chatflowid="0fc98301-71b7-4e58-966f-c395d0a10ffe"
          apiHost="http://joseantcordeiro.hopto.org:3001"
        />
      </div>
    </Main>
  );
}
