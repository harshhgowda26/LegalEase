import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const FeatureCard = ({ card }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="h-full"
    >
      <Link
        to={card.to}
        className="group flex h-full flex-col rounded-[28px] border border-slate-200/70 bg-white p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_25px_60px_rgba(99,102,241,0.12)]"
      >
        {/* Icon */}
        <div
  className={`flex h-12 w-12 items-center justify-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl ${card.accent.bg}`}
>
          <card.icon className={`h-6 w-6 sm:h-7 sm:w-7 ${card.accent.icon}`} />
        </div>

        {/* Content */}
        <div className="mt-6">
          <h3 className="text-xl sm:text-[22px] font-bold tracking-tight text-slate-900">
            {card.title}
          </h3>

          <p className="mt-3 text-sm leading-6 sm:text-[15px] sm:leading-7 text-slate-600">
            {card.desc}
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-auto flex items-center justify-between pt-6 sm:pt-8">
          <span className="text-sm font-semibold text-slate-500 transition-colors duration-300 group-hover:text-slate-900">
            Learn More
          </span>

          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border sm:h-11 sm:w-11 ${card.accent.border} ${card.accent.arrow} transition-all duration-300 group-hover:scale-110`}
          >
            <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default FeatureCard;