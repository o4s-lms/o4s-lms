import React, { useRef } from "react"
import { Editor } from "@tinymce/tinymce-react"
import readingTime from "reading-time"

import SectionWrapper from "@/components/section-wrapper"

import { BlogPost_idResponseData } from "@o4s/generated-wundergraph/models"
import useUpdateHtmlMutation from "@/hooks/site/use-update-html-mutation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

type Post = BlogPost_idResponseData["post"]
const PostEditor: React.FC<{
	post: Post;
}> = ({ post }) => {
  const editorRef = useRef(null)
  const updateHtml = useUpdateHtmlMutation()
  const { toast } = useToast()

	const id = post?.id
	const initialHTML = post?.html

  const save = () => {
    if (editorRef.current) {
			const html = editorRef.current.getContent()
      const { minutes } = readingTime(html as string)
      const post = updateHtml.trigger({ id, html, minutes }, { throwOnError: false })
    }
  }

  return (
    <>
		<SectionWrapper className="mt-0">
      <div className="mt-3 lg:mt-0">
					<Button
						onClick={save}
						label="Save"
						severity="success"
						className="p-button-outlined mr-2"
						icon="pi pi-save" />
					<Button
						onClick={confirm}
						label="Delete"
						severity="danger"
						className="p-button-outlined mr-2"
						icon="pi pi-trash" />
					<Button label={post?.status === 'draft' ? ("Publish") : ("Unpublish")} icon="pi pi-check" />
			</div>
      <Editor
        tinymceScriptSrc='/tinymce/tinymce.min.js'
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue={initialHTML}
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
  )
}

export default PostEditor