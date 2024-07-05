import { cn } from "@/lib/utils"
import { Message, useChat } from "ai/react"
import {
  Bot,
  LucideSpellCheck2,
  SendHorizontal,
  Shuffle,
  Trash,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { ChangeEvent, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"

interface AIChatBoxProps {
  open: boolean
  onClose: () => void
}

export default function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat({
    api: '/api/chat',
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user"

  async function handleSynonyms() {
    if (input.trim() === "") return

    try {
      const response = await fetch("/api/synonyms-antonyms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words: [input.trim()] }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch synonyms and antonyms')
      }

      const data = await response.json()

      // Create new messages
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: `Find synonyms and antonyms for: ${input}`
      }
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.result
      }

      // Update messages
      setMessages([...messages, userMessage, aiMessage])

      // Clear the input after processing
      handleInputChange({ target: { value: '' } } as ChangeEvent<HTMLInputElement>)
    } catch (error) {
      console.error("Error fetching synonyms and antonyms:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I couldn't find synonyms and antonyms at the moment. Please try again later."
      }
      setMessages([...messages, errorMessage])
    }
  }

  return (
    <div
      className={cn(
        "bottom-0 right-0 w-full max-w-[500px] p-1 xl:right-36 z-[99999]",
        open ? "fixed" : "hidden"
      )}
    >
      <button onClick={onClose} className='mb-1 ms-auto block'>
        <XCircle size={30} className='rounded-full bg-background' />
      </button>
      <div className='flex h-[600px] flex-col rounded border bg-background shadow-xl'>
        <div className='mt-3 h-full overflow-y-auto px-3' ref={scrollRef}>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && lastMessageIsUser && (
            <ChatMessage
              message={{
                id: "loading",
                role: "assistant",
                content: "Thinking...",
              }}
            />
          )}
          {error && (
            <ChatMessage
              message={{
                id: "error",
                role: "assistant",
                content: "Something went wrong. Please try again!",
              }}
            />
          )}
          {!error && messages.length === 0 && (
            <div className='mx-8 flex h-full flex-col items-center justify-center gap-3 text-center'>
              <Bot size={28} />
              <p className='text-lg font-medium'>
                Hello, I&apos;m Bloggy! I can provide you with synonyms and
                antonyms. Type in a word or phase and I&apos;ll help you.
              </p>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className='m-3 flex gap-1'>
          <button
            type='button'
            className='flex w-10 flex-none items-center justify-center'
            title='Clear chat'
            onClick={() => setMessages([])}
          >
            <Trash size={24} />
          </button>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder='Enter word(s) for suggestions...'
            className='grow rounded border bg-background px-3 py-2'
            ref={inputRef}
          />
          <button
            type="submit"
            className="flex w-10 flex-none items-center justify-center disabled:opacity-50"
            disabled={input.length === 0}
            title="Submit message"
          >
            <SendHorizontal size={24} />
          </button>
          <button
            className='flex w-10 flex-none items-center justify-center disabled:opacity-50'
            title='Synonyms and Antonyms'
            disabled={isLoading}
            onClick={handleSynonyms}
          >
            <Shuffle />
          </button>
        </form>
      </div>
    </div>
  )
}

function ChatMessage({ message: { role, content } }: { message: Message }) {
  const isAiMessage = role === "assistant"

  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAiMessage ? "me-5 justify-start" : "ms-5 justify-end"
      )}
    >
      {isAiMessage && <Bot className='mr-2 flex-none' />}
      <div
        className={cn(
          "rounded-md border px-3 py-2",
          isAiMessage ? "bg-background" : "bg-foreground text-background"
        )}
      >
        <ReactMarkdown
          components={{
            a: ({ node, ref, ...props }) => (
              <Link
                {...props}
                href={props.href ?? ""}
                className='text-primary hover:underline'
              />
            ),
            p: ({ node, ...props }) => (
              <p {...props} className='mt-3 first:mt-0' />
            ),
            ul: ({ node, ...props }) => (
              <ul
                {...props}
                className='mt-3 list-inside list-disc first:mt-0'
              />
            ),
            li: ({ node, ...props }) => <li {...props} className='mt-1' />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
