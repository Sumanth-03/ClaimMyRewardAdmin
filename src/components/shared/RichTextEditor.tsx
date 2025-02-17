import { forwardRef } from 'react'
import ReactQuill, { ReactQuillProps } from 'react-quill'
import 'react-quill/dist/quill.snow.css'

type RichTextEditorProps = ReactQuillProps

export type RichTextEditorRef = ReactQuill

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
    (props, ref) => {
        // Define the custom toolbar modules
        const modules = {
            // toolbar: [
            //     [{ 'header': [1, 2, false] }], // Header options
            //     ['bold', 'italic', 'underline'], // Text formatting options
            //     [{ 'list': 'ordered' }], // Only ordered list
            //     ['link', 'image'], // Link and image options
            //     ['clean'] // Remove formatting option
            // ],
            toolbar: false,
        }

        return (
            <div className="rich-text-editor">
                <ReactQuill ref={ref} modules={modules} {...props} />
            </div>
        )
    },
)

RichTextEditor.displayName = 'RichTextEditor'

export default RichTextEditor
