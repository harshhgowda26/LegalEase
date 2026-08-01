import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Scale, Mic, Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Simplify Docs", to: "/simplifier" },  // ✅ fixed route
  { name: "Know Your Rights", to: "/rights" },
  { name: "Templates", to: "/templates" },
  { name: "Find Lawyers", to: "/lawyers" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setMenuOpen(false);
    }
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
        <Scale size={22} />
    </div>

    <div>
        <h1 className="text-xl font-extrabold tracking-tight">
            LegalEase
        </h1>

        <p className="text-xs text-slate-500">
            AI Legal Assistant
        </p>
    </div>
</div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex space-x-6">
          {navLinks.map((link) => (
            <NavLink
  key={link.name}
  to={link.to}
  className={({ isActive }) =>
    `rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-violet-100 text-violet-700"
        : "text-slate-700 hover:bg-white/70 hover:text-violet-700"
    }`
  }
>
  {link.name}
</NavLink>
          ))}
        </nav>

        {/* Action Button (Voice Demo Placeholder) */}
        <button
          onClick={() => alert("Voice demo coming soon 🎤")}
         className="hidden lg:inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-white shadow-[0_10px_30px_rgba(99,102,241,.35)] transition-all duration-300 hover:scale-105"
        >
          <Mic className="w-4 h-4 mr-2" />
          Voice Demo
        </button>

        <button
  onClick={() => setMenuOpen(!menuOpen)}
  className="flex lg:hidden items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-white/70 transition"
>
  {menuOpen ? <X size={24} /> : <Menu size={24} />}
</button>

      </div>

      {/* Mobile Menu */}
<div
  className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
    menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
  }`}
>
  <div className="border-t border-white/20 bg-white/90 backdrop-blur-2xl shadow-lg">
    <nav className="flex flex-col px-6 py-5">

      {navLinks.map((link) => (
        <NavLink
  key={link.name}
  to={link.to}
  onClick={() => setMenuOpen(false)}
  className={({ isActive }) =>
    `rounded-xl px-4 py-3 text-[15px] font-medium transition-all duration-300 ${
      isActive
        ? "bg-violet-100 text-violet-700"
        : "text-slate-700 hover:bg-violet-50 hover:text-violet-700"
    }`
  }
>
  {link.name}
</NavLink>
      ))}

      <button
        onClick={() => {
          alert("Voice demo coming soon 🎤");
          setMenuOpen(false);
        }}
        className="mt-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 font-medium text-white shadow-lg transition-all hover:scale-[1.02]"
      >
        <Mic className="mr-2 h-4 w-4" />
        Voice Demo
      </button>

    </nav>
  </div>
</div>

    </header>
  );
};

export default Navbar;
