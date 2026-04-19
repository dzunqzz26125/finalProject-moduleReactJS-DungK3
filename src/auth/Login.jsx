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
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
const Login = () => {
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
      const res = await api.post("/login", data);
      localStorage.setItem("users", JSON.stringify(res.data.user));
      localStorage.setItem("accessToken", JSON.stringify(res.data.accessToken));
      toast.success("Login Success!");
      nav("/app/workspaces");
    } catch (error) {
      const msg =
        error.response?.status === 400
          ? "Invalid email or password."
          : "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="font-body selection:bg-primary selection:text-on-primary">
      <main className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#CCFF00 1px, transparent 1px), linear-gradient(90deg, #CCFF00 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-0 z-10">
          <div className="md:col-span-5 flex flex-col justify-between p-8 bg-surface border-2 border-primary">
            <div>
              <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter text-primary leading-none uppercase mb-4">
                ANARCHY.OS
              </h1>
              <div className="inline-flex items-center px-3 py-1 anarchy-glitch mb-8">
                <span className="font-label text-xs font-bold tracking-[0.2em] text-tertiary">
                  SYSTEM_STATUS: BREACHED
                </span>
              </div>
              <p className="font-body text-lg text-on-surface-variant max-w-sm leading-relaxed">
                Control is an illusion. We provide the tools to build your own
                reality. Enter the void.
              </p>
            </div>
            <div className="mt-12 hidden md:block">
              <div className="flex items-center gap-4 text-primary opacity-50">
                <span className="font-label text-xs tracking-widest">
                  EST_2024
                </span>
                <div className="h-px grow bg-primary"></div>
                <span className="font-label text-xs tracking-widest">
                  VER_0.4.1
                </span>
              </div>
            </div>
          </div>
          <div className="md:col-span-7 bg-surface-container-low p-8 md:p-16 border-t-0 md:border-t-2 md:border-b-2 md:border-r-2 border-primary">
            <div className="max-w-md mx-auto">
              <header className="mb-12">
                <h2 className="font-headline text-3xl font-bold text-on-surface uppercase tracking-tight mb-2">
                  IDENTIFICATION_REQUIRED
                </h2>
                <p className="font-label text-sm text-tertiary opacity-80">
                  PROHIBITED ACCESS DETECTED. VALIDATE CREDENTIALS.
                </p>
              </header>
              <form
                className="space-y-10"
                onSubmit={handleSubmit(onHandleSubmit)}
              >
                <div className="group relative">
                  <label
                    className="font-label text-xs uppercase tracking-widest text-primary mb-2 block group-focus-within:text-tertiary transition-colors"
                    htmlFor="email"
                  >
                    EMAIL
                  </label>
                  <input
                    className="w-full bg-surface-container border-0 border-b-2 border-outline focus:border-primary focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 font-body py-4 px-0 transition-all"
                    id="email"
                    placeholder="name@domain.sh"
                    type="email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="font-label text-xs text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="group relative">
                  <label
                    className="font-label text-xs uppercase tracking-widest text-primary mb-2 block group-focus-within:text-tertiary transition-colors"
                    htmlFor="password"
                  >
                    PASSWORD
                  </label>
                  <input
                    className="w-full bg-surface-container border-0 border-b-2 border-outline focus:border-primary focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 font-body py-4 px-0 transition-all"
                    id="password"
                    placeholder="••••••••••••"
                    type="password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="font-label text-xs text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="pt-4">
                  <button
                    className="w-full bg-[#CCFF00] from-primary to-primary-fixed-dim text-on-primary font-headline font-black py-5 px-8 flex justify-between items-center group transition-all active:translate-x-1 active:translate-y-1 hover:brightness-110"
                    type="submit"
                    disabled={loading}
                  >
                    <span className="tracking-widest">
                      {loading ? "LOGGING IN..." : "LOGIN"}
                    </span>
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">
                      terminal
                    </span>
                  </button>
                </div>
              </form>
              <div className="my-12 flex items-center gap-6">
                <div className="h-0.5 grow bg-outline-variant opacity-30"></div>
                <span className="font-label text-[10px] text-on-surface-variant tracking-[0.3em]">
                  FEDERATED_LOGIN
                </span>
                <div className="h-0.5 grow bg-outline-variant opacity-30"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 border-2 border-outline py-4 font-label text-xs font-bold tracking-widest hover:border-primary transition-colors hover:bg-surface-container-high uppercase">
                  <span className="material-symbols-outlined text-base">
                    cloud
                  </span>
                  Google
                </button>
                <button className="flex items-center justify-center gap-3 border-2 border-outline py-4 font-label text-xs font-bold tracking-widest hover:border-primary transition-colors hover:bg-surface-container-high uppercase">
                  <span className="material-symbols-outlined text-base">
                    grid_view
                  </span>
                  Microsoft
                </button>
              </div>
              <footer className="mt-12 text-center">
                <p className="font-body text-sm text-on-surface-variant">
                  YOU DON'T HAVE AN ACCOUNT ?{" "}
                  <Link
                    className="text-tertiary font-bold hover:underline underline-offset-4"
                    to="/register"
                  >
                    REGISTER_NOW!
                  </Link>
                </p>
              </footer>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-10 hidden lg:block opacity-20">
          <div className="font-headline text-8xl font-black text-primary leading-none select-none">
            01010101
          </div>
        </div>
        <div className="absolute top-10 right-10 hidden lg:flex flex-col items-end gap-2 opacity-40">
          <div className="w-12 h-1 bg-tertiary"></div>
          <div className="w-24 h-1 bg-primary"></div>
          <div className="w-8 h-1 bg-on-surface"></div>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 opacity-10 blur-xl pointer-events-none">
          <img
            className="w-full h-full object-cover"
            data-alt="Abstract close-up of server room cables and glowing green LEDs in a dark technological environment with motion blur"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZqNIU3mtLCNSxRwm4LpEfKSJthuBgRlz3jY_NvVMMXU8gYNJlNnxAku1fIpht6roCv1EyKb2Tnzw3vt9Hddfa0BKF-SUGA4aQ9O6MLZkGGvE1tfUgv-Nq1Zu01KgkBIi9EnDJt2v1wtbS6-XyhCt80qZyalfPCA316bTjpiCVsPedrHrFDNCuc3I1noDy0H8dz3sVqz5SFDmwbhs1TOUliSaNO2r9psuGydz9HYJUaYW5vcXfCJ4ksseHU2UCngU-0dpEiC4qzBo"
          />
        </div>
      </main>
    </div>
  );
};

export default Login;
