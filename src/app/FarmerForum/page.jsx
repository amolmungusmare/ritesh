import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  MessageSquare,
  ThumbsUp,
  PlusCircle,
  Search,
  Loader2,
  Leaf,
  TrendingUp,
  Cloud,
  CreditCard,
  Shield,
  Wrench,
  Filter,
  Send
} from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Posts', icon: Filter },
  { id: 'Crop_Advice', name: 'Crop Advice', icon: Leaf },
  { id: 'Market_Prices', name: 'Market Prices', icon: TrendingUp },
  { id: 'Weather', name: 'Weather', icon: Cloud },
  { id: 'Loans', name: 'Loans', icon: CreditCard },
  { id: 'Insurance', name: 'Insurance', icon: Shield },
  { id: 'Equipment', name: 'Equipment', icon: Wrench }
];

export default function FarmerForum({ language = 'english', t = {} }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'Crop_Advice' });

  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['forumPosts'],
    queryFn: () => base44.entities.ForumPost.list('-created_date', 50)
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ForumPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['forumPosts']);
      setIsDialogOpen(false);
      setNewPost({ title: '', content: '', category: 'Crop_Advice' });
    }
  });

  const likeMutation = useMutation({
    mutationFn: ({ id, likes }) => base44.entities.ForumPost.update(id, { likes: (likes || 0) + 1 }),
    onSuccess: () => queryClient.invalidateQueries(['forumPosts'])
  });

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    
    createMutation.mutate({
      ...newPost,
      author_name: 'Farmer',
      likes: 0,
      replies: [],
      language
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category) => {
    const colors = {
      Crop_Advice: 'bg-green-100 text-green-700',
      Market_Prices: 'bg-blue-100 text-blue-700',
      Weather: 'bg-cyan-100 text-cyan-700',
      Loans: 'bg-purple-100 text-purple-700',
      Insurance: 'bg-orange-100 text-orange-700',
      Equipment: 'bg-gray-100 text-gray-700',
      General: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors.General;
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0033A0] to-[#C01589] flex items-center justify-center shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t.forum || 'Farmer Forum'}</h1>
            <p className="text-sm text-gray-500">Connect and share with fellow farmers</p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#C01589] hover:bg-[#A01270] gap-2">
              <PlusCircle className="w-4 h-4" /> New Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Input
                  placeholder="Post title..."
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
              </div>
              <div>
                <Select 
                  value={newPost.category} 
                  onValueChange={(v) => setNewPost({ ...newPost, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Textarea
                  placeholder="Share your question or knowledge..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={5}
                />
              </div>
              <Button 
                onClick={handleCreatePost}
                disabled={createMutation.isPending}
                className="w-full bg-[#C01589] hover:bg-[#A01270] gap-2"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="overflow-x-auto">
              <TabsList className="bg-gray-100">
                {categories.slice(0, 5).map(cat => (
                  <TabsTrigger key={cat.id} value={cat.id} className="text-xs gap-1">
                    <cat.icon className="w-3 h-3" />
                    {cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#C01589]" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No posts yet</h3>
          <p className="text-gray-500 mb-4">Be the first to start a discussion!</p>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#C01589] hover:bg-[#A01270] gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Create Post
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getCategoryColor(post.category)}>
                          {post.category?.replace(/_/g, ' ')}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(post.created_date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">{post.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-3">{post.content}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <span className="text-xs text-gray-500">By {post.author_name || 'Farmer'}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => likeMutation.mutate({ id: post.id, likes: post.likes })}
                          className="gap-1 text-gray-500 hover:text-[#C01589]"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          {post.likes || 0}
                        </Button>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {post.replies?.length || 0} replies
                        </span>
                      </div>
                    </div>
                    {post.image_url && (
                      <img 
                        src={post.image_url} 
                        alt="" 
                        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}