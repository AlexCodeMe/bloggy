'use client'

import dynamic from "next/dynamic"
import { useMemo } from "react"
import "react-quill/dist/quill.snow.css"
import { useTheme } from "next-themes"  // You'll need to install next-themes

type Props = {
    placeholder: string,
    onChange: (value: string) => void
    value?: string
    className?: string
}

export default function RichEditor({ placeholder, onChange, value, className }: Props) {
    const ReactQuill = useMemo(
        () => dynamic(() => import("react-quill"), { ssr: false }),
        []
    )

    const { theme } = useTheme()

    const editorStyle = {
        height: '400px',
        width: '100%',
        '--editor-bg': theme === 'dark' ? '#1a1a1a' : 'white',
        '--editor-text': theme === 'dark' ? 'white' : 'black',
    } as React.CSSProperties

    return (
        <ReactQuill
            theme="snow"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={className}
            style={editorStyle}
            formats={[
                'header', 'font', 'size',
                'bold', 'italic', 'underline', 'strike', 'blockquote',
                'list', 'bullet', 'indent',
                'link', 'image', 'video'
            ]}
        />
    )
}