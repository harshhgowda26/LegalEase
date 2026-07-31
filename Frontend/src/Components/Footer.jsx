import React from "react";
import {
  Scale,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-14">
        {/* Top Footer */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] lg:gap-12">

          {/* Logo */}
          <div>

            <div className="flex items-center gap-3 sm:gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg sm:h-14 sm:w-14">
                <Scale size={24} className="text-white" />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  LegalEase
                </h3>

                <p className="text-sm text-slate-500">
                  AI-Powered Legal Assistant
                </p>
              </div>

            </div>

            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-600 sm:mt-7 sm:text-[15px] sm:leading-8">
              Making legal assistance simple, accessible and understandable
              for everyone through AI.
            </p>

          </div>

          {/* Product */}
          <div className="flex flex-col">

            <h4 className="text-lg font-semibold text-slate-900">
              Product
            </h4>

            <div className="mt-5 flex flex-col gap-4 text-[15px] text-slate-600">

              <p className="cursor-pointer transition-colors hover:text-violet-600">
                Simplify Docs
              </p>

              <p className="cursor-pointer transition-colors hover:text-violet-600">
                Know Your Rights
              </p>

              <p className="cursor-pointer transition-colors hover:text-violet-600">
                Templates
              </p>

              <p className="cursor-pointer transition-colors hover:text-violet-600">
                Find Lawyers
              </p>

            </div>

          </div>

          {/* Company */}
          <div className="flex flex-col">

            <h4 className="text-lg font-semibold text-slate-900">
              Company
            </h4>

            <div className="mt-5 flex flex-col gap-4 text-[15px] text-slate-600">

              <p className="cursor-pointer transition-colors hover:text-violet-600">
                About
              </p>

              <p className="cursor-pointer transition-colors hover:text-violet-600">
                Contact
              </p>

              <p className="cursor-pointer transition-colors hover:text-violet-600">
                Support
              </p>

            </div>

          </div>

          {/* Legal */}
          <div className="flex flex-col">

            <h4 className="text-lg font-semibold text-slate-900">
              Legal
            </h4>

            <div className="mt-5 flex flex-col gap-4 text-[15px] text-slate-600">

              <p className="cursor-pointer transition-colors hover:text-violet-600">
                Privacy Policy
              </p>

              <p className="cursor-pointer transition-colors hover:text-violet-600">
                Terms of Service
              </p>

              <p className="cursor-pointer transition-colors hover:text-violet-600">
                Disclaimer
              </p>

            </div>

          </div>

          {/* Connect */}
          <div className="flex flex-col items-center sm:items-start">

            <h4 className="text-lg font-semibold text-slate-900">
              Connect
            </h4>

            <div className="mt-5 flex justify-center gap-3 sm:justify-start">

              <button className="rounded-full bg-slate-100 p-3 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-100">
                <Linkedin size={18} />
              </button>

              <button className="rounded-full bg-slate-100 p-3 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-100">
                <Github size={18} />
              </button>

              <button className="rounded-full bg-slate-100 p-3 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-100">
                <Mail size={18} />
              </button>

            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-slate-200 pt-6 text-center lg:mt-14 lg:pt-7">

          <p className="text-sm text-slate-500">
            © 2025 LegalEase. All rights reserved.
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:leading-7">
            Disclaimer: This tool provides general guidance, not legal advice.
            Always consult a licensed legal professional.
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;