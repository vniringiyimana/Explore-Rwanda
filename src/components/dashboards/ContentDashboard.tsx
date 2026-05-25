import React, { useState } from 'react';
import { 
  Lock, 
  FileText, 
  Image as ImageIcon, 
  Send, 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  BookOpen, 
  Copy, 
  CheckCircle, 
  AlertTriangle, 
  BarChart2, 
  Layers, 
  Eye,
  Camera,
  Heart,
  Grid,
  Filter,
  Check,
  XCircle
} from 'lucide-react';
import { DashboardProps, UserRole } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { MASTER_EMAIL } from '../../constants';

interface StoryDraft {
  id: string;
  title: string;
  category: string;
  author: string;
  status: 'Draft' | 'Review' | 'Published';
  content: string;
  reads: number;
  lastUpdated: string;
  tags: string[];
}

interface MediaAsset {
  id: string;
  title: string;
  category: 'City' | 'Wildlife' | 'Culture' | 'Landscape';
  url: string;
  resolution: string;
  size: string;
  author: string;
  downloads: number;
}

export default function ContentDashboard({ activeTab, user, bookings }: DashboardProps) {
  const isMaster = user.email.toLowerCase() === MASTER_EMAIL.toLowerCase();

  if (user.role !== UserRole.EDITOR && !isMaster) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 glass rounded-[3rem] border border-blue-500/20">
        <Lock size={48} className="text-blue-500 mb-6" />
        <h2 className="text-2xl font-display font-bold text-white mb-4">Content Workspace Restricted</h2>
        <p className="text-white/40 max-w-sm italic">
          "The Story Bank and Visual Assets are reserved for authorized content editors. Please contact the communications department for clearance."
        </p>
      </div>
    );
  }

  const isAdmin = isMaster;
  
  // Backdrops slideshow
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    'https://images.unsplash.com/photo-1540206276207-3f2439c50400?auto=format&fit=crop&q=80', // Street culture
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80', // Wildlife
    'https://images.unsplash.com/photo-1542113300-474be6f89073?auto=format&fit=crop&q=80', // Landscapes
  ];

  // Story state
  const [stories, setStories] = useState<StoryDraft[]>([
    {
      id: 'ST-101',
      title: 'The Ultimate Guide to Lake Kivu Resorts',
      category: 'Destinations',
      author: 'Jean-Luc K.',
      status: 'Published',
      content: 'Lake Kivu, one of the African Great Lakes, lies on the border between the Democratic Republic of the Congo and Rwanda. It is renown for spectacular sunrises, vibrant lakeside communities, kayaking, and luxurious resorts in Rubavu and Karongi.',
      reads: 3240,
      lastUpdated: '2 hours ago',
      tags: ['lake kivu', 'accommodation', 'kayaking']
    },
    {
      id: 'ST-102',
      title: 'Chimpanzee Trekking in Nyungwe National Park',
      category: 'Adventure',
      author: 'Sarah J.',
      status: 'Review',
      content: 'Walking amongst giant mahogany trees and listening to wild chimpanzees is a life-altering experience. This guide lists the best trails, gear requirements, and permit guides for travelers seeking a thrill.',
      reads: 1104,
      lastUpdated: '4 hours ago',
      tags: ['nyungwe', 'wildlife', 'trekking']
    },
    {
      id: 'ST-103',
      title: '10 Hidden Gastronomy Gems in Kigali',
      category: 'Culinary',
      author: 'Alex M.',
      status: 'Draft',
      content: 'Kigali’s food scene is booming, transitioning from traditional Rwandan brochettes to world-class fusion experiences. We uncover ten spots that tourists frequently miss but locals absolutely cherish.',
      reads: 0,
      lastUpdated: 'Just now',
      tags: ['kigali', 'food', 'restaurants']
    }
  ]);

  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('Destinations');
  const [blogContent, setBlogContent] = useState('');
  const [blogTags, setBlogTags] = useState('');
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [storyFilter, setStoryFilter] = useState<'All' | 'Draft' | 'Review' | 'Published'>('All');

  // Media assets state
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([
    { id: 'M-201', title: 'Kigali Convention Centre Night view', category: 'City', url: 'https://images.unsplash.com/photo-1620336655174-32da930514a6?auto=format&fit=crop&q=80', resolution: '4096 x 2730', size: '3.4 MB', author: 'Olivier N.', downloads: 412 },
    { id: 'M-202', title: 'Mountain Gorillas of Volcanoes Park', category: 'Wildlife', url: 'https://images.unsplash.com/photo-1578330132822-01be60c679a6?auto=format&fit=crop&q=80', resolution: '3840 x 2400', size: '4.8 MB', author: 'Emmanuel T.', downloads: 824 },
    { id: 'M-203', title: 'Intore Cultural Celebration Dance', category: 'Culture', url: 'https://images.unsplash.com/photo-1540206276207-3f2439c50400?auto=format&fit=crop&q=80', resolution: '4200 x 2800', size: '2.9 MB', author: 'Keza C.', downloads: 198 },
    { id: 'M-204', title: 'Sabyinyo Volcano Twin Lakes Landscape', category: 'Landscape', url: 'https://images.unsplash.com/photo-1542113300-474be6f89073?auto=format&fit=crop&q=80', resolution: '3900 x 2600', size: '5.1 MB', author: 'Fiona M.', downloads: 531 }
  ]);
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<'All' | 'City' | 'Wildlife' | 'Culture' | 'Landscape'>('All');
  const [copiedAssetId, setCopiedAssetId] = useState<string | null>(null);
  const [simulateUploadOpen, setSimulateUploadOpen] = useState(false);
  const [fakeFileTitle, setFakeFileTitle] = useState('');
  const [fakeFileCategory, setFakeFileCategory] = useState<'City' | 'Wildlife' | 'Culture' | 'Landscape'>('City');

  // SEO evaluator state
  const [seoTargetKeyword, setSeoTargetKeyword] = useState('Gorilla');
  const [seoArticleTitle, setSeoArticleTitle] = useState('Guide to Mountain Gorilla Trekking and Permits');
  const [seoArticleBody, setSeoArticleBody] = useState('We provide the complete outline for booking gorilla passes in Musanze. Gorilla encounters require early booking. Always hire an experienced local tracker.');

  // Handle Toast dispatch
  const toast = (msg: string) => {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: msg }));
  };

  // Blog CRUD
  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogContent.trim()) {
      toast("Please fill in Title and Content fields.");
      return;
    }

    const tagsArray = blogTags.split(',').map(t => t.trim().toLowerCase()).filter(t => t !== '');

    if (editingStoryId) {
      setStories(prev => prev.map(s => s.id === editingStoryId ? {
        ...s,
        title: blogTitle,
        category: blogCategory,
        content: blogContent,
        tags: tagsArray,
        lastUpdated: 'Updated just now'
      } : s));
      toast("Story draft updated successfully.");
      setEditingStoryId(null);
    } else {
      const newStory: StoryDraft = {
        id: `ST-${Math.floor(Math.random() * 900) + 100}`,
        title: blogTitle,
        category: blogCategory,
        author: user.name,
        status: 'Draft',
        content: blogContent,
        reads: 0,
        lastUpdated: 'Created just now',
        tags: tagsArray
      };
      setStories(prev => [newStory, ...prev]);
      toast("New story draft created and saved to Story Bank.");
    }

    setBlogTitle('');
    setBlogContent('');
    setBlogTags('');
  };

  const editStory = (story: StoryDraft) => {
    setEditingStoryId(story.id);
    setBlogTitle(story.title);
    setBlogCategory(story.category);
    setBlogContent(story.content);
    setBlogTags(story.tags.join(', '));
  };

  const deleteStory = (storyId: string) => {
    if (confirm("Are you sure you want to discard this story draft?")) {
      setStories(prev => prev.filter(s => s.id !== storyId));
      toast("Story draft dismissed.");
    }
  };

  const changeStoryStatus = (storyId: string, newStatus: 'Draft' | 'Review' | 'Published') => {
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, status: newStatus, lastUpdated: 'Status changed just now' } : s));
    toast(`Story moved to ${newStatus.toUpperCase()}`);
  };

  // Media Management
  const handleFakeUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fakeFileTitle.trim()) {
      toast("Please specify a title for the raw image asset.");
      return;
    }

    const randomImages = [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540206276207-3f2439c50400?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542113300-474be6f89073?auto=format&fit=crop&q=80'
    ];
    const pickedUrl = randomImages[Math.floor(Math.random() * randomImages.length)];

    const newAsset: MediaAsset = {
      id: `M-${Math.floor(Math.random() * 900) + 200}`,
      title: fakeFileTitle,
      category: fakeFileCategory,
      url: pickedUrl,
      resolution: '5120 x 3413',
      size: '5.2 MB',
      author: user.name,
      downloads: 0
    };

    setMediaAssets(prev => [newAsset, ...prev]);
    toast("High-resolution visual asset indexed in Rwanda media bank!");
    setFakeFileTitle('');
    setSimulateUploadOpen(false);
  };

  const copyAssetUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedAssetId(id);
    toast("Asset URL copied to clipboard for CDN usage!");
    setTimeout(() => setCopiedAssetId(null), 2000);
  };

  // Interactive SEO Score Calculator
  const getSeoMetrics = () => {
    let score = 30;
    const errors: string[] = [];
    const successes: string[] = [];

    if (!seoTargetKeyword.trim()) {
      return { score: 0, errors: ['No focus keyword designated.'], successes: [] };
    }

    const kw = seoTargetKeyword.toLowerCase();
    const title = seoArticleTitle.toLowerCase();
    const body = seoArticleBody.toLowerCase();

    // Check title length
    if (seoArticleTitle.length > 30 && seoArticleTitle.length < 65) {
      score += 20;
      successes.push("Title length is optimal for web click-through-rates.");
    } else {
      errors.push("Title is either too short or excessively long for Google snippets.");
    }

    // Keyword in title
    if (title.includes(kw)) {
      score += 20;
      successes.push(`Found Focus Keyword "${seoTargetKeyword}" in title header.`);
    } else {
      errors.push(`Place the primary Keyword "${seoTargetKeyword}" inside your Title.`);
    }

    // Keyword in body
    const matches = (body.match(new RegExp(kw, 'g')) || []).length;
    if (matches > 0) {
      score += 20;
      if (matches >= 2 && matches <= 4) {
        score += 10;
        successes.push(`Optimal target keyword density reached (${matches} occurrences).`);
      } else if (matches > 4) {
        errors.push(`Keyword usage is excessively high (${matches} times). Risk of keyword stuffing algorithms.`);
      } else {
        successes.push(`Keyword cited correctly ${matches} times.`);
      }
    } else {
      errors.push(`Primary keyword "${seoTargetKeyword}" is absent from your article's first paragraph.`);
    }

    // Word counts
    const words = seoArticleBody.split(/\s+/).filter(w => w.length > 0).length;
    if (words > 20) {
      score += 10;
      successes.push("Content meets a good initial semantic length threshold.");
    } else {
      errors.push("Write a longer descriptive content body to bypass thin content triggers.");
    }

    return { 
      score: Math.min(100, score), 
      errors, 
      successes 
    };
  };

  const { score: seoScore, errors: seoErrors, successes: seoSuccesses } = getSeoMetrics();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative min-h-[80vh] pt-4">
      {/* Background Slideshow */}
      <div className="absolute inset-0 -top-8 -mx-10 rounded-[4rem] overflow-hidden -z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 5, ease: "easeOut" }}
            onAnimationComplete={() => setTimeout(() => setCurrentImage((currentImage + 1) % images.length), 11000)}
            className="absolute inset-0"
          >
            <img src={images[currentImage]} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-transparent to-forest-950" />
          </motion.div>
        </AnimatePresence>
      </div>

      {isAdmin && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-[2rem] p-4 flex items-center justify-between shadow-lg shadow-blue-500/5">
          <div className="flex items-center gap-3 ml-4">
            <ShieldCheck className="text-blue-400 animate-pulse" size={20} />
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Global Content Override Active (Admin privs)</span>
          </div>
          <button 
            onClick={() => {
              setStoryFilter('All');
              toast("Full Content logs exposed to Admin Review Desk.");
            }} 
            className="px-4 py-2 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 transition-all cursor-pointer active:scale-95 animate-pulse"
          >
            Review All Drafts
          </button>
        </div>
      )}

      {/* RENDER DYNAMIC TAB SECTION */}
      {(!activeTab || activeTab === 'overview') && (
        <div className="space-y-8">
          {/* General Statistic Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Indexed Stories', value: stories.length.toString(), icon: FileText, color: 'text-blue-400' },
              { label: 'Average SEO', value: '92/100', icon: Sparkles, color: 'text-gold-400' },
              { label: 'Weekly Active Reads', value: '48.9k', icon: Globe, color: 'text-green-400' },
              { label: 'Shared Assets', value: `${mediaAssets.length} Files`, icon: ImageIcon, color: 'text-purple-400' },
            ].map((stat, idx) => (
              <div key={idx} className="glass rounded-[2rem] p-6 border border-white/5 relative group hover:border-white/15 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <stat.icon size={32} />
                </div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-display font-bold text-white">{stat.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Box: Latest Drafts Summary */}
            <div className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-3">
                  <FileText className="text-blue-400" size={20} /> Editorial Queue
                </h3>
                <span className="text-[9px] text-white/40 uppercase font-black tracking-widest bg-white/5 px-2.5 py-1 rounded-full">
                  Recent Work
                </span>
              </div>
              
              <div className="space-y-4">
                {stories.slice(0, 3).map((post) => (
                  <div key={post.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors">{post.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] text-white/30 uppercase tracking-widest">By {post.author}</span>
                        <span className="w-1 h-1 rounded-full bg-white/25" />
                        <span className="text-[8px] text-gold-400 font-mono">{post.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        post.status === 'Published' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : post.status === 'Review' 
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                          : 'bg-white/10 text-white/50'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-[11px] text-white/30 italic text-center">
                Access "Story Bank" tab from the sidebar to create, edit, or publish articles!
              </p>
            </div>

            {/* Right Box: Global Translation Matrix */}
            <div className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-6">
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-3">
                <Globe className="text-green-400" size={20} /> Localization Progress
              </h3>
              <p className="text-xs text-white/40 italic">
                Our main target is keeping all tourist articles translated perfectly for regional visitor cohorts.
              </p>
              
              <div className="space-y-4">
                 {[
                   { lang: 'English (US)', progress: '100%', count: '24 articles verified' },
                   { lang: 'French (EU)', progress: '85%', count: '20 articles verified' },
                   { lang: 'Kinyarwanda (Local)', progress: '94%', count: '22 articles verified' },
                   { lang: 'Swahili (East Africa)', progress: '72%', count: '17 articles verified' }
                 ].map(item => (
                   <div key={item.lang} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                     <div className="flex justify-between items-center mb-1.5">
                       <span className="text-xs font-bold text-white/80">{item.lang}</span>
                       <span className="text-[9.5px] font-mono font-black text-gold-400">{item.progress} ready</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: item.progress }}
                         transition={{ duration: 1, ease: "easeOut" }}
                         className="h-full bg-gradient-to-r from-gold-500 to-amber-500" 
                       />
                     </div>
                     <span className="text-[8px] text-white/20 uppercase tracking-widest font-bold mt-1 block">{item.count}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          <div className="glass rounded-[2.5rem] p-12 border border-white/5 flex flex-col items-center text-center">
            <Sparkles size={48} className="text-gold-500/20 mb-6 animate-pulse" />
            <h3 className="text-xl font-bold text-white mb-2">Workspace Guidelines</h3>
            <p className="text-sm text-white/40 italic max-w-sm leading-relaxed">
              "We emphasize authentic storytelling, high-contrast visual media selections, and clear SEO directives. Use the sidebar tabs to write, manage CDN assets, or optimize indexing metadata."
            </p>
          </div>
        </div>
      )}

      {activeTab === 'blog' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Composer (Left col 5) */}
          <div className="lg:col-span-5 glass rounded-[2.5rem] p-8 border border-white/5 h-fit space-y-6">
            <div>
              <h3 className="font-display text-xl font-bold text-white">
                {editingStoryId ? 'Modify Story Draft' : 'Create High-Impact Draft'}
              </h3>
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Publisher Sandbox</p>
            </div>

            <form onSubmit={handleSaveStory} className="space-y-4">
              <div>
                <label className="text-[9px] font-black uppercase text-white/30 tracking-widest block mb-1.5">Focus Section / Category</label>
                <select 
                  value={blogCategory}
                  onChange={(e) => setBlogCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-gold-500 transition-colors"
                >
                  <option value="Destinations">🌆 Attractions & Safaris</option>
                  <option value="Adventure">🦍 Wildlife Trails</option>
                  <option value="Culinary">🍲 Restaurants & Gastronomy</option>
                  <option value="Culture">🥁 Local Traditions & Festivals</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-white/30 tracking-widest block mb-1.5">Article Headline Title</label>
                <input 
                  type="text" 
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  placeholder="e.g. Hiking Bisoke Twin Volcanoes"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 font-bold focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-white/30 tracking-widest block mb-1.5">Draft Content Body</label>
                <textarea 
                  rows={6}
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder="Begin drafting the story layout..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 leading-relaxed font-semibold focus:outline-none focus:border-gold-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-white/30 tracking-widest block mb-1.5">Tags (Comma separated)</label>
                <input 
                  type="text" 
                  value={blogTags}
                  onChange={(e) => setBlogTags(e.target.value)}
                  placeholder="kigali, nature, gorillas, food"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-gold-400 placeholder-white/20 font-mono focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-gold-500 hover:bg-gold-400 text-forest-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-gold-500/15 active:scale-95 transition-all cursor-pointer"
                >
                  {editingStoryId ? 'Update Draft' : 'Save as Draft'}
                </button>
                {editingStoryId && (
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingStoryId(null);
                      setBlogTitle('');
                      setBlogContent('');
                      setBlogTags('');
                      toast("Draft editing aborted.");
                    }}
                    className="px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List Database (Right col 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-display text-2xl font-bold text-white flex items-center gap-3">
                  <BookOpen className="text-gold-500" /> Story Bank Index
                </h3>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mt-1">
                  Manage digital coverage of Rwanda
                </p>
              </div>

              {/* Status filter tabs */}
              <div className="flex gap-1.5 p-1 bg-white/5 rounded-xl border border-white/5">
                {['All', 'Draft', 'Review', 'Published'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStoryFilter(st as any)}
                    className={`px-3 py-1.5 rounded-lg text-[8.5px] font-black uppercase tracking-widest transition-all ${
                      storyFilter === st 
                        ? 'bg-gold-500 text-forest-900 shadow-md shadow-gold-500/10' 
                        : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Stories matching filters */}
            <div className="space-y-4">
              {stories
                .filter(s => storyFilter === 'All' || s.status === storyFilter)
                .map((story) => (
                  <div key={story.id} className="glass rounded-[2rem] p-6 border border-white/5 relative group hover:border-white/15 transition-all w-full">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div>
                        <span className="text-[8.5px] font-mono font-black text-gold-400 bg-gold-400/5 border border-gold-400/15 px-2 py-0.5 rounded-md">
                          {story.category}
                        </span>
                        <h4 className="text-base font-bold text-white mt-2 group-hover:text-gold-400 transition-colors leading-snug">
                          {story.title}
                        </h4>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => editStory(story)}
                          className="p-1.5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-all cursor-pointer"
                          title="Edit Draft"
                        >
                          <Edit size={13} />
                        </button>
                        <button 
                          onClick={() => deleteStory(story.id)}
                          className="p-1.5 hover:bg-red-500/10 rounded-lg text-white/30 hover:text-red-400 transition-all cursor-pointer"
                          title="Delete Draft"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-white/40 italic line-clamp-3 mb-4 mt-2 leading-relaxed">
                      "{story.content}"
                    </p>

                    <div className="flex flex-wrap gap-1.5 my-3">
                      {story.tags.map(tag => (
                        <span key={tag} className="text-[8px] font-mono bg-white/5 border border-white/5 rounded-full px-2 py-0.5 text-white/30">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/5 text-[9px] uppercase tracking-widest font-black text-white/30">
                      <div className="flex items-center gap-4">
                        <span>By: <span className="text-white font-bold">{story.author}</span></span>
                        <span>Views: <span className="text-emerald-400 font-bold">{story.reads.toLocaleString()}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select 
                          value={story.status}
                          onChange={(e) => changeStoryStatus(story.id, e.target.value as any)}
                          className="bg-forest-950 text-white border border-white/15 text-[8.5px] font-black uppercase text-gold-400 rounded-lg px-2 py-1 cursor-pointer"
                        >
                          <option value="Draft" className="bg-forest-950 text-white">Draft status</option>
                          <option value="Review" className="bg-forest-950 text-white">In Review</option>
                          <option value="Published" className="bg-forest-950 text-white">Published</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'media' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-display text-2xl font-bold text-white flex items-center gap-3">
                <ImageIcon className="text-purple-400" /> Rwandan Visual Assets (CDN)
              </h3>
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">
                Optimized high-res media library for marketing materials
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSimulateUploadOpen(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-600/15"
              >
                <Plus size={12} /> Upload Raw Asset
              </button>
            </div>
          </div>

          {/* Simulate Upload Form Overlay Modal */}
          {simulateUploadOpen && (
            <div className="glass bg-forest-950/95 border border-purple-500/20 rounded-[2.5rem] p-8 max-w-md mx-auto relative animate-in zoom-in-95 duration-200 z-50">
              <button 
                onClick={() => setSimulateUploadOpen(false)}
                className="absolute top-4 right-4 text-white/30 hover:text-white p-1"
                type="button"
              >
                <XCircle size={18} />
              </button>
              <h4 className="text-base font-bold text-white mb-1">Index Raw Asset Visual</h4>
              <p className="text-[9px] uppercase tracking-wider text-white/30 font-black mb-4">Mock Drag-and-Drop Simulator</p>
              
              <form onSubmit={handleFakeUpload} className="space-y-4 font-sans">
                <div>
                  <label className="text-[9px] px-1 uppercase tracking-wider text-white/40 block mb-1">Asset Category</label>
                  <select
                    value={fakeFileCategory}
                    onChange={(e) => setFakeFileCategory(e.target.value as any)}
                    className="w-full bg-forest-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="City" className="bg-forest-950 text-white">🌆 City & Modernity</option>
                    <option value="Wildlife" className="bg-forest-950 text-white">🦍 Fauna & National Parks</option>
                    <option value="Culture" className="bg-forest-950 text-white">🥁 Heritage & Custom ceremonies</option>
                    <option value="Landscape" className="bg-forest-950 text-white">⛰️ Twin Lakes & Hills</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] px-1 uppercase tracking-wider text-white/40 block mb-1">Asset Name / Title</label>
                  <input
                    type="text"
                    required
                    value={fakeFileTitle}
                    onChange={(e) => setFakeFileTitle(e.target.value)}
                    placeholder="e.g. Nyungwe Forest Canopy Walkway HD"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                {/* Fake file selection area */}
                <div className="p-6 border border-dashed border-white/15 bg-white/[0.01] rounded-2xl text-center space-y-2">
                  <Camera size={28} className="mx-auto text-purple-400/50 animate-pulse" />
                  <p className="text-xs font-bold text-white">Drag & Drop Image Here</p>
                  <p className="text-[9px] text-white/20 uppercase tracking-widest font-black">Or, simulate mock binary capture</p>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                  >
                    Index Photographic Asset
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimulateUploadOpen(false)}
                    className="px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] uppercase font-bold text-white/60"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filter Categories and Grid */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
            {['All', 'City', 'Wildlife', 'Culture', 'Landscape'].map((cat) => (
              <button
                key={cat}
                onClick={() => setMediaCategoryFilter(cat as any)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                  mediaCategoryFilter === cat 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaAssets
              .filter(a => mediaCategoryFilter === 'All' || a.category === mediaCategoryFilter)
              .map(asset => (
                <div key={asset.id} className="glass rounded-[2rem] overflow-hidden border border-white/5 group hover:border-purple-500/20 transition-all flex flex-col h-full">
                  <div className="relative aspect-video w-full overflow-hidden bg-forest-950">
                    <img 
                      src={asset.url} 
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 right-2.5 text-[7px] font-mono font-black uppercase bg-purple-600 text-white px-2 py-0.5 rounded-full">
                      {asset.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2 leading-snug">
                        {asset.title}
                      </h4>
                      <p className="text-[8px] text-white/30 uppercase tracking-widest font-bold mt-1">
                        By {asset.author}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="flex justify-between text-[8px] font-mono font-black uppercase text-white/30">
                        <span>Resolution</span>
                        <span className="text-white/60">{asset.resolution}</span>
                      </div>
                      <div className="flex justify-between text-[8px] font-mono font-black uppercase text-white/30">
                        <span>File Size</span>
                        <span className="text-white/60">{asset.size}</span>
                      </div>
                      <div className="flex justify-between text-[8px] font-mono font-black uppercase text-white/30">
                        <span>CDN Downloads</span>
                        <span className="text-purple-400">{asset.downloads} refs</span>
                      </div>
                    </div>

                    <button
                      onClick={() => copyAssetUrl(asset.id, asset.url)}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 group-hover:bg-purple-600/10 border border-white/10 hover:border-purple-500/20 text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-purple-400 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      {copiedAssetId === asset.id ? (
                        <>
                          <Check size={10} className="text-emerald-400" /> Copied CDN!
                        </>
                      ) : (
                        <>
                          <Copy size={10} /> Reference CDN
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === 'seo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Diagnostic variables inputs */}
          <div className="lg:col-span-5 glass rounded-[2.5rem] p-8 border border-white/5 space-y-6">
            <div>
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="text-gold-500" size={18} /> Keyword & Title Inputs
              </h3>
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">
                Evaluation target vars
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black uppercase text-white/30 tracking-widest block mb-1">Target Search Keyword</label>
                <input 
                  type="text"
                  value={seoTargetKeyword}
                  onChange={(e) => setSeoTargetKeyword(e.target.value)}
                  placeholder="e.g. Gorilla"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4.5 py-2.5 text-xs text-gold-400 font-mono focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-white/30 tracking-widest block mb-1">Hypothetical Article Title</label>
                <input 
                  type="text"
                  value={seoArticleTitle}
                  onChange={(e) => setSeoArticleTitle(e.target.value)}
                  placeholder="e.g. Gorilla Lodging and Guides in Rwanda"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-white/30 tracking-widest block mb-1">First Paragraph / Summary</label>
                <textarea 
                  rows={4}
                  value={seoArticleBody}
                  onChange={(e) => setSeoArticleBody(e.target.value)}
                  placeholder="Insert the intro sequence..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4.5 py-3 text-xs text-white/65 leading-relaxed focus:outline-none focus:border-gold-500 transition-colors resize-none"
                />
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">How it works</span>
                <p className="text-[10px] text-white/40 italic leading-normal">
                  Our system evaluates keyword density, heading length rules, search engine placement standards, and index safety checks based on modern Core Web Vitals criteria to prevent algorithmic exclusion.
                </p>
              </div>
            </div>
          </div>

          {/* Audit Results (Right col 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden bg-gradient-to-br from-[#0c2415] to-[#040c07] shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">SEO Health Assessment</h3>
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Live crawling simulation metrics</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest block">Audit Score</span>
                    <span className={`text-2xl font-black font-display font-bold ${
                      seoScore >= 80 
                        ? 'text-emerald-400' 
                        : seoScore >= 50 
                        ? 'text-gold-400' 
                        : 'text-red-400'
                    }`}>
                      {seoScore}%
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-white/5 flex items-center justify-center relative overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-emerald-500 opacity-20 transition-all" 
                      style={{ height: `${seoScore}%` }}
                    />
                    <BarChart2 className="text-emerald-400 relative z-10" size={18} />
                  </div>
                </div>
              </div>

              {/* Success Checklist */}
              <div className="space-y-4">
                <h4 className="text-[9px] text-emerald-400 uppercase tracking-widest font-black flex items-center gap-1.5 border-b border-white/5 pb-2 border-white/10">
                  <CheckCircle size={10} /> Passing Parameters ({seoSuccesses.length})
                </h4>
                {seoSuccesses.length > 0 ? (
                  <div className="space-y-2">
                    {seoSuccesses.map((succ, sIdx) => (
                      <div key={sIdx} className="flex gap-2.5 items-start p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-xs text-white/70">
                        <CheckCircle size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                        <span>{succ}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-white/20 italic">No positive signals analyzed yet.</p>
                )}

                {/* Warnings / Errors */}
                <h4 className="text-[9px] text-red-400 uppercase tracking-widest font-black flex items-center gap-1.5 border-b border-white/5 pb-2 pt-2 border-white/10">
                  <AlertTriangle size={10} /> Dynamic Warnings / Fixes ({seoErrors.length})
                </h4>
                {seoErrors.length > 0 ? (
                  <div className="space-y-2">
                    {seoErrors.map((err, eIdx) => (
                      <div key={eIdx} className="flex gap-2.5 items-start p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-xs text-white/70">
                        <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
                        <span>{err}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-2.5 items-start p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                    <CheckCircle size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span>Brilliant structure. This summary matches clean Google SEO schemas without any issues!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
