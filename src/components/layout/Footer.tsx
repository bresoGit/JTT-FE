// src/components/layout/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-4 flex items-center justify-between border-t border-jack-border/60 py-3 text-[11px] text-slate-500">
      <span>© {new Date().getFullYear()} Jack The Tipster</span>
      <span className="hidden gap-2 md:flex">
        <button className="hover:text-red-300">Uvjeti</button>
        <button className="hover:text-red-300">Privatnost</button>
        <button className="hover:text-red-300">Kontakt</button>
      </span>
    </footer>
  );
};

export default Footer;
