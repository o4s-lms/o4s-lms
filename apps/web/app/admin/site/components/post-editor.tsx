import React, { useRef } from "react"
import { Editor } from "@tinymce/tinymce-react"
import readingTime from "reading-time"

import SectionWrapper from "@/components/section-wrapper"

import { BlogPosts_allResponseData, BlogUpdate_htmlInput } from "@o4s/generated-wundergraph/models"
import useUpdateHtmlMutation from "@/hooks/site/use-update-html-mutation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

type Post = BlogPosts_allResponseData["posts"][number]
type Data = BlogUpdate_htmlInput

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
      const data = {
        id: id,
        html: html as string,
        est_reading_time: minutes,
      }
      const post = updateHtml.trigger(data, { throwOnError: false })
      if (!post) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })
      } else {
        toast({
          title: "Post updated sucessfully.",
        })
      }
    }
  }

  return (
    <>
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
		  <div className="mt-3 lg:mt-0">
        <Button onClick={save} className="p-1">Save</Button>
        <Button	variant="destructive" className="p-1">Delete</Button>
        <Button variant="secondary" className="p-1">{post?.status === 'draft' ? ("Publish") : ("Unpublish")}</Button>
			</div>
    </>
  )
}

export default PostEditor