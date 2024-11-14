"use client"

import React, { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@clerk/nextjs"
import { useParams } from 'next/navigation'
import { supabaseClient } from '@/lib/database/supabase/client'
import { toast } from "sonner"
import { analyzeMessages } from '@/lib/actions/metric.actions'
import AudioInput from '@/components/discussion/AudioInput'

import type { Message, ChatWindowProps } from '@/types'

function ChatWindow({ groupId }: ChatWindowProps) {
  const { sessionId } = useParams();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<number>(Date.now());
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const currentSessionId = Array.isArray(sessionId) ? sessionId[0] : sessionId;

  // Metrics analysis effect
  useEffect(() => {
    if (!groupId || !sessionId || !user) return;
  
    const analyzeInterval = setInterval(async () => {
      try {
        // Get messages since last analysis
        const recentMessages = messages.filter(
          msg => new Date(msg.created_at).getTime() > lastAnalysisTime
        );
  
        if (recentMessages.length > 0) {
          console.log('Starting analysis for messages:', recentMessages);
          console.log('Analysis timeframe:', new Date(lastAnalysisTime).toLocaleTimeString(), 'to', new Date().toLocaleTimeString());
  
          const analysisStart = performance.now();
          const results = await analyzeMessages(recentMessages, sessionId as string, groupId);
          const analysisEnd = performance.now();
  
          console.log('Analysis results:', results);
          console.log(`Analysis took ${(analysisEnd - analysisStart).toFixed(2)}ms`);
          
          setLastAnalysisTime(Date.now());
        } else {
          console.log('No new messages to analyze since:', new Date(lastAnalysisTime).toLocaleTimeString());
        }
      } catch (error) {
        console.error('Error analyzing messages:', {
          error,
          messages: messages.length,
          lastAnalysis: new Date(lastAnalysisTime).toLocaleTimeString(),
        });
      }
    }, 10000);
  
    return () => clearInterval(analyzeInterval);
  }, [groupId, sessionId, messages, lastAnalysisTime, user]);

  // Message fetching and subscription effect
  useEffect(() => {
    if (!groupId || !user) return;

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
  }, [groupId, user]);

  const handleSendMessage = async (messageContent: string) => {
    if (!user || !messageContent.trim()) return;

    try {
      const { error } = await supabaseClient
        .from('messages')
        .insert({
          group_id: groupId,
          user_id: user.id,
          username: user.username || 'Anonymous',
          content: messageContent.trim(),
          audio_url: null
        });

      if (error) throw error;
      
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(newMessage);
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  if (loading) {
    return (
      <Card className="w-full h-[90vh] flex items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin" />
      </Card>
    );
  }

  const shouldGroupMessage = (currentMsg: Message, prevMsg: Message | null) => {
    if (!prevMsg) return false;
    return currentMsg.user_id === prevMsg.user_id && 
           new Date(currentMsg.created_at).getTime() - new Date(prevMsg.created_at).getTime() < 60000;
  };

  return (
    <Card className="w-full h-[90vh] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-2xl text-center">Group Chat</CardTitle>
        <Separator/>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0" ref={scrollAreaRef}>
        <ScrollArea className="h-full px-4">
          {messages.map((message, index) => {
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const isGrouped = shouldGroupMessage(message, prevMessage);
            const isCurrentUser = message.user_id === user?.id;
            const showTimestamp = !isGrouped || index === messages.length - 1;
            
            return (
              <div key={message.id} className="mb-4">
                <div className={`flex items-start gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  {!isCurrentUser && (
                    <div className={`flex-shrink-0 ${isGrouped ? 'invisible' : ''} mt-6`}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={message.username} />
                        <AvatarFallback className="text-xs">{message.username[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[65%]`}>
                    {!isGrouped && (
                      <span className="text-xs font-medium text-gray-500 mb-1">
                        {message.username}
                      </span>
                    )}
                    <div
                      className={`inline-block px-4 py-2 
                        ${isCurrentUser 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                        }
                        ${isGrouped 
                          ? 'rounded-2xl' 
                          : isCurrentUser
                            ? 'rounded-t-2xl rounded-l-2xl rounded-br-md' 
                            : 'rounded-t-2xl rounded-r-2xl rounded-bl-md'
                        }
                      `}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                    {showTimestamp && (
                      <span className="text-[11px] text-gray-400 mt-1">
                        {new Date(message.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    )}
                  </div>
                  {isCurrentUser && (
                    <div className={`flex-shrink-0 ${isGrouped ? 'invisible' : ''} mt-6`}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={message.username} />
                        <AvatarFallback className="text-xs">{message.username[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-shrink-0 p-4 bg-gray-50">
        <form 
          onSubmit={handleFormSubmit}
          className="flex w-full items-center space-x-2"
        >
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
           {user && currentSessionId ? (
            <AudioInput
              onMessageSubmit={handleSendMessage}
              googleApiKey={process.env.NEXT_PUBLIC_GOOGLE_SPEECH_API_KEY || ''}
              googleEndpoint={process.env.NEXT_PUBLIC_GOOGLE_SPEECH_ENDPOINT || ''}
              userId={user.id}
              sessionId={currentSessionId}
            />
          ) : null}
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  );
}

export default ChatWindow;