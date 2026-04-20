import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import z from "zod";
import api from "../mock/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

const GOOGLE_LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDFyGtyvgrTnxtkmRNmtWI_SXU7pQo8bzsp2jHFqmhNb1bNw5AeNPK2PO69cZ1tvMKTYS2EBhQ6bp-jnoQnAjlc-6ZtRtBhW37pgb7RlaQZJfYw9nsZ3UX51IVewDgf67fXoI2Ggs2-lHTXuw5Ehp1ZmSKermbQQVIwh2nhVJsMJQ_WXBA_UVmJOXPHJxqeQZ4giBwsm-iuOyr1rXiOahD1oeTMtOVfTQy0DifEtrLAEEiB8XCn9uZn0KOTMwjDVm5U_GuWPGrxtOE";
const MS_LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBGf5y2MEAywh6GofnPF6U4X0xSuwBgD0hmlMHQdY2KVpeaWnlrxgrfeAExj2VtiVQpbD-bgbSPA6bNlKW8ZlEaP2XfoUORx3pcafqadddd9NjbTQY9xJOYEAhBLct2azyyjfOnrz18cpBZ-LzNpabv6MPsypSUd4f1i91-S1e-lkifEtjQ_mWYviho2V2MQwRmYMDHyjRHG3G_SNeJ1DtNvjgXczlW4DlwhZT-z_LCUHOGECfiIXD_Bg9_xOlwfFs_d7-RVjjhUbQ";
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const nav = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const onHandleSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = { ...data, role: "user" };
      await api.post("/register", payload);
      toast.success("Register Success!");
      nav("/login");
    } catch (error) {
      const msg =
        error.response?.status === 400
          ? "Email already exists."
          : "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col overflow-x-hidden">
      {/* <header className="fixed top-0 w-full z-50 flex justify-between items-center h-16 px-8 bg-surface/80 backdrop-blur-md border-b-2 border-primary-container">
        <div className="font-headline text-2xl font-black tracking-tighter text-primary-container">
          ANARCHY.OS
        </div>
        <div className="flex items-center gap-6">
          <span className="font-label text-[10px] tracking-[0.3em] text-on-surface/50">
            SYSTEM_AUTH_V2.01
          </span>
          <div className="w-2 h-2 bg-primary-container animate-pulse"></div>
        </div>
      </header> */}
      <main className="grow flex items-center justify-center pt-4 pb-12 px-6">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-0 border-2 border-outline-variant/30">
          <div className="hidden lg:flex lg:col-span-7 relative bg-surface-container-lowest overflow-hidden border-r-2 border-outline-variant/30 flex-col justify-end p-12">
            <div className="absolute top-0 left-0 w-full h-full opacity-40">
              <img
                alt="Cyberpunk high-tech circuitry background with glowing neon green lines and dark industrial textures"
                className="w-full h-full object-cover grayscale brightness-50 contrast-125"
                data-alt="Close-up of futuristic hardware motherboard with glowing neon green trails and deep shadows in a high-tech lab setting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaBG_g5NguJEx8vb4x8CYk75BgHpEkL2TT0Wc_S6760QB4vC8SfgH5-ZkHziH21irQXinm4cQ7VCJq2-6oIYKjMKo4g7tyZbz1a1hJPwXaL4OL5yFWqs4nmH7BZ1qFoOxXo_U_E_Fk5E8Wazc0t2wOpyeKHQEBkwPAjXvjIq6mQ4hH8OJ0IY8Ts8TRVyaDBI6a0QMIeqBdeR2EpYvFb_s4ytaSn9vyh8fB_WoWpzUBU2PkI4YLy8KN1vjxfGwZ-dJNO5s_E5WhuWE"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
            </div>
            <div className="relative z-10">
              <div className="mb-4 inline-block bg-primary-container text-on-primary px-3 py-1 font-label text-[10px] font-bold tracking-[0.2em] uppercase">
                PHASE_01: ENLISTMENT
              </div>
              <h1 className="font-headline text-6xl font-black tracking-tighter uppercase leading-none text-white mb-6">
                Break the <span className="text-primary-container">Cycle</span>.
                <br />
                Deploy the <span className="text-primary-container">Code</span>.
              </h1>
              <p className="font-body text-lg text-on-surface-variant max-w-md leading-relaxed border-l-2 border-primary-container pl-6">
                This is not a registration. This is a synchronization with the
                underground node. Your identity remains encrypted. Your intent
                must be absolute.
              </p>
            </div>
          </div>
          <div className="lg:col-span-5 bg-surface p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-10">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-white uppercase mb-2">
                Initialize Profile
              </h2>
              <p className="font-label text-xs tracking-widest text-on-surface-variant uppercase">
                Required fields for system entry
              </p>
            </div>
            <form className="space-y-8" onSubmit={handleSubmit(onHandleSubmit)}>
              <div className="group">
                <label className="block font-label text-[10px] tracking-[0.2em] text-outline uppercase mb-2 group-focus-within:text-secondary-fixed transition-colors">
                  Full Alias / Name
                </label>
                <input
                  {...register("name")}
                  className="w-full bg-slate-200 border-0 border-b-2 border-outline focus:border-primary-container focus:ring-0 text-on-surface font-body p-3 transition-all placeholder:text-black/20"
                  placeholder="e.g. ZERO_ONE"
                  type="text"
                />
                {errors.name && <p>{errors.name?.message}</p>}
              </div>
              <div className="group">
                <label className="block font-label text-[10px] tracking-[0.2em] text-outline uppercase mb-2 group-focus-within:text-secondary-fixed transition-colors ">
                  Secure Email Address
                </label>
                <input
                  {...register("email")}
                  className="w-full bg-surface-slate-200 border-0 border-b-2 border-outline focus:border-primary-container focus:ring-0 text-on-surface font-body p-3 transition-all placeholder:text-black/20"
                  placeholder="protocol@anarchy.os"
                  type="email"
                />
                {errors.email && <p>{errors.email?.message}</p>}
              </div>
              <div className="group">
                <label className="block font-label text-[10px] tracking-[0.2em] text-outline uppercase mb-2 group-focus-within:text-secondary-fixed transition-colors">
                  Encryption Key (Password)
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    className="w-full bg-surface-slate-200 border-0 border-b-2 border-outline focus:border-primary-container focus:ring-0 text-on-surface font-body p-3 transition-all placeholder:text-black/20"
                    placeholder="••••••••••••"
                    type="password"
                  />
                  {errors.password && <p>{errors.password?.message}</p>}
                  <span className="material-symbols-outlined absolute right-3 top-3 text-outline cursor-pointer hover:text-primary-container">
                    visibility
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3 mt-4">
                <div className="relative flex items-center h-5">
                  <input
                    className="w-5 h-5 bg-surface-container-low border-2 border-outline text-primary-container focus:ring-0 rounded-none cursor-pointer"
                    type="checkbox"
                  />
                </div>
                <label className="font-label text-[10px] leading-tight text-on-surface-variant uppercase">
                  I accept the{" "}
                  <Link
                    to={"#"}
                    className="text-primary-container hover:underline"
                  >
                    Terms of Defiance
                  </Link>{" "}
                  and{" "}
                  <Link
                    to={"#"}
                    className="text-primary-container hover:underline"
                  >
                    Privacy Blackhole Policy
                  </Link>
                  .
                </label>
              </div>
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-container text-on-primary font-headline font-black py-5 text-lg tracking-widest uppercase flex items-center justify-center gap-3 group relative transition-transform active:translate-x-1 active:translate-y-1 disabled:opacity-60"
                >
                  {loading ? "PROCESSING..." : "JOIN THE REVOLUTION"}
                  {!loading && (
                    <span className="material-symbols-outlined font-bold group-hover:translate-x-2 transition-transform">
                      arrow_forward
                    </span>
                  )}
                  <div className="absolute -right-1 -bottom-1 w-full h-full border-2 border-[#FF00FF] -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            </form>
            <div className="mt-12 pt-8 border-t border-outline-variant/30 flex flex-col gap-4">
              <p className="font-label text-[10px] tracking-widest text-white text-center uppercase">
                Are you have an account?{" "}
                <Link
                  to={"/login"}
                  className="text-primary-container font-bold hover:underline"
                >
                  LOGIN_NOW!
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full py-8 px-8 flex flex-col md:flex-row justify-between items-center gap-6 mt-auto border-t-2 border-outline-variant/10">
        <div className="flex gap-8">
          <a
            className="font-label text-[10px] tracking-[0.2em] text-on-surface/40 hover:text-primary-container transition-colors uppercase"
            href="#"
          >
            Network Status
          </a>
          <a
            className="font-label text-[10px] tracking-[0.2em] text-on-surface/40 hover:text-primary-container transition-colors uppercase"
            href="#"
          >
            Privacy Protocol
          </a>
          <a
            className="font-label text-[10px] tracking-[0.2em] text-on-surface/40 hover:text-primary-container transition-colors uppercase"
            href="#"
          >
            Terminal Documentation
          </a>
        </div>
        <div className="font-label text-[10px] tracking-[0.3em] text-on-surface/20 uppercase">
          © 2024 ANARCHY.OS // ALL RIGHTS RESERVED
        </div>
      </footer>
      <div className="fixed bottom-0 right-0 p-4 pointer-events-none hidden md:block">
        <div className="w-24 h-24 border-r-4 border-b-4 border-primary-container opacity-20"></div>
      </div>
      <div className="fixed top-0 left-0 p-4 pointer-events-none hidden md:block">
        <div className="w-24 h-24 border-l-4 border-t-4 border-primary-container opacity-20"></div>
      </div>
    </div>
  );
};

export default Register;
