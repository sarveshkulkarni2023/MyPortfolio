import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import HeroSection from '../../components/sections/HeroSection';
import ProjectsSection from '../../components/sections/ProjectsSection';
import SkillsSection from '../../components/sections/SkillsSection';
import ExperienceSection from '../../components/sections/ExperienceSection';
import CertificationsSection from '../../components/sections/CertificationsSection';
import GitHubSection from '../../components/sections/GitHubSection';
import ContactSection from '../../components/sections/ContactSection';
import ResumeModal from '../../components/sections/ResumeModal';
import useUIStore from '../../store/uiStore';
import { analyticsService } from '../../services/dataService';

export default function Landing() {
  const { isResumeModalOpen, closeResumeModal } = useUIStore();

  useEffect(() => {
    analyticsService.track('PAGE_VIEW', { page: 'landing' });
    
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Sarvesh Kulkarni - Portfolio</title>
        <meta name="description" content="A futuristic portfolio platform built by Sarvesh Kulkarni, a security-focused engineer. Explore projects, skills, and experience." />
        <meta property="og:title" content="Sarvesh Kulkarni - Portfolio" />
        <meta property="og:description" content="Explore the engineering portfolio of Sarvesh Kulkarni." />
      </Helmet>

      <HeroSection />
      <ProjectsSection />
      <SkillsSection />
      <ExperienceSection />
      <CertificationsSection />
      <GitHubSection />
      <ContactSection />
      <ResumeModal isOpen={isResumeModalOpen} onClose={closeResumeModal} />
    </>
  );
}
