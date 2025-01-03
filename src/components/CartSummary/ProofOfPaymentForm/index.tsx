'use client';

import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';
import { Button } from '@/components/ui/button';
import { Hourglass } from 'lucide-react';
import { useTolgee } from '@tolgee/react';
import { useState } from 'react';

import st from './styles.module.css';
import Image from 'next/image';

export function ProofOfPaymentForm({
  transactionId,
}: {
  transactionId: string;
}) {
  const tolgee = useTolgee(['language']);
  const currentLanguage = tolgee.getLanguage();
  const [files, setFiles] = useState([]);

  const metadata = {
    transactionId: transactionId,
  }

  const handleChangeEvent = async (files) => {
    console.log('change event payload:', files);

    setFiles([...files.allEntries.filter((f) => f.status === 'success')]);
    //setFiles(event.successEntries);
    //console.log('change event payload:', files);

    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/functions/emailProofOfPayment?transactionId=${transactionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(files.successEntries),
  
    });
  
  };
  return (
    <div className="flex h-full flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-500 p-3">
          <Hourglass className="h-16 w-16" />
        </div>
        <h1 className="mb-3 text-4xl font-bold">Proof of Payment</h1>

        <p className="mb-3 font-bold">Transaction ID: {transactionId}</p>

        <div className="bg-secondary-700 hover:bg-secondary-600 mt-2 flex cursor-pointer justify-center rounded-lg px-4 py-2">
          <FileUploaderRegular
            onChange={handleChangeEvent}
            useCloudImageEditor={false}
            sourceList="local, url, camera, dropbox"
            pubkey="932db77aaec31e5c3d99"
            //localeName={currentLanguage}
            metadata={metadata}
            //multiple={false}
          />
        </div>
        <div className={st.previews}>
          {files.map((file) => (
            <div key={file.uuid} className={st.previewWrapper}>
              <Image
                className={st.previewImage}
                key={file.uuid}
                src={`${file.cdnUrl}/-/preview/-/resize/x400/`}
                width="200"
                height="200"
                alt={file.fileInfo.originalFilename || ''}
                title={file.fileInfo.originalFilename || ''}
              />

              <p className={st.previewData}>{file.fileInfo.originalFilename}</p>
              <p className={st.previewData}>{formatSize(file.fileInfo.size)}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <p>
            Need help? Contact our{' '}
            <Button variant="link" asChild className="text-primary-700 m-0 p-0">
              <a href="mailto:support@example.com">customer support</a>
            </Button>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function formatSize(bytes) {
  if (!bytes) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}
