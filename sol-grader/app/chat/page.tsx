"use client";

import { useState, useRef, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Command, CommandInput } from "@/components/ui/command";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      content: "Hello! I'm your AI assignment assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputMessage.trim() === "") return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    
    try {
      // In a real app, this would call the chat API endpoint
      // For demo purposes, we'll simulate a response with a timeout
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          history: messages.map(m => ({ content: m.content, role: m.sender === "user" ? "user" : "assistant" })),
          userId: "demo-user-123",
        }),
      });
      
      if (!response.ok) throw new Error("Failed to get response");
      
      const data = await response.json();
      
      // Add AI response to chat
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "Sorry, I encountered an error. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sample suggestions for quick prompts
  const suggestions = [
    "Can you explain the feedback on my last assignment?",
    "How can I improve my essay structure?",
    "What are some resources for learning calculus?",
    "Can you help me understand this chemistry concept?",
    "What's the best way to cite sources in APA format?",
  ];

  return (
    <PageLayout>
      <div className="flex flex-col space-y-6 mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight">Chat & Feedback</h1>
        <p className="text-muted-foreground">
          Ask questions about your assignments and get personalized feedback from our AI assistant.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <Card className="h-[70vh] flex flex-col">
              <CardHeader className="px-4 py-3 border-b flex-none">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/ai-avatar.png" alt="AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">AI Assignment Assistant</CardTitle>
                    <CardDescription>Powered by Groq AI</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                      <div className="flex space-x-2 items-center">
                        <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>
              
              <CardFooter className="p-4 border-t flex-none">
                <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-grow"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading || inputMessage.trim() === ""}>
                    Send
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </div>
          
          <div className="hidden md:block">
            <Card className="h-[70vh]">
              <CardHeader>
                <CardTitle>Suggestions</CardTitle>
                <CardDescription>Try asking these questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => setInputMessage(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </CardContent>
              <CardFooter className="flex-col items-start">
                <CardTitle className="text-sm mb-2">Upload Context</CardTitle>
                <p className="text-xs text-muted-foreground mb-2">
                  Upload an assignment to get specific feedback
                </p>
                <Input
                  type="file"
                  className="cursor-pointer"
                  accept=".pdf,.doc,.docx,.txt"
                />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 