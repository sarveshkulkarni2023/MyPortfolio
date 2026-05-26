import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, FaCopy, FaCheck, FaGoogle, FaServer, FaPenNib, 
  FaImage, FaLink, FaRobot, FaClipboardList, FaLightbulb, FaCheckCircle, 
  FaArrowRight, FaTachometerAlt, FaMobileAlt, FaLock, FaGlobe, FaTags
} from 'react-icons/fa';

// Niche resources data for the keyword tool
const nicheData = {
  saas: {
    name: 'AI SaaS & Apps',
    keywords: ['best AI tools 2026', 'AI workflow automation', 'next gen productivity software', 'custom AI chatbots for business'],
    blogIdeas: [
      'How to Automate 90% of Your Daily Tasks Using AI in 2026',
      'The Developer\'s Guide to Building SaaS Platforms That Scale',
      'Why Traditional CRM Systems are Failing and the AI Solution'
    ]
  },
  portfolio: {
    name: 'Developer Portfolio',
    keywords: ['hire full stack developer portfolio', 'react frontend engineer portfolio', 'cybersecurity software engineer', 'hire developer India'],
    blogIdeas: [
      'How I Built a 3D Cyberpunk Portfolio Using React Three Fiber',
      'The 10 Key Skills Every Cybersecurity Developer Needs in 2026',
      'Why Portfolio Performance and Speed are Critical for SEO Rankings'
    ]
  },
  ecommerce: {
    name: 'E-Commerce / Online Shop',
    keywords: ['buy artisanal cakes online', 'personalized gift shop delivery', 'organic skin care products', 'cyberpunk clothing store'],
    blogIdeas: [
      'A Behind-the-Scenes Look at Sustainable Shipping Practices',
      'How We Increased Our Online Shop Conversion Rate by 45%',
      '10 Perfect Gift Ideas for Tech Enthusiasts and Developers'
    ]
  },
  cybersecurity: {
    name: 'Cybersecurity / Tech Services',
    keywords: ['penetration testing services', 'secure code audit agency', 'AI security compliance tool', 'vulnerability assessment'],
    blogIdeas: [
      'Top 5 API Security Vulnerabilities and How to Fix Them',
      'How We Secured a Web3 Application Against Reentrancy Attacks',
      'A Complete Guide to Achieving SOC 2 Compliance for Startups'
    ]
  }
};

export default function SEOGuide() {
  // Navigation sections list
  const sections = [
    { id: 'intro', label: 'Introduction', icon: <FaBookOpenIcon /> },
    { id: 'gsc', label: 'Search Console Setup', icon: <FaGoogle /> },
    { id: 'technical', label: 'Technical SEO', icon: <FaServer /> },
    { id: 'content', label: 'Content SEO', icon: <FaPenNib /> },
    { id: 'image', label: 'Image SEO', icon: <FaImage /> },
    { id: 'backlinks', label: 'Backlinks', icon: <FaLink /> },
    { id: 'modern-ai', label: 'AI Web SEO', icon: <FaRobot /> },
    { id: 'ai-prompt', label: 'AI SEO Prompt', icon: <FaLightbulb /> },
    { id: 'checklist', label: 'SEO Checklist', icon: <FaClipboardList /> }
  ];

  // Active section tracker state
  const [activeSection, setActiveSection] = useState('intro');

  // GSC setup interactive slider state
  const [gscStep, setGscStep] = useState(0);
  const gscSteps = [
    {
      title: 'Open Google Search Console',
      description: 'Navigate to search.google.com/search-console. Sign in with your primary Google account associated with the website.',
      tip: 'Use the same account that you use for Google Analytics to simplify auto-verification later.'
    },
    {
      title: 'Add your Domain or Property',
      description: 'Click "Add property". Select "Domain" for domain-level tracking (recommended, covers all subdomains) or "URL prefix" for specific protocol/subfolders.',
      tip: 'Domain properties are generally preferred as they collect data for both HTTP/HTTPS and www/non-www prefixes.'
    },
    {
      title: 'Verify Ownership',
      description: 'Add a TXT record to your DNS configuration (GoDaddy, Namecheap, Cloudflare, etc.) or upload a verification HTML file to your server\'s root.',
      tip: 'Cloudflare DNS verification completes in seconds and is highly reliable.'
    },
    {
      title: 'Submit your sitemap.xml',
      description: 'Navigate to "Sitemaps" in the left sidebar menu. Enter your sitemap path (usually /sitemap.xml or /sitemap_index.xml) and click "Submit".',
      tip: 'Ensure your sitemap is dynamically generated so new pages are auto-indexed as soon as they go live.'
    },
    {
      title: 'Monitor & Optimize Performance',
      description: 'Wait 24-48 hours. Start tracking search query keywords, organic impressions, clicks, click-through-rates, and page indexing warnings.',
      tip: 'Sort queries by high impressions and low clicks to identify immediate opportunities to improve page titles and meta-descriptions.'
    }
  ];

  // Live SEO score estimator checklist state
  const [scoreChecklist, setScoreChecklist] = useState({
    sitemap: true,
    mobile: true,
    https: true,
    speed: false,
    metadata: true,
    headings: true,
    internal: false,
    images: false
  });

  // Calculate dynamic SEO score
  const scoreItems = Object.keys(scoreChecklist);
  const checkedCount = scoreItems.filter(item => scoreChecklist[item]).length;
  const seoScore = Math.round((checkedCount / scoreItems.length) * 100);

  // Get score metadata
  const getScoreInfo = (score) => {
    if (score === 100) return { label: 'OPTIMIZED', color: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/10', glow: 'shadow-green-500/20' };
    if (score >= 75) return { label: 'GOOD', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/10' };
    if (score >= 50) return { label: 'MODERATE', color: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', glow: 'shadow-yellow-500/10' };
    return { label: 'NEEDS ATTENTION', color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10', glow: 'shadow-red-500/10' };
  };

  const scoreInfo = getScoreInfo(seoScore);

  // SEO Checklist items state
  const [persistentChecklist, setPersistentChecklist] = useState({
    sitemap: false,
    mobile: true,
    https: true,
    speed: false,
    metadata: false,
    headings: true,
    internal: false,
    images: false
  });

  const toggleChecklistItem = (key) => {
    setPersistentChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Keyword / Blog Idea Generator state
  const [selectedNiche, setSelectedNiche] = useState('saas');

  // Copy AI Prompt state
  const [isCopied, setIsCopied] = useState(false);
  const promptText = `You are an advanced SEO analyst, technical SEO engineer, conversion copywriter, semantic search optimizer, and Google ranking specialist.

Analyze my complete website thoroughly.

Tasks:
- Analyze all pages
- Find high-ranking SEO keywords
- Generate SEO optimized headings and content
- Improve semantic relevance
- Suggest internal links
- Suggest schema markup
- Optimize readability
- Detect weak sections
- Improve technical SEO
- Rewrite AI-generic copy
- Generate metadata
- Suggest blog ideas
- Prioritize fixes by impact

Output:
- SEO audit summary
- Critical issues
- Keyword opportunities
- Technical SEO improvements
- Content improvements
- Final SEO score`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(promptText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Track active section as reader scrolls
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <>
      <Helmet>
        <title>Complete Website SEO Guide (2026) | Sarvesh Kulkarni</title>
        <meta 
          name="description" 
          content="A comprehensive guide to ranking your website on Google. Master Search Console verification, modern Technical SEO, semantic content structuring, and AI prompting." 
        />
        <meta property="og:title" content="Complete Website SEO Guide (2026) | Sarvesh Kulkarni" />
        <meta property="og:description" content="Discover how to verify ownership in GSC, optimize site speed, build semantic HTML, and leverage AI models for SEO audits." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-20 bg-cyber-black">
        {/* Subtle grid elements in page header */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-neon-blue/5 via-transparent to-transparent pointer-events-none z-0" />
        
        <div className="section-container relative z-10">
          
          {/* Back button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-mono text-white/40 hover:text-neon-blue transition-colors mb-6 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span>RETURN TO COMMAND CENTER</span>
          </Link>

          {/* Guide Title Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-xs font-mono mb-4 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-ping" />
              SYSTEM RESOURCE // SEO_GUIDE_2026
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight mb-4 leading-tight">
              Complete Website <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple">SEO Guide</span> (2026)
            </h1>
            
            <p className="text-white/60 font-mono text-sm md:text-base max-w-3xl leading-relaxed">
              How to Rank Your Website on Google & Other Search Engines. Complete with modern technical requirements, semantic writing tips, and advanced prompt engineering frameworks.
            </p>
          </motion.div>

          {/* Main Grid Structure */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Sticky TOC */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                
                {/* Scroll Indicator list */}
                <div className="glass-panel border-white/5 p-5">
                  <h3 className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4 flex items-center justify-between">
                    <span>Navigation Index</span>
                    <span className="text-[10px] text-neon-blue">01 // 09</span>
                  </h3>
                  <div className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToId(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-md font-mono text-xs transition-all flex items-center justify-between group ${
                          activeSection === section.id
                            ? 'bg-neon-blue/10 border-l-2 border-neon-blue text-white font-semibold'
                            : 'text-white/40 hover:text-white/80 hover:bg-white/5 border-l-2 border-transparent'
                        }`}
                      >
                        <span className="truncate">{section.label}</span>
                        <FaArrowRight className={`text-[10px] text-neon-blue opacity-0 transition-opacity ${
                          activeSection === section.id ? 'opacity-100' : 'group-hover:opacity-50'
                        }`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Score Widget Card */}
                <div className={`glass-panel border border-white/5 p-5 transition-all duration-500 shadow-lg ${scoreInfo.glow}`}>
                  <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3">SEO Health Score</h3>
                  
                  <div className="flex items-center gap-4">
                    {/* circular progress svg */}
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          className="text-white/5"
                          strokeWidth="4"
                          stroke="currentColor"
                          fill="transparent"
                        />
                        <motion.circle
                          cx="32"
                          cy="32"
                          r="28"
                          className="text-neon-blue"
                          strokeWidth="4"
                          strokeDasharray={175.9}
                          strokeDashoffset={175.9 - (175.9 * seoScore) / 100}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          animate={{ strokeDashoffset: 175.9 - (175.9 * seoScore) / 100 }}
                          transition={{ duration: 0.6 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-white">
                        {seoScore}%
                      </div>
                    </div>

                    <div>
                      <div className={`font-mono text-xs font-bold ${scoreInfo.color}`}>{scoreInfo.label}</div>
                      <div className="text-[10px] text-white/40 mt-0.5">Estimated ranking status based on active checks.</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-white/30 flex justify-between">
                    <span>Checklist items complete:</span>
                    <span>{checkedCount} / {scoreItems.length}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Reading Content Area */}
            <div className="lg:col-span-3 space-y-12">
              
              {/* SECTION: Intro */}
              <section id="intro" className="glass-panel border-white/5 p-6 md:p-8 relative overflow-hidden scroll-mt-24">
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/5 rounded-bl-full pointer-events-none" />
                <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                  Introduction & Fundamentals
                </h2>
                <div className="font-mono text-sm text-white/60 space-y-4 leading-relaxed">
                  <p>
                    Search Engine Optimization (SEO) helps search engines understand, trust, and rank your website higher in organic search results. In 2026, search algorithms look far beyond basic keyword frequency.
                  </p>
                  <p>
                    Search engines have evolved to read websites semantically, evaluate user experience metrics (Core Web Vitals), verify technical credentials, and even ingest information into generative AI search indices. 
                  </p>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-white/80 font-sans text-sm mt-4 flex items-start gap-3">
                    <span className="text-neon-cyan text-lg mt-0.5">ℹ️</span>
                    <div>
                      <h4 className="font-semibold text-white mb-1">What is GSC?</h4>
                      Google Search Console is the single most important diagnostic tool. It acts as the interface between you and Google, showing you exactly how Google crawler (Googlebot) views, crawls, and indexes your pages.
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION: Google Search Console Setup */}
              <section id="gsc" className="glass-panel border-white/5 p-6 md:p-8 scroll-mt-24">
                <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                  Google Search Console Setup Flow
                </h2>
                <p className="font-mono text-xs text-white/40 mb-6 uppercase tracking-wider">Interactive Onboarding Simulator</p>

                {/* Step Content */}
                <div className="bg-cyber-black/40 border border-white/5 rounded-xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-neon-blue uppercase tracking-widest font-bold">Step 0{gscStep + 1} of 05</span>
                    <div className="flex gap-1">
                      {gscSteps.map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2.5 h-1 rounded-full transition-all duration-300 ${
                            i === gscStep ? 'bg-neon-blue w-6' : i < gscStep ? 'bg-neon-cyan/50' : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={gscStep}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      <h3 className="text-lg font-sans font-bold text-white">{gscSteps[gscStep].title}</h3>
                      <p className="font-mono text-sm text-white/60 leading-relaxed">{gscSteps[gscStep].description}</p>
                      
                      <div className="mt-4 p-3 bg-neon-blue/5 border-l-2 border-neon-blue rounded-r-md text-xs font-mono text-neon-cyan">
                        <span className="font-semibold block uppercase mb-1">PRO-TIP:</span>
                        {gscSteps[gscStep].tip}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Step controls */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setGscStep(prev => Math.max(0, prev - 1))}
                    disabled={gscStep === 0}
                    className="px-4 py-2 font-mono text-xs font-semibold text-white/50 hover:text-white border border-white/10 rounded-md disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5 transition-all"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setGscStep(prev => Math.min(gscSteps.length - 1, prev + 1))}
                    disabled={gscStep === gscSteps.length - 1}
                    className="px-4 py-2 font-mono text-xs font-semibold bg-neon-blue text-white rounded-md hover:bg-neon-blue/80 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1.5"
                  >
                    <span>Next Step</span>
                    <FaArrowRight size={10} />
                  </button>
                </div>
              </section>

              {/* SECTION: Technical SEO Essentials */}
              <section id="technical" className="glass-panel border-white/5 p-6 md:p-8 scroll-mt-24">
                <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                  Technical SEO Essentials
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[
                    { title: 'Fast Loading Speed', desc: 'Optimize Core Web Vitals (LCP, INP, CLS) to load under 2 seconds. Google penalizes slow websites.', icon: <FaTachometerAlt className="text-neon-cyan" /> },
                    { title: 'Mobile Responsiveness', desc: 'Use adaptive/responsive layout frameworks. Mobile usability is crucial since Google indexes mobile versions first.', icon: <FaMobileAlt className="text-neon-purple" /> },
                    { title: 'HTTPS Protocols Enabled', desc: 'Secure connection certificates (SSL/TLS) protect users and act as a positive ranking ranking signal.', icon: <FaLock className="text-neon-green" /> },
                    { title: 'Clean Structured URLs', desc: 'Keep hierarchy shallow and use keyword-rich paths, e.g., `/seo-guide` instead of `/p?id=3812`.', icon: <FaGlobe className="text-neon-pink" /> },
                    { title: 'Metadata Configuration', desc: 'Write semantic Title and Meta descriptions for every page. Avoid duplicate tags.', icon: <FaTags className="text-yellow-400" /> },
                    { title: 'Robots.txt & Sitemap', desc: 'Expose a clear `sitemap.xml` for index routing and a configured `robots.txt` to avoid crawler resource waist.', icon: <FaClipboardList className="text-neon-blue" /> }
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-all flex gap-3">
                      <div className="text-lg mt-1">{item.icon}</div>
                      <div>
                        <h4 className="font-sans font-bold text-sm text-white">{item.title}</h4>
                        <p className="font-mono text-xs text-white/55 mt-1 leading-normal">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Score Checklist interactive embed */}
                <div className="bg-neon-blue/5 border border-neon-blue/20 rounded-xl p-5">
                  <h3 className="text-sm font-sans font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-neon-cyan rounded-full animate-ping" />
                    Configure Your Site Checks (Interactive Score Calculator)
                  </h3>
                  <p className="font-mono text-xs text-white/40 mb-4">Select items to estimate your score live in the sidebar</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {scoreItems.map((key) => (
                      <label 
                        key={key} 
                        className="flex items-center gap-3 p-3 bg-cyber-black/50 border border-white/5 rounded-lg cursor-pointer hover:border-neon-blue/40 transition-all"
                      >
                        <input 
                          type="checkbox" 
                          checked={scoreChecklist[key]}
                          onChange={(e) => {
                            setScoreChecklist(prev => ({ ...prev, [key]: e.target.checked }));
                          }}
                          className="w-4 h-4 rounded bg-cyber-black border-white/15 text-neon-blue focus:ring-neon-blue focus:ring-offset-cyber-black"
                        />
                        <span className="font-mono text-xs text-white/70 capitalize">
                          {key === 'sitemap' && 'Sitemap Submitted'}
                          {key === 'mobile' && 'Mobile Optimized'}
                          {key === 'https' && 'HTTPS Enabled'}
                          {key === 'speed' && 'Speed (Load < 2s)'}
                          {key === 'metadata' && 'Page Metadata Added'}
                          {key === 'headings' && 'Heading Order (H1-H3)'}
                          {key === 'internal' && 'Internal Links Placed'}
                          {key === 'images' && 'Images Compressed & Alt Text'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION: Content SEO */}
              <section id="content" className="glass-panel border-white/5 p-6 md:p-8 scroll-mt-24">
                <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                  Content SEO & Writing Strategy
                </h2>
                
                <div className="font-mono text-sm text-white/60 space-y-4 leading-relaxed">
                  <p>
                    Writing high-ranking content starts with understanding <strong>search intent</strong>. Search engines categorize intent into four primary buckets: Informational, Navigational, Commercial, and Transactional. Focus on what users are actually seeking before writing.
                  </p>
                  
                  <div className="border border-white/5 rounded-xl bg-cyber-black/50 overflow-hidden mt-6">
                    <div className="px-4 py-2 border-b border-white/5 bg-white/5 font-bold text-xs text-white uppercase tracking-wider">
                      Content Best Practices Hierarchy
                    </div>
                    <div className="p-4 space-y-3 divide-y divide-white/5">
                      <div className="pb-3">
                        <strong className="text-white block text-sm mb-1">Heading Hierarchy (H1, H2, H3)</strong>
                        <span>Ensure there is strictly one single `H1` tag per page. Use sequential `H2` tags for primary sections and `H3` tags for subsections. Do not skip header levels.</span>
                      </div>
                      <div className="py-3">
                        <strong className="text-white block text-sm mb-1">Semantic Keyword Use</strong>
                        <span>Integrate natural keyword variations instead of repeating the exact query. Search engines use Latent Semantic Indexing (LSI) to understand topic breadth.</span>
                      </div>
                      <div className="pt-3">
                        <strong className="text-white block text-sm mb-1">Internal Link Integrity</strong>
                        <span>Link to related articles using descriptive anchor text instead of "click here" or "read more". This distributes PageRank weight evenly across your domain.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION: Image SEO */}
              <section id="image" className="glass-panel border-white/5 p-6 md:p-8 scroll-mt-24">
                <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                  Image Optimization (Image SEO)
                </h2>
                
                <div className="font-mono text-sm text-white/60 space-y-4 leading-relaxed">
                  <p>
                    Images are often the largest payload files on web pages. Unoptimized media slows loading speed and hampers SEO rankings. Implement these image steps:
                  </p>
                  
                  <ul className="list-none space-y-3 mt-4">
                    <li className="flex items-start gap-2.5">
                      <FaCheckCircle className="text-neon-cyan mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-white font-sans text-sm block">Compression & Modern Formats</strong>
                        Compress all images before upload. Use web-optimized formats like WebP or AVIF instead of raw PNG or JPG format.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FaCheckCircle className="text-neon-cyan mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-white font-sans text-sm block">Descriptive Filenames</strong>
                        Rename files descriptive of their contents (e.g. `google-search-console-setup.webp`) rather than camera hashes (e.g. `IMG_0982.jpg`).
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FaCheckCircle className="text-neon-cyan mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-white font-sans text-sm block">Descriptive ALT Attributes</strong>
                        Write informative `alt` text for images. This ensures search index accessibility and context indexing.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FaCheckCircle className="text-neon-cyan mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-white font-sans text-sm block">Explicit Dimensions & Sizing</strong>
                        Always supply correct aspect ratios or width/height dimensions on layout elements to avoid Layout Shifts (CLS) while loading.
                      </div>
                    </li>
                  </ul>
                </div>
              </section>

              {/* SECTION: Backlinks */}
              <section id="backlinks" className="glass-panel border-white/5 p-6 md:p-8 scroll-mt-24">
                <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                  Building Authority (Backlinks)
                </h2>
                
                <div className="font-mono text-sm text-white/60 space-y-4 leading-relaxed">
                  <p>
                    Backlinks are votes of confidence from external sources. High-authority, contextually relevant backlinks prove to Google that your website is trustworthy.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                      <h4 className="font-sans font-bold text-sm text-white mb-1.5">Value-Driven Content</h4>
                      <p className="text-xs text-white/55 leading-normal">
                        Publish primary research, whitepapers, case studies, or free interactive software calculators. Other sites link naturally to original resources.
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                      <h4 className="font-sans font-bold text-sm text-white mb-1.5">Strategic Launches</h4>
                      <p className="text-xs text-white/55 leading-normal">
                        Launch on platforms like Product Hunt, Devpost, Indie Hackers, or SaaS directories to secure high-authority domain anchors.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION: Modern SEO for AI Websites */}
              <section id="modern-ai" className="glass-panel border-white/5 p-6 md:p-8 scroll-mt-24">
                <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                  Modern SEO for AI Search Engines
                </h2>
                
                <div className="font-mono text-sm text-white/60 space-y-4 leading-relaxed">
                  <p>
                    AI search engines (Perplexity, ChatGPT Search, Gemini) extract answers directly from clean page semantics. If AI scrapers cannot easily parse your layout, your brand won't show up in generative answers.
                  </p>
                  
                  <ul className="list-none space-y-3 mt-4">
                    <li className="flex items-start gap-2.5">
                      <FaCheckCircle className="text-neon-purple mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-white font-sans text-sm block">Avoid Generic AI-generated Copy</strong>
                        Generative crawlers identify repetitive patterns and demote thin text. Rewrite articles to include unique voice, screenshots, and concrete code blocks.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FaCheckCircle className="text-neon-purple mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-white font-sans text-sm block">Focus on Semantic HTML & Accessibility</strong>
                        Use logical tags (`&lt;article&gt;`, `&lt;section&gt;`, `&lt;main&gt;`) instead of unnested nested `&lt;div&gt;` groups. Assist LLM parser parsing.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FaCheckCircle className="text-neon-purple mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-white font-sans text-sm block">Structured Data Schema Markup</strong>
                        Incorporate JSON-LD Schema specifications in HTML headers (e.g. Article, TechArticle, Product schema) to structure key attributes.
                      </div>
                    </li>
                  </ul>
                </div>
              </section>

              {/* SECTION: AI SEO Prompt Tool */}
              <section id="ai-prompt" className="glass-panel border-white/5 p-6 md:p-8 scroll-mt-24">
                <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                  AI SEO Audit Prompt Box
                </h2>
                <p className="font-mono text-xs text-white/40 mb-6 uppercase tracking-wider">Execute this prompt inside Claude, GPT, or Gemini for a full site audit</p>

                {/* IDE Code prompt panel */}
                <div className="relative border border-white/10 rounded-xl bg-cyber-black overflow-hidden font-mono text-xs">
                  {/* editor header */}
                  <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 text-[10px] text-white/40">
                    <span className="flex items-center gap-2 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                      <span className="ml-1 text-white/50">seo_audit_prompt.txt</span>
                    </span>
                    
                    <button
                      onClick={copyToClipboard}
                      className="px-2.5 py-1 bg-white/5 hover:bg-neon-blue/10 border border-white/10 hover:border-neon-blue/40 text-white hover:text-neon-blue rounded transition-all flex items-center gap-1.5"
                    >
                      {isCopied ? (
                        <>
                          <FaCheck size={10} className="text-green-400" />
                          <span className="text-[9px] text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <FaCopy size={10} />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* editor body */}
                  <div className="p-4 overflow-x-auto max-h-[320px] scrollbar-thin text-white/70 leading-relaxed flex gap-3">
                    <div className="text-white/20 select-none text-right border-r border-white/5 pr-3 space-y-1">
                      {Array.from({ length: 28 }).map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    <pre className="whitespace-pre flex-1 text-slate-300">
                      <code>{promptText}</code>
                    </pre>
                  </div>
                </div>

                {/* Niche keywords generator tool */}
                <div className="mt-8 p-5 bg-white/5 border border-white/5 rounded-xl">
                  <h3 className="text-sm font-sans font-bold text-white mb-2 flex items-center gap-2">
                    <FaLightbulb className="text-neon-purple animate-pulse" />
                    Interactive Niche Keyword & Blog Idea generator
                  </h3>
                  <p className="font-mono text-xs text-white/40 mb-4">Select your website niche to generate ideas instantly</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {Object.keys(nicheData).map((key) => (
                      <button
                        key={key}
                        onClick={() => setSelectedNiche(key)}
                        className={`px-3 py-1.5 font-mono text-xs rounded transition-all border ${
                          selectedNiche === key
                            ? 'bg-neon-purple/10 border-neon-purple text-white'
                            : 'bg-cyber-black border-white/5 text-white/50 hover:text-white/80 hover:border-white/10'
                        }`}
                      >
                        {nicheData[key].name}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-cyber-black/60 border border-white/5 rounded-lg">
                      <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-widest font-semibold block mb-2">High-Ranking Target Keywords</span>
                      <ul className="space-y-1.5 font-mono text-xs text-white/70">
                        {nicheData[selectedNiche].keywords.map((kw, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-neon-cyan">•</span>
                            <span>{kw}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-cyber-black/60 border border-white/5 rounded-lg">
                      <span className="text-[10px] font-mono text-neon-purple uppercase tracking-widest font-semibold block mb-2">Suggested Blog Article Ideas</span>
                      <ul className="space-y-1.5 font-mono text-xs text-white/70">
                        {nicheData[selectedNiche].blogIdeas.map((idea, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-neon-purple mt-0.5">💡</span>
                            <span>{idea}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION: SEO Checklist */}
              <section id="checklist" className="glass-panel border-white/5 p-6 md:p-8 scroll-mt-24">
                <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                  Your Custom SEO Checklist
                </h2>
                <p className="font-mono text-xs text-white/40 mb-6 uppercase tracking-wider">Mark items as complete as you optimize your codebase</p>

                {/* Progress bar */}
                <div className="mb-6 bg-white/5 border border-white/5 p-4 rounded-xl">
                  <div className="flex justify-between items-center text-xs font-mono text-white/50 mb-2">
                    <span>Optimization Completion Progress</span>
                    <span className="text-neon-blue font-bold">
                      {Math.round((Object.keys(persistentChecklist).filter(k => persistentChecklist[k]).length / Object.keys(persistentChecklist).length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-cyber-black rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-neon-blue to-neon-purple"
                      animate={{ 
                        width: `${(Object.keys(persistentChecklist).filter(k => persistentChecklist[k]).length / Object.keys(persistentChecklist).length) * 100}%` 
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Interactive Checklist list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { key: 'sitemap', label: 'Sitemap Submitted', desc: 'Confirm sitemap.xml is submitted and verified inside Search Console.' },
                    { key: 'mobile', label: 'Mobile Optimized', desc: 'Confirm pages scale and shift layouts beautifully on mobile devices.' },
                    { key: 'https', label: 'HTTPS Protocol Enabled', desc: 'Check that an active SSL/TLS certificate encrypts data transport.' },
                    { key: 'speed', label: 'Fast Loading Speed', desc: 'Ensure Core Web Vitals show main page paint is fully loaded in under 2 seconds.' },
                    { key: 'metadata', label: 'Metadata Added', desc: 'Supply specific page titles and descriptions in document HTML.' },
                    { key: 'headings', label: 'Proper Headings Used', desc: 'Establish exact heading ranks (H1, H2, H3) sequentially on all pages.' },
                    { key: 'internal', label: 'Internal Links Added', desc: 'Distribute organic authority links cleanly to target related pages.' },
                    { key: 'images', label: 'Images Optimized', desc: 'Compress all media uploads and provide descriptive alt attributes.' }
                  ].map((item) => (
                    <div 
                      key={item.key}
                      onClick={() => toggleChecklistItem(item.key)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                        persistentChecklist[item.key] 
                          ? 'bg-neon-blue/5 border-neon-blue/40 hover:border-neon-blue'
                          : 'bg-white/5 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-all flex-shrink-0 ${
                        persistentChecklist[item.key]
                          ? 'bg-neon-blue border-neon-blue text-white'
                          : 'border-white/20 text-transparent'
                      }`}>
                        <FaCheck size={10} />
                      </div>
                      <div>
                        <h4 className={`font-sans font-bold text-sm transition-colors ${
                          persistentChecklist[item.key] ? 'text-white' : 'text-white/80'
                        }`}>{item.label}</h4>
                        <p className="font-mono text-xs text-white/40 mt-1 leading-normal">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Final advice */}
                <div className="mt-8 p-5 border border-white/5 bg-cyber-black/40 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-full bg-neon-purple/5 pointer-events-none rounded-r-xl" />
                  <h3 className="text-sm font-sans font-bold text-white mb-2 flex items-center gap-1.5">
                    🚀 Final Advice & Strategy
                  </h3>
                  <p className="font-mono text-xs text-white/55 leading-relaxed">
                    SEO is a long-term game, not a one-time configuration. Search engine spiders prioritize consistent publishing cadence, real user-interaction metrics, and trustworthy authoritativeness. Focus on creating genuinely useful content, maintaining fast loading benchmarks, and publishing regularly to secure lasting keyword rankings.
                  </p>
                </div>
              </section>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}

// Quick custom sub-components
function FaBookOpenIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <path d="M542.22 32.05c-54.8 3.11-163.72 14.42-230.22 55.59-19.12-16.73-45.74-27.64-76-27.64-58.54 0-106 47.46-106 106v272c0 5.52 4.48 10 10 10h16c5.52 0 10-4.48 10-10V166c0-25.36 20.64-46 46-46 25.36 0 46 20.64 46 46v290c0 5.52 4.48 10 10 10h16c5.52 0 10-4.48 10-10V166c0-21.75 15.19-39.68 35.53-44.57 56.66-30.82 149.88-40.42 201.21-43.34 8.78-.5 15.26-7.85 15.26-16.64V48.69c.01-9.33-7.14-17.13-16.78-16.64zm-308.22 84.77C186.22 83.1 93 73.5 41.67 70.58c-8.78-.5-15.26 6.85-15.26 15.64v349.07c0 8.79 6.48 16.14 15.26 16.64 51.33 2.92 144.55 12.52 201.21 43.34 20.34 4.89 35.53 22.82 35.53 44.57v-290c0-25.36 20.64-46 46-46 25.36 0 46 20.64 46 46v272c0 5.52 4.48 10 10 10h16c5.52 0 10-4.48 10-10V166c0-58.54-47.46-106-106-106-30.26 0-56.88 10.91-76 27.64z"></path>
    </svg>
  );
}
