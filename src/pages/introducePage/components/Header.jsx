import React from "react";

const Header = () => {
  return (
    <div>
      <nav className="bg-[#131313] fixed top-0 w-full border-b-2 border-[#CCFF00] flex justify-between items-center px-6 h-16 z-50 font-['Space_Grotesk'] uppercase tracking-tighter">
        <div className="text-2xl font-black text-[#CCFF00] italic">
          ANARCHY.PROJECTS
        </div>
        <div className="hidden md:flex gap-8 items-center h-full">
          <a
            className="text-[#E5E2E1] hover:text-[#CCFF00] transition-colors duration-150"
            href="#"
          >
            DASHBOARD
          </a>
          <a
            className="text-[#E5E2E1] hover:text-[#CCFF00] transition-colors duration-150"
            href="#"
          >
            BACKLOG
          </a>
          <a
            className="text-[#E5E2E1] hover:text-[#CCFF00] transition-colors duration-150"
            href="#"
          >
            TIMELINE
          </a>
          <a
            className="text-[#E5E2E1] hover:text-[#CCFF00] transition-colors duration-150"
            href="#"
          >
            TEAM
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-[#E5E2E1] hover:text-[#CCFF00]">
            notifications
          </button>
          <button className="material-symbols-outlined text-[#E5E2E1] hover:text-[#CCFF00]">
            settings
          </button>
          <div className="w-8 h-8 bg-surface-container-high border-2 border-outline-variant flex items-center justify-center">
            <img
              alt="User profile"
              data-alt="close-up minimalist avatar icon of a digital architect in high contrast black and white photography style"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3BK3XkRzXS9ZN4tBl5lx2dSHYa_qWsL8QPxnk_NeqkXUN3BLWYphmDVf0PX_IKDnEUI_JeO6KGkPXCe13G10DiVZOt3CIqKsdc-da9Ns4MYnBHpieBTFAO4B_0PGQ8CHylq0sfXDk3lWdt2gQPg2PjT4fmsrS8a9fhj1SLHZTsYpf-DNkdh73N2ewG5TXYlnSvWcV7F65bDe-dBQZGE3NoXRLevm48zH3wEXGQkazx-tCsiVfWHCpGMGfDMPtzCiH4clqyNeOoTo"
            />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
