import React from "react";

const Footer = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full glass-nav px-6 py-3 flex items-center justify-between border-t border-slate-100 z-50">
      <a className="flex flex-col items-center gap-1 text-primary" href="#">
        <span className="material-symbols-outlined" data-icon="dashboard">
          dashboard
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Boards
        </span>
      </a>
      <a className="flex flex-col items-center gap-1 text-slate-400" href="#">
        <span className="material-symbols-outlined" data-icon="search">
          search
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Search
        </span>
      </a>
      <a className="flex flex-col items-center gap-1 text-slate-400" href="#">
        <span className="material-symbols-outlined" data-icon="notifications">
          notifications
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Alerts
        </span>
      </a>
      <a className="flex flex-col items-center gap-1 text-slate-400" href="#">
        <span className="material-symbols-outlined" data-icon="account_circle">
          account_circle
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Profile
        </span>
      </a>
    </div>
  );
};

export default Footer;
