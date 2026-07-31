import React from "react";
import { ArrowRight, Sparkles, Scale, Star } from "lucide-react";

const CtaBanner = () => {
  return (
    <section className="bg-white py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-700 via-violet-600 to-indigo-600 px-5 py-6 sm:px-6 lg:px-8 lg:py-6 shadow-[0_18px_45px_rgba(124,58,237,0.28)]">

          {/* Soft Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.18),transparent_40%)]" />

          {/* Sparkles */}

<span className="absolute right-80 top-5 hidden text-white text-lg opacity-90 lg:block">
    ✦
</span>

<span className="absolute right-72 top-12 hidden text-white text-sm opacity-70 lg:block">
    ✦
</span>

<span className="absolute right-60 top-7 hidden text-white text-xs opacity-60 lg:block">
    ✦
</span>


          <div className="relative z-10 flex flex-col gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">

            {/* Left */}
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md sm:h-12 sm:w-12">
                <Scale size={24} className="text-white" />
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-[30px]">
                  Ready to Simplify Your Legal World?
                </h2>

                <p className="mt-1 text-sm text-violet-100">
                  Join thousands who trust LegalEase for their legal needs.
                </p>
              </div>

            </div>

            {/* Button */}
            <button className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-violet-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:w-auto">
              Get Started for Free
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;