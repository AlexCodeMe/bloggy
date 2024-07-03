"use client"

import { Bot } from "lucide-react"
import React, { useState } from "react"
import AIChatBox from "./ai-chat-box"

export default function AiChatButton() {
  const [chatBoxOpen, setChatBoxOpen] = useState(false)

  return (
    <>
      <button onClick={() => setChatBoxOpen(true)}>
        <Bot size={24} />
      </button>
      <AIChatBox open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
    </>
  )
}
