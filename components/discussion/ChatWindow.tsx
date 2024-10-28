"use client"

import React, { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@clerk/nextjs"
import { supabaseClient } from '@/lib/database/supabase/client'
import { toast } from "sonner"

import type { Message, ChatWindowProps } from '@/types';

function ChatWindow({ groupId }: ChatWindowProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!groupId) return;

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('messages')
          .select('*')
          .eq('group_id', groupId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
        setLoading(false);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error("Failed to load messages");
      }
    };

    // Subscribe to new messages
    const channel = supabaseClient
      .channel(`group-${groupId}-messages`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `group_id=eq.${groupId}`
        }, 
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(current => [...current, newMessage]);
          scrollToBottom();
        }
      )
      .subscribe();

    fetchMessages();

    return () => {
      channel.unsubscribe();
    };
  }, [groupId]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newMessage.trim()) return;

    try {
      const { error } = await supabaseClient
        .from('messages')
        .insert({
          group_id: groupId,
          user_id: user.id,
          username: user.username || 'Anonymous',
          content: newMessage.trim()
        });

      if (error) throw error;
      
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    }
  };

  if (loading) {
    return (
      <Card className="w-full h-[90vh] flex items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin" />
      </Card>
    );
  }

  return (
    <Card className="w-full h-[90vh] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-2xl text-center">Group Chat</CardTitle>
        <Separator/>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0" ref={scrollAreaRef}>
        <ScrollArea className="h-full px-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex items-start space-x-4 mb-4 ${
                message.user_id === user?.id ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <Avatar>
                <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={message.username} />
                <AvatarFallback>{message.username[0]}</AvatarFallback>
              </Avatar>
              <div className={`flex-1 space-y-1 ${
                message.user_id === user?.id ? 'items-end' : ''
              }`}>
                <div className={`flex items-center space-x-2 ${
                  message.user_id === user?.id ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <span className="font-medium">{message.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <div className={`rounded-lg p-3 ${
                  message.user_id === user?.id 
                    ? 'bg-blue-100 ml-auto' 
                    : 'bg-gray-100'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-shrink-0 p-4 bg-gray-50">
        <form 
          onSubmit={handleSendMessage}
          className="flex w-full items-center space-x-2"
        >
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  );
}

export default ChatWindow;