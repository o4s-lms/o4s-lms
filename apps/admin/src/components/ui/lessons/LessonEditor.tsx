/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Toast } from 'primereact/toast';

import SectionWrapper from "~/components/SectionWrapper";
import LessonHeader from "~/components/ui/lessons/LessonHeader";
import { type LessonsIdResponseData } from '@o4s/generated-wundergraph/models';
import useUpdateHtmlMutation from '~/hooks/useUpdateHtmlMutation';

type Lesson = LessonsIdResponseData["lesson"]

const LessonEditor: React.FC<{
	lesson: Lesson;
}> = ({ lesson }) => {
  const editorRef = useRef(null);
	const toast = useRef<Toast>(null);
	const updateHtml = useUpdateHtmlMutation();
	const id = lesson?.id as string;
	const initialHtml = lesson?.html as string;

  const save = async () => {
    if (editorRef.current) {
			const html = await editorRef.current.getContent() as string;
			const updatedHtml = await updateHtml.trigger({
				id: id,
				html: html,
			}, { throwOnError: false });
			if (updatedHtml) {
				toast.current?.show({severity:'success', summary: 'Success', detail:`Lesson updated successfully ${html}`, life: 3000});
			} else {
				toast.current?.show({severity:'error', summary: 'Error', detail:'Something went wrong', life: 3000});
			};
    }
  };

  return (
    <><Toast ref={toast} />
		<LessonHeader lesson={lesson} saveLessonHTML={save} />
		<SectionWrapper className="mt-0">
      <Editor
        tinymceScriptSrc='/tinymce/tinymce.min.js'
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue={initialHtml}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'emoticons', 'autoresize', 'lists', 'link', 'image', 'charmap',
            'anchor', 'nonbreaking', 'searchreplace', 'visualblocks', 'visualchars', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
          ],
					autoresize_overflow_padding: 0,
					image_caption: true,
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
						'link | image media | nonbreaking | ' +
            'removeformat | fullscreen preview | help',
          content_style: 'body { font-size:14px }'
        }}
      />
		</SectionWrapper>
    </>
  );
};

export default LessonEditor;