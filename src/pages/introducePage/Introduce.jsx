import React from "react";
import Header from "../introducePage/components/Header";
import Footer from "../introducePage/components/Footer";
import { Link } from "react-router-dom";

const Introduce = () => {
  return (
    <div>
      <Header />
      <main>
        <section className="min-h-screen flex flex-col justify-center md:px-24 px-6 relative overflow-hidden bg-[#131313]">
          <div className="absolute top-20 right-0 w-125 h-125 bg-[#CCFF00] opacity-5 blur-[120px]"></div>
          <div className="z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-24">
            <div>
              <h1 className="font-headline font-black text-6xl md:text-[8rem] leading-[0.9] text-[#CCFF00] uppercase tracking-tighter mb-8 italic">
                REWRITE
                <br />
                THE RULES
              </h1>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                <p className="font-body text-xl md:text-2xl text-on-surface max-w-xl border-l-4 border-[#FF00FF] pl-6 py-2">
                  Linear management is dead. Build at the speed of thought with
                  an engine designed for mathematical precision and aggressive
                  intentionality.
                </p>
              </div>
              <div className="mt-10">
                <Link
                  to={"/app/task"}
                  className="group relative inline-flex items-center justify-center px-12 py-6 bg-[#CCFF00] text-[#283500] font-headline font-black text-xl tracking-widest hover:scale-105 active:scale-95 transition-all duration-150 shadow-[8px_8px_0px_0px_#FF00FF]"
                >
                  GET STARTED
                  <span className="material-symbols-outlined ml-3 group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-[#CCFF00]/10 blur-2xl rounded-full"></div>
              <div className="relative border-2 border-[#CCFF00]/30 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-8 bg-[#1C1B1B] flex items-center px-4 gap-2 z-10 border-b border-[#CCFF00]/20">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="ml-4 text-[10px] text-[#8e9379] font-['Space_Grotesk'] uppercase tracking-widest">
                    anarchy.projects // board_view
                  </span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80"
                  alt="Project board preview"
                  className="w-full h-120 object-cover object-top opacity-80 mt-8"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent mt-8"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3">
                    <div className="h-1 flex-1 bg-[#CCFF00]/30 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-[#CCFF00] rounded-full"></div>
                    </div>
                    <span className="text-[#CCFF00] text-xs font-black font-['Space_Grotesk']">
                      67% COMPLETE
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-[#FF00FF] text-white text-[10px] font-black px-3 py-1.5 font-['Space_Grotesk'] uppercase tracking-widest rotate-3">
                LIVE PREVIEW
              </div>
            </div>
          </div>
        </section>
        <section className="py-24 bg-surface-container-low px-6 md:px-24 border-y-2 border-outline-variant/15">
          <div className="flex flex-col gap-4 mb-16">
            <span className="font-headline text-[#FF00FF] text-sm font-bold tracking-widest uppercase">
              / / SYSTEM INTEGRITY
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-black text-white uppercase italic">
              TRUSTED BY INNOVATORS
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-outline-variant/20 border-2 border-outline-variant/20">
            <div className="bg-[#131313] p-12 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
              <img
                alt="Neon Labs Logo"
                data-alt="clean geometric minimalist typography logo for a technology laboratory in electric lime color"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6hhHLF_aqVX94AdoJYEFWC2h55XoHido4AyFsYOo4-664AAbdBvTsM57Gd7rEuw-_51EMRuY8ZnfFiqVf7jRJbczdnae2Nc5PEaCupEZleuSuI1Pe072xayaht_9cU4Gpr_cySkKB9DsMTXVU1bOz3gX2oGmyluyjuEDV5JnvgQsYlryGibF9_PqKEO6C9gfOtyb9k6zOHYf06EnvlttkQB6ppWX8Y6t1WC0FEWChIyqrYNKsYrUP4xe7z2LNXkLTUb9F4Z4QGQY"
              />
            </div>
            <div className="bg-[#131313] p-12 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
              <img
                alt="Void Corp Logo"
                data-alt="brutalist sharp edge logo for an architectural firm in high contrast silver grey"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPlAqaZl42IjN6z9RlvoxD-UQDcqvncz1r4SzwV4gHOGLCQ3xZfvRuZsekPl-3v4dhz9Zxq7Pd0nhaF0ehVa1h8qWiE9EPZ3oEDxILZAZvNrshd_ojFiRFkVNwPcDzPxwcf7aKQATXFhlATypxYhVMILt4uTWlc9PFX7ZJP0XTyLeTFCg9DtRM_PGoViGtkPB5DGDwzhyZ6QPQUcsBVinCl5KLgGwJof0-px3XrzRNBM_3rqzwx_2Z2gCn7cGqq8RUTKpuvC54SZg"
              />
            </div>
            <div className="bg-[#131313] p-12 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
              <img
                alt="Cyber Dynamics Logo"
                data-alt="futuristic cybernetic company logo with thin geometric lines and sharp corners"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDijjgManLhfwwnNnGJ40c9GFiafnw5dSWoBC4LeaEvFL6oei57K00m5C06xN5t8STgTkZ8eDc7wI7tqyKMs8PEg4iXx81EtFLd2UHA433iVjT56G6fAhAL0YZkmOW5JGA4gXlKpa6ysru6End1I6TqVskXPc_Koj469SGm5eHUpXefi-nVyzMiC4JELQU2fuFS2lle4Mqo3s91bBzTdJDMFYXyseRCsOO4HBiK46MpRI0J-8yzUIlZv_KtfoAy2H7h4bKIawId-a4"
              />
            </div>
            <div className="bg-[#131313] p-12 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
              <img
                alt="Phantom Arch Logo"
                data-alt="experimental architecture studio logo featuring abstract angular shapes and digital textures"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB87D9JhSCzQCiVIlOewhWGXntiotkGK1DSqDWXF8G-aKlp4lqYFKLNyxl8DqqubIec0gSltEbhJHTngZDXYJZ2jQXifa1qme1-htxVCZF0VKYA2iFJFD0n_mOqw4jLhtcwvO9jnGrLDhu6ndwXBPKuUIS_BJNBIxk8U0xdjVRgzCyv4WVGEnQqmDOVo41pojq2Agb7JdVoqd6Q4uD57imfw9VgdiJCaoPaovECUcCZwOwDUu2wiJovk7iBb2iM_j0pErLKOWNEI6E"
              />
            </div>
          </div>
        </section>
        <section className="py-32 px-6 md:px-24 bg-[#131313]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 sticky top-24">
              <h3 className="font-headline text-3xl font-black text-[#CCFF00] mb-8 uppercase italic">
                THE ENVIRONMENT
              </h3>
              <p className="font-body text-on-surface-variant text-lg leading-relaxed mb-8">
                Stop fighting your tools. Our boards are designed for
                high-density information processing without the clutter. Pure
                architectural hierarchy.
              </p>
              <ul className="space-y-4 font-headline text-sm font-bold">
                <li className="flex items-center gap-3 text-white border-b-2 border-outline-variant/10 pb-2">
                  <span className="material-symbols-outlined text-[#FF00FF]">
                    bolt
                  </span>{" "}
                  ZERO LATENCY_ENGINE
                </li>
                <li className="flex items-center gap-3 text-white border-b-2 border-outline-variant/10 pb-2">
                  <span className="material-symbols-outlined text-[#FF00FF]">
                    grid_view
                  </span>{" "}
                  BENTO GRID_LAYOUTS
                </li>
                <li className="flex items-center gap-3 text-white border-b-2 border-outline-variant/10 pb-2">
                  <span className="material-symbols-outlined text-[#FF00FF]">
                    analytics
                  </span>{" "}
                  REAL_TIME_METRICS
                </li>
              </ul>
            </div>
            <div className="lg:col-span-8 bg-[#1C1B1B] border-2 border-[#CCFF00] p-4 md:p-8 relative">
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-[#FF00FF]"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#FF00FF]"></div>
              <div className="flex items-center justify-between mb-8 border-b-2 border-outline-variant/20 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#CCFF00] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#0A0A0A]">
                      dashboard
                    </span>
                  </div>
                  <h4 className="font-headline font-bold text-lg text-white">
                    NEON LABS / Q4_SPRINT
                  </h4>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-error rounded-full"></div>
                  <div className="w-3 h-3 bg-primary-fixed-dim rounded-full"></div>
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-4">
                  <div className="bg-[#131313] p-4 border-l-4 border-[#CCFF00]">
                    <span className="font-headline text-[10px] text-[#CCFF00] font-bold">
                      TODO
                    </span>
                    <p className="font-body text-sm mt-2 font-semibold text-white uppercase">
                      Refactor Core API
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="bg-[#FF00FF]/10 text-[#FF00FF] font-headline text-[10px] px-2 py-1 border border-[#FF00FF]/30">
                        CRITICAL
                      </span>
                      <span className="material-symbols-outlined text-xs text-on-surface-variant">
                        person
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#131313] p-4 border-l-4 border-outline">
                    <span className="font-headline text-[10px] text-outline font-bold">
                      TODO
                    </span>
                    <p className="font-body text-sm mt-2 font-semibold text-white uppercase">
                      Implement Auth0
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="bg-surface-container-highest text-on-surface-variant font-headline text-[10px] px-2 py-1">
                        BACKLOG
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="bg-[#131313] p-4 border-l-4 border-[#FF00FF]">
                    <span className="font-headline text-[10px] text-[#FF00FF] font-bold">
                      ACTIVE
                    </span>
                    <p className="font-body text-sm mt-2 font-semibold text-white uppercase">
                      UI System Audit
                    </p>
                    <div className="mt-4 w-full h-1 bg-surface-container-high">
                      <div className="w-2/3 h-full bg-[#FF00FF]"></div>
                    </div>
                  </div>
                  <div className="bg-surface-container-high border-2 border-dashed border-outline-variant/30 h-32 flex items-center justify-center">
                    <span className="material-symbols-outlined text-outline-variant">
                      add
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="bg-[#131313] p-4 border-l-4 border-secondary">
                    <span className="font-headline text-[10px] text-secondary font-bold">
                      REVIEW
                    </span>
                    <p className="font-body text-sm mt-2 font-semibold text-white uppercase">
                      Database Migration
                    </p>
                    <div className="mt-4 flex -space-x-2">
                      <div className="w-6 h-6 border-2 border-[#131313] bg-surface-variant"></div>
                      <div className="w-6 h-6 border-2 border-[#131313] bg-[#CCFF00]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-32 px-6 md:px-24 bg-[#1C1B1B]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            <div className="bg-[#131313] p-12 aspect-square flex flex-col justify-between hover:border-[#CCFF00] hover:bg-[#CCFF00] group transition-all duration-300">
              <span className="font-headline text-5xl font-black text-[#CCFF00] group-hover:text-[#0A0A0A]">
                01
              </span>
              <div>
                <h5 className="font-headline text-2xl font-black mb-4 uppercase group-hover:text-[#0A0A0A]">
                  STRATEGIC
                  <br />
                  ANARCHY
                </h5>
                <p className="font-body text-on-surface-variant group-hover:text-[#0A0A0A]/80">
                  We don't follow best practices. We define them.
                </p>
              </div>
            </div>
            <div className="bg-[#131313] p-12 aspect-square flex flex-col justify-between border-2 border-outline-variant/20 hover:border-[#FF00FF] hover:bg-[#FF00FF] group transition-all duration-300 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#FF00FF] rotate-45 opacity-20"></div>
              <span className="font-headline text-5xl font-black text-outline">
                02
              </span>
              <div>
                <h5 className="font-headline text-2xl font-black mb-4 uppercase">
                  DIGITAL
                  <br />
                  PRECISION
                </h5>
                <p className="font-body text-on-surface-variant">
                  Calculated risks backed by raw, unadulterated data.
                </p>
              </div>
            </div>
            <div className="bg-[#131313] p-12 aspect-square flex flex-col justify-between border-2 border-outline-variant/20 hover:border-[#CCFF00] hover:bg-[#CCFF00] group transition-all duration-300">
              <span className="font-headline text-5xl font-black text-outline">
                03
              </span>
              <div>
                <h5 className="font-headline text-2xl font-black mb-4 uppercase">
                  VOID
                  <br />
                  ARCHITECTURE
                </h5>
                <p className="font-body text-on-surface-variant">
                  Built in the shadows to illuminate the future.
                </p>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
};

export default Introduce;
