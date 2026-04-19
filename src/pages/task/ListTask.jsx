import React from "react";

const ListTask = () => {
  return (
    <div>
      <main className="lg:pl-64 pt-20 px-6 pb-12 max-w-7xl mx-auto">
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span
              className="material-symbols-outlined text-slate-400"
              data-icon="schedule"
            >
              schedule
            </span>
            <h2 className="text-xl font-bold tracking-tight text-on-surface">
              Recently Viewed
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="group relative h-28 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800"></div>
              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <span className="text-white font-bold text-base leading-tight">
                  Product Launch 2024
                </span>
                <span
                  className="material-symbols-outlined text-white/50 self-end opacity-0 group-hover:opacity-100 transition-opacity"
                  data-icon="star"
                >
                  star
                </span>
              </div>
            </div>
            <div className="group relative h-28 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-700"></div>
              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <span className="text-white font-bold text-base leading-tight">
                  Marketing Assets
                </span>
                <span
                  className="material-symbols-outlined text-white/50 self-end opacity-0 group-hover:opacity-100 transition-opacity"
                  data-icon="star"
                >
                  star
                </span>
              </div>
            </div>
            <div className="group relative h-28 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-700"></div>
              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <span className="text-white font-bold text-base leading-tight">
                  Sprint Backlog
                </span>
                <span
                  className="material-symbols-outlined text-white/50 self-end opacity-0 group-hover:opacity-100 transition-opacity"
                  data-icon="star"
                >
                  star
                </span>
              </div>
            </div>
            <div className="group relative h-28 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-700"></div>
              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <span className="text-white font-bold text-base leading-tight">
                  Design System Beta
                </span>
                <span
                  className="material-symbols-outlined text-white/50 self-end opacity-0 group-hover:opacity-100 transition-opacity"
                  data-icon="star"
                >
                  star
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-slate-400"
                data-icon="work"
              >
                work
              </span>
              <h2 className="text-xl font-bold tracking-tight text-on-surface">
                Your Workspaces
              </h2>
            </div>
            <button className="text-sm font-medium text-primary hover:underline">
              View all
            </button>
          </div>
          <div className="bg-surface-container-high rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white text-xl font-black">
                A
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight">
                  Project Alpha
                </h3>
                <p className="text-sm text-slate-500">6 boards • 12 members</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="h-24 bg-surface-container-lowest rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300 hover:border-primary hover:bg-blue-50 transition-all cursor-pointer group">
                <div className="flex flex-col items-center gap-1">
                  <span
                    className="material-symbols-outlined text-slate-400 group-hover:text-primary"
                    data-icon="add"
                  >
                    add
                  </span>
                  <span className="text-sm font-medium text-slate-500 group-hover:text-primary">
                    Create new board
                  </span>
                </div>
              </div>
              <div className="group relative h-24 rounded-xl bg-[#0079bf] p-4 cursor-pointer hover:brightness-110 transition-all">
                <span className="text-white font-bold text-sm">
                  Strategic Planning
                </span>
              </div>
              <div className="group relative h-24 rounded-xl bg-[#4bbf6b] p-4 cursor-pointer hover:brightness-110 transition-all">
                <span className="text-white font-bold text-sm">
                  Customer Feedback
                </span>
              </div>
              <div className="group relative h-24 rounded-xl bg-[#61bd4f] p-4 cursor-pointer hover:brightness-110 transition-all">
                <span className="text-white font-bold text-sm">
                  Team Resources
                </span>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-high rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-tertiary rounded-xl flex items-center justify-center text-white text-xl font-black">
                S
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight">
                  Sales Operations
                </h3>
                <p className="text-sm text-slate-500">3 boards • 4 members</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="h-24 bg-surface-container-lowest rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300 hover:border-primary hover:bg-blue-50 transition-all cursor-pointer group">
                <div className="flex flex-col items-center gap-1">
                  <span
                    className="material-symbols-outlined text-slate-400 group-hover:text-primary"
                    data-icon="add"
                  >
                    add
                  </span>
                  <span className="text-sm font-medium text-slate-500 group-hover:text-primary">
                    Create new board
                  </span>
                </div>
              </div>
              <div className="group relative h-24 rounded-xl bg-[#89609e] p-4 cursor-pointer hover:brightness-110 transition-all">
                <span className="text-white font-bold text-sm">
                  Pipeline Q4
                </span>
              </div>
              <div className="group relative h-24 rounded-xl bg-[#cd5a91] p-4 cursor-pointer hover:brightness-110 transition-all">
                <span className="text-white font-bold text-sm">
                  Prospecting
                </span>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-slate-400"
                data-icon="grid_view"
              >
                grid_view
              </span>
              <h2 className="text-xl font-bold tracking-tight text-on-surface">
                Most Popular Templates
              </h2>
            </div>
            <button className="text-sm font-medium text-primary hover:underline">
              Explore all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="md:col-span-2 lg:col-span-2 relative h-48 rounded-2xl overflow-hidden group cursor-pointer">
              <img
                alt="Modern minimalist office"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                data-alt="Interior of a bright modern minimalist office with large windows, light wood desks, and green plants, overhead soft lighting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIjHRm8IwIsTysL_m0Ed0abtoaA8BSy52XYkR3ekJTNUJFS3DIfhmhkvKfnYcAZYrTxKmLQk4UnY0VoSKDliWNnhJYyfu_fEPYN1DX7uZliPNrGvd7I7s6rKPfkJclEijF_oMm74lZjO31n0thadN4pioixTXOt6V2aXgit7O3blzYc_CB0btl2wzFtNeVmInsSMlOx6I0CAlktCt3lGMpUuhYA209mTZvRnfIz6V8Gel1PzCdc9Y2CgQwbJsAjtECnnjNc6gfISQ"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <span className="label-sm text-white/70 uppercase tracking-widest text-[10px] font-bold mb-1">
                  Productivity
                </span>
                <h4 className="text-xl font-bold text-white">
                  Project Management
                </h4>
              </div>
            </div>
            <div className="relative h-48 rounded-2xl overflow-hidden group cursor-pointer">
              <img
                alt="Team brainstorming"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                data-alt="Group of diverse creative professionals collaborating around a table with sticky notes and sketches, warm atmospheric lighting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFX_L4IruYEJ2xNiQFGckDMe4QYeX16f8UCvDd_jRlyhmSykJK_aqhAvJvOLOEsNwEXg17rg6Y6mLEz-qQPJiHOlJVca2tHF63NUEz11ke7LNLfeztYkDug6QNB-gViUqfcxnXeYhkY73gW_5pfoqP8d1GhVVJXocwn72QVtVv_lp5lRxRkEOpUGcQ-AXc-_m-L9x3GEHq5I14YCPKl-uIUO9Ey8CB-JwGNzr895LVvcsUJ-LeEa1rjZgyBp_sB-9u1qqYrZ_RSWc"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <span className="label-sm text-white/70 uppercase tracking-widest text-[10px] font-bold mb-1">
                  Marketing
                </span>
                <h4 className="text-lg font-bold text-white">
                  Content Calendar
                </h4>
              </div>
            </div>
            <div className="relative h-48 rounded-2xl overflow-hidden group cursor-pointer">
              <img
                alt="Cozy office space"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                data-alt="Small cozy home office desk with a laptop, coffee cup, and soft yellow desk lamp lighting, comfortable and intimate feel"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf8T9bBrULNqdEzync8onvWb-m2u0FUgqtesHWvNevjB9FTKRZBXjBWKYgtVbHQWJY9ugOHkfAAN9eV-xKiwk4SkVbVdkNZcBLimsz5bts-OpXh5KWOfx1MwP7mQIUNRjo-SFn9Ow5PkP-FFVaj4mqfT_xtVHvyDup2_FzC5RwRPOYgpJ6uSJGdYlbo2lMPJjw1w9EcNyVseVZZCVssM4NG1f4Dl70fC0Jgl--iddD-O5W0zEomFcSkPPaJJNnuAmCUQfQjUz-kps"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <span className="label-sm text-white/70 uppercase tracking-widest text-[10px] font-bold mb-1">
                  HR
                </span>
                <h4 className="text-lg font-bold text-white">
                  New Hire Onboarding
                </h4>
              </div>
            </div>
          </div>
        </section>
      </main>
      <nav className="md:hidden fixed bottom-0 left-0 w-full glass-nav px-6 py-3 flex items-center justify-between border-t border-slate-100 z-50">
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
          <span
            className="material-symbols-outlined"
            data-icon="account_circle"
          >
            account_circle
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Profile
          </span>
        </a>
      </nav>
    </div>
  );
};

export default ListTask;
