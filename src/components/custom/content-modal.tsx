import { useState } from "react"
import { X, Copy, CheckCircle } from "lucide-react"

type Props = {
  content: string
  onClose: () => void
  onInsert: (content: string) => void
}

export default function ContentModal({ content, onClose, onInsert }: Props) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>AI Suggestion</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X size={24} />
          </button>
        </div>
        <div className='whitespace-pre-wrap mb-4'>{content}</div>
        <div className='flex items-center gap-4'>
          <button
            onClick={handleCopy}
            className='flex items-center justify-center w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
          >
            {copied ? (
              <>
                <CheckCircle size={20} className='mr-2' />
                Copied!
              </>
            ) : (
              <>
                <Copy size={20} className='mr-2' />
                Copy to Clipboard
              </>
            )}
          </button>
          <button
            onClick={() => {
              onInsert(content)
              onClose()
            }}
            className='w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition-colors'
          >
            Insert Suggestion
          </button>
        </div>
      </div>
    </div>
  )
}
