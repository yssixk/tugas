import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Spinner } from "../components/ui/Spinner";

const schema = z
  .object({
    fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
    username: z.string().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/, "Username hanya huruf/angka/_"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Konfirmasi password wajib"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak sama",
  });

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await api.post("/auth/register", values);
      toast.success("Registrasi berhasil. Silakan login.");
      navigate("/login");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Registrasi gagal");
    }
  };

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-semibold">Registrasi</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Buat akun baru untuk mulai belanja.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-medium">Nama lengkap</label>
            <Input error={errors.fullName?.message} {...register("fullName")} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Username</label>
            <Input error={errors.username?.message} {...register("username")} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <Input error={errors.email?.message} {...register("email")} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <Input type="password" error={errors.password?.message} {...register("password")} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Konfirmasi password</label>
            <Input type="password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            Buat akun
          </Button>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            Sudah punya akun?{" "}
            <Link className="font-medium text-emerald-700 hover:underline dark:text-emerald-300" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </Container>
  );
}

