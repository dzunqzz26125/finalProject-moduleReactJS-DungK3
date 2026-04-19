import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-[#131313] py-24 px-6 md:px-24 border-t-2 border-[#CCFF00]">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-md">
            <div className="text-3xl font-black text-[#CCFF00] italic mb-8">
              ANARCHY.PROJECTS
            </div>
            <p className="font-body text-white text-on-surface-variant">
              Designing for power users who demand clarity without sacrificing
              their edge. Built for the digital architect.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
              <span className="font-headline text-[#CCFF00] font-bold text-xs tracking-widest">
                ECOSYSTEM
              </span>
              <a
                className="font-body text-white text-sm hover:text-[#FF00FF]"
                href="#"
              >
                DASHBOARD
              </a>
              <a
                className="font-body text-white text-sm hover:text-[#FF00FF]"
                href="#"
              >
                TERMINAL
              </a>
              <a
                className="font-body text-white text-sm hover:text-[#FF00FF]"
                href="#"
              >
                VAULT
              </a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-headline text-[#CCFF00] font-bold text-xs tracking-widest">
                NETWORK
              </span>
              <a
                className="font-body text-white text-sm hover:text-[#FF00FF]"
                href="#"
              >
                MANIFESTO
              </a>
              <a
                className="font-body text-white text-sm hover:text-[#FF00FF]"
                href="#"
              >
                CHANGELOG
              </a>
              <a
                className="font-body text-white text-sm hover:text-[#FF00FF]"
                href="#"
              >
                STATUS
              </a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-headline text-[#CCFF00] font-bold text-xs tracking-widest">
                LEGAL
              </span>
              <a
                className="font-body text-white text-sm hover:text-[#FF00FF]"
                href="#"
              >
                PRIVACY
              </a>
              <a
                className="font-body text-white text-sm hover:text-[#FF00FF]"
                href="#"
              >
                PROTOCOLS
              </a>
            </div>
          </div>
        </div>
        <div className="mt-24 pt-8 border-t-2 border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-headline font-bold text-outline uppercase tracking-[0.2em]">
          <span>© 2024 ANARCHY.PROJECTS // ALL RIGHTS DESTROYED</span>
          <div className="flex gap-8">
            <span>V.2.0.4_STABLE</span>
            <span>LATENCY_0.02MS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
