import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { base44 } from '@/api/base44Client';
import ImageUploader from '@/components/common/ImageUploader';
import ReactMarkdown from 'react-markdown';
import { 
  Send, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  Loader2, 
  Bot, 
  User,
  Leaf,
  Bug,
  Cloud,
  TrendingUp,
  HelpCircle,
  X
} from 'lucide-react';

const quickPrompts = [
  { icon: Bug, text: 'Identify pest in my crop', color: 'text-red-500' },
  { icon: Cloud, text: 'Weather advisory for sowing', color: 'text-blue-500' },
  { icon: TrendingUp, text: 'Current mandi prices', color: 'text-green-500' },
  { icon: Leaf, text: 'Fertilizer recommendations', color: 'text-orange-500' }
];

export default function AgriMitra({ language = 'english', t = {} }) {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: getGreeting(language)
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const scrollRef = useRef(null);

  function getGreeting(lang) {
    const greetings = {
      english: "🙏 Namaste! I'm **Agri Mitra**, your 24/7 digital agricultural advisor from TMB Bank. I can help you with:\n\n• 🐛 Pest & disease identification from photos\n• 🌤️ Weather-based farming advice\n• 💰 Current market (mandi) prices\n• 🌱 Crop recommendations\n• 💳 Loan & insurance guidance\n\nHow can I assist you today?",
      hindi: "🙏 नमस्ते! मैं **एग्री मित्र** हूं, TMB बैंक से आपका 24/7 डिजिटल कृषि सलाहकार। मैं आपकी मदद कर सकता हूं:\n\n• 🐛 फोटो से कीट और रोग पहचान\n• 🌤️ मौसम आधारित खेती सलाह\n• 💰 वर्तमान मंडी भाव\n• 🌱 फसल सिफारिशें\n• 💳 ऋण और बीमा मार्गदर्शन\n\nआज मैं आपकी कैसे मदद कर सकता हूं?",
      marathi: "🙏 नमस्कार! मी **एग्री मित्र** आहे, TMB बँकेचा तुमचा 24/7 डिजिटल कृषी सल्लागार। मी तुम्हाला मदत करू शकतो:\n\n• 🐛 फोटोवरून कीड आणि रोग ओळख\n• 🌤️ हवामान आधारित शेती सल्ला\n• 💰 सध्याचे बाजारभाव\n• 🌱 पीक शिफारसी\n• 💳 कर्ज आणि विमा मार्गदर्शन\n\nआज मी तुमची कशी मदत करू शकतो?"
    };
    return greetings[lang] || greetings.english;
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text = input, imageUrl = uploadedImage) => {
    if (!text.trim() && !imageUrl) return;

    const userMessage = { 
      role: 'user', 
      content: text,
      image: imageUrl 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setUploadedImage(null);
    setShowImageUpload(false);
    setIsLoading(true);

    try {
      const systemPrompt = `You are Agri Mitra, a knowledgeable agricultural advisor for TMB Bank's AgriSmart platform. 
      You help Indian farmers with:
      - Pest and disease identification from images
      - Weather-based sowing and harvesting advice
      - Current market/mandi prices (provide realistic estimates)
      - Fertilizer and pesticide recommendations
      - Loan products guidance from TMB Bank
      - Crop insurance (PMFBY) information
      
      Respond in ${language} language. Be helpful, friendly, and practical. 
      For pest/disease identification, provide specific treatment recommendations.
      For prices, provide realistic ranges for common crops in Indian markets.
      Always encourage sustainable farming practices.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nUser query: ${text}`,
        file_urls: imageUrl ? [imageUrl] : undefined,
        add_context_from_internet: true
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
    sendMessage(prompt);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695cce0ff2398c4e3069fe74/ba681f103_Screenshot_20260105-185413.jpg"
          alt="TMB Bank"
          className="h-16 object-contain mb-4"
        />
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C01589] to-[#0033A0] flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{t.agriMitra || 'Agri Mitra'}</h1>
        </div>
        <p className="text-sm text-gray-500">Your 24/7 Digital Agricultural Advisor</p>
      </div>

      {/* Chat Container */}
      <Card className="h-[calc(100vh-280px)] lg:h-[600px] flex flex-col overflow-hidden">
        {/* Messages */}
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C01589] to-[#0033A0] flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-[#0033A0] to-[#C01589] text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {msg.image && (
                      <img src={msg.image} alt="Uploaded" className="rounded-lg mb-2 max-h-48 object-cover" />
                    )}
                    <ReactMarkdown className="prose prose-sm max-w-none [&_p]:mb-2 [&_ul]:ml-4 [&_li]:mb-1">
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C01589] to-[#0033A0] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-4">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="p-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt(prompt.text)}
                  className="gap-2 text-xs"
                >
                  <prompt.icon className={`w-3 h-3 ${prompt.color}`} />
                  {prompt.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Image Upload Preview */}
        {showImageUpload && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Upload Image</span>
              <Button variant="ghost" size="sm" onClick={() => setShowImageUpload(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <ImageUploader 
              onImageUpload={(url) => {
                setUploadedImage(url);
                setShowImageUpload(false);
              }}
              imageUrl={uploadedImage}
              onClear={() => setUploadedImage(null)}
            />
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 bg-white">
          {uploadedImage && (
            <div className="mb-2 relative inline-block">
              <img src={uploadedImage} alt="To send" className="h-16 rounded-lg" />
              <Button 
                size="icon" 
                variant="destructive" 
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                onClick={() => setUploadedImage(null)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowImageUpload(!showImageUpload)}
              className="flex-shrink-0"
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsRecording(!isRecording)}
              className={`flex-shrink-0 ${isRecording ? 'bg-red-100 text-red-600 border-red-300' : ''}`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your question or speak..."
              className="flex-1"
            />
            <Button 
              onClick={() => sendMessage()}
              disabled={isLoading || (!input.trim() && !uploadedImage)}
              className="bg-gradient-to-r from-[#C01589] to-[#0033A0] hover:opacity-90 flex-shrink-0"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}