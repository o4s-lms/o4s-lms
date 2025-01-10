'use client';

import { Main } from '@/components/Layout/Main';
import { FullPageChat } from 'flowise-embed-react';

export function AskAi() {

  return (
    <Main fixed>
      <div key="ask-ai-content" className="flex flex-1 flex-col gap-4 p-4">
        <FullPageChat
          chatflowid="2baa386f-c30e-4d59-9697-f95e77014da7"
          apiHost="http://localhost:3001"
        />
      </div>
    </Main>
  );
}
