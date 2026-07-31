import React from "react";
import { Star } from "lucide-react";

import avatar1 from "../assets/avatars/avatar1.png";
import avatar2 from "../assets/avatars/avatar2.png";
import avatar3 from "../assets/avatars/avatar3.png";
import avatar4 from "../assets/avatars/avatar4.png";

const TrustRow = () => {
  return (
    <div className="mt-10 flex items-center gap-4">
      <div className="flex -space-x-3">
        <img
          src={avatar1}
          alt="User"
          className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-md"
        />

        <img
          src={avatar2}
          alt="User"
          className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-md"
        />

        <img
          src={avatar3}
          alt="User"
          className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-md"
        />

        <img
          src={avatar4}
          alt="User"
          className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-md"
        />
      </div>

      <div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={18}
              className="fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>

        <p className="text-sm text-slate-600">
  <span className="font-semibold text-slate-900">
    Simplifying Legal Help
  </span>{" "}
  for Everyone
</p>
      </div>
    </div>
  );
};

export default TrustRow;