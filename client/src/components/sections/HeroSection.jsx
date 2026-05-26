import { Suspense, lazy, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { HiChevronDown, HiLocationMarker } from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import useUIStore from '../../store/uiStore';
import { githubService } from '../../services/dataService';
import Button from '../ui/Button';

const HeroScene = lazy(() => import('../three/HeroScene'));

export default function HeroSection() {
  const { performanceTier } = useUIStore();
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    githubService.getStats()
      .then(({ data }) => {
        if (data && data.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }
      })
      .catch(() => { });
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* 3D Background */}
      {performanceTier !== 'low' && (
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-black/40 via-cyber-dark/80 to-cyber-black z-[1]" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 py-20 flex flex-col-reverse md:flex-row items-center justify-between gap-12">

        {/* Left Side: Text & Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight mb-4 text-white">
            Hi all, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Sarvesh Kulkarni</span>
            <span className="inline-block ml-3 origin-bottom-right animate-[wave_2.5s_infinite]">👋</span>
          </h1>

          <div className="text-xl sm:text-2xl md:text-3xl font-sans font-medium text-slate-300 mb-6 h-12 flex items-center justify-center md:justify-start">
            <span className="mr-2">A passionate</span>
            <TypeAnimation
              sequence={[
                'Full Stack Web Developer',
                2000,
                'AI/ML Enthusiast',
                2000,
                'Cybersecurity Engineer',
                2000,
              ]}
              wrapper="span"
              speed={50}
              className="text-neon-blue font-bold"
              repeat={Infinity}
            />
          </div>

          <p className="text-slate-400 text-base md:text-lg max-w-xl mb-8 leading-relaxed mx-auto md:mx-0">
            I craft intelligent, secure, and highly scalable systems. From front-end experiences to robust backend architectures and deep learning models.
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-300 mb-8">
            <HiLocationMarker className="text-neon-blue text-xl" />
            <span className="font-medium">Chhatrapati Sambhajinagar, Maharashtra, India</span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 mb-10">
            <a href="https://github.com/sarveshkulkarni2023" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-neon-blue transition-colors duration-300">
              <FaGithub size={20} />
            </a>
            <a href="https://www.linkedin.com/in/sarvesh-kulkarni-723404294/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#0077b5] transition-colors duration-300">
              <FaLinkedin size={20} />
            </a>
            <a href="mailto:kulkarnisarvesh159@gmail.com" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-red-500 transition-colors duration-300">
              <FaEnvelope size={20} />
            </a>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <Button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Contact Me
            </Button>
            <Button variant="secondary" onClick={() => useUIStore.getState().openResumeModal()}>
              See my resume
            </Button>
          </div>
        </motion.div>

        {/* Right Side: Profile Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex justify-center md:justify-end"
        >
          <div className="relative">
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse" />

            {/* Image Container */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-cyber-black p-2 bg-gradient-to-tr from-blue-500 to-purple-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Sarvesh Kulkarni" className="w-full h-full rounded-full object-cover bg-cyber-dark" />
              ) : (
                <div className="w-full h-full rounded-full bg-cyber-dark animate-pulse" />
              )}
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 right-4 bg-cyber-black border border-green-500/30 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-green-500/20"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-green-400 uppercase tracking-wider font-semibold">Open to Work</span>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
