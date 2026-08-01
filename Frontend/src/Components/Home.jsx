import React from "react";
import heroIllustration from "../assets/illustrations/hero.png";
import FeatureCard from "./FeatureCard";
import SecuritySection from "./SecuritySection";
import TrustRow from "./TrustRow";
import Button from "./ui/Button";
import CtaBanner from "./CtaBanner";
import {
  Scale,
  FileText,
  UserCheck,
  FileDown,
  Users,
  MessageCircle
} from "lucide-react";

import { Link } from 'react-router-dom';

const featureCards = [
  {
    title: "Document Simplifier",
    icon: FileText,
    desc: "Transform complex legal documents into plain English.",
    to: "/simplifier",
    accent: {
      bg: "bg-violet-100",
      icon: "text-violet-600",
      border: "border-violet-200",
      hover: "group-hover:bg-violet-600",
      hoverText: "group-hover:text-white",
      arrow: "text-violet-600",
    },
  },

  {
    title: "Know Your Rights",
    icon: UserCheck,
    desc: "Get instant answers to your legal questions.",
    to: "/rights",
    accent: {
      bg: "bg-emerald-100",
      icon: "text-emerald-600",
      border: "border-emerald-200",
      hover: "group-hover:bg-emerald-600",
      hoverText: "group-hover:text-white",
      arrow: "text-emerald-600",
    },
  },

  {
    title: "Legal Templates",
    icon: FileDown,
    desc: "Generate custom legal documents instantly.",
    to: "/templates",
    accent: {
      bg: "bg-amber-100",
      icon: "text-amber-600",
      border: "border-amber-200",
      hover: "group-hover:bg-amber-600",
      hoverText: "group-hover:text-white",
      arrow: "text-amber-600",
    },
  },

  {
    title: "Find Lawyers",
    icon: Users,
    desc: "Connect with qualified legal professionals.",
    to: "/lawyers",
    accent: {
      bg: "bg-sky-100",
      icon: "text-sky-600",
      border: "border-sky-200",
      hover: "group-hover:bg-sky-600",
      hoverText: "group-hover:text-white",
      arrow: "text-sky-600",
    },
  },
];

// --- Hero Section ---
const Hero = () => (
  <section
  id="home"
  className="relative overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-white pt-24 pb-12 lg:pt-20"
>
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="grid items-center gap-12 py-8 lg:grid-cols-2">
        {/* LEFT */}
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">

          <div className="mb-6 flex justify-center lg:justify-start">
    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
        <Scale size={16} />
        AI Powered Legal Assistant
    </div>
</div>

          <h1 className="mx-auto max-w-xl text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:mx-0 lg:text-left lg:text-7xl">
            Legal Help
            <span className="mt-2 block bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
              Made Simple.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-[470px] text-base leading-8 text-slate-600 sm:text-lg lg:mx-0 lg:mt-8 lg:text-left">
            Simplify legal documents, understand your rights,
            generate legal templates, and connect with trusted
            lawyers—all in one AI-powered platform.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
           <Link to="/rights">
  <Button
    variant="primary"
    className="px-7 py-3.5 rounded-full shadow-md text-base"
  >
    <MessageCircle size={17} className="mr-2" />
    Start Legal Chat
  </Button>
</Link>

<Link to="/simplifier">
  <Button
    variant="outline"
    className="px-7 py-3.5 rounded-full text-base"
  >
    <FileText size={17} className="mr-2" />
    Simplify Document
  </Button>
</Link>
          </div>
          
          <div className="mt-10 flex justify-center lg:justify-start">
  <TrustRow />
</div>

        </div>

        {/* RIGHT */}
        <div className="relative order-1 flex items-center justify-center lg:order-2">
  {/* Background Glow */}
  <div className="absolute h-[380px] w-[380px] rounded-full bg-violet-300/20 blur-[100px] sm:h-[450px] sm:w-[450px] lg:h-[600px] lg:w-[600px]" />

  <img
    src={heroIllustration}
    alt="LegalEase Hero"
    className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl"
    draggable={false}
  />
</div>

      </div>
    </div>
  </section>
);

// --- Features Section ---
const FeaturesSection = () => (
  <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white py-16 lg:py-20">
     {/* Background Glow */}
    <div className="absolute left-1/2 top-0 h-72 w-[700px] -translate-x-1/2 rounded-full bg-violet-200/20 blur-[120px]" />
    <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
        Powerful Legal Tools
      </h2>

      <p className="mx-auto mt-4 mb-12 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 lg:mb-16">
        Everything you need to understand and navigate legal matters with confidence
      </p>

      <div className="grid gap-6 sm:gap-7 md:grid-cols-2 xl:grid-cols-4">
        {featureCards.map((card) => (
  <FeatureCard
    key={card.title}
    card={card}
  />
))}
      </div>
    </div>
  </section>
);

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-sans">
  <main>
        <Hero />
        <FeaturesSection />
        <SecuritySection />
        <CtaBanner />
      </main>
    </div>
  );
}
