import React from "react";
import securityIllustration from "../assets/security-illustration.png";

import {
  ShieldCheck,
  Lock,
  Shield,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    desc: "Your Documents stay encrypted at every step.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    desc: "We never sell or share your personal legal information.",
  },
  {
    icon: BadgeCheck,
    title: "Trusted Legal Sources",
    desc: "AI responses are backed by trusted legal sources.",
  },
];

const SecuritySection = () => {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 lg:rounded-[32px] lg:p-20 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

            {/* LEFT SIDE */}
            <div className="max-w-2xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
  <ShieldCheck className="h-4 w-4" />
  Enterprise Grade Security
</div>

              <h2 className="mt-6 text-[2rem] font-black leading-tight tracking-tight text-slate-900 sm:text-[2.4rem] lg:mt-8 lg:text-[52px] lg:leading-[1.05] break-words">
                Security You Can Trust
              </h2>

            <p className="mt-6 max-w-full text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Protect your legal documents with enterprise-grade encryption,
            privacy-first AI, and trusted legal intelligence—all designed
            to keep your information secure.
            </p>

              <div className="mt-10 space-y-5">
                {securityFeatures.map((item) => (
                  <div key={item.title} className="flex items-start gap-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 sm:h-11 sm:w-11 sm:rounded-2xl">
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600" />
                    </div>

                    <div className="min-w-0 flex-1 text-left">
                      <h4 className="font-semibold text-slate-900">
                        {item.title}
                      </h4>

                      <p className="mt-1 text-slate-600">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="group mt-10 inline-flex items-center gap-2 font-semibold text-violet-600">
                Explore Security

                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

           {/* RIGHT SIDE */}
<div className="relative mt-10 flex overflow-hidden items-center justify-center lg:mt-0 lg:min-h-[520px] lg:-translate-y-6">

  {/* Background Glow */}
  <div className="absolute h-[280px] w-[280px] rounded-full bg-violet-500/10 blur-[70px] sm:h-[380px] sm:w-[380px] sm:blur-[90px] lg:h-[650px] lg:w-[650px] lg:bg-violet-500/12 lg:blur-[150px]" />

  <img
  src={securityIllustration}
  alt="Security Illustration"
  draggable={false}
  className="relative z-10 w-full max-w-[280px] select-none sm:max-w-[360px] md:max-w-[450px] lg:max-w-none lg:w-[700px]"
/>

</div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;