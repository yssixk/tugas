import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { useAuth } from "../stores/auth";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Spinner } from "../components/ui/Spinner";

const schema = z.object({
  identifier: z.string().min(3, "Email/username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const { data } = await api.post("/auth/login", values);
      setSession(data.token, data.user);
      toast.success("Login berhasil");
      navigate("/products");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Login gagal");
    }
  };

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Masuk untuk belanja dan checkout.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-medium">Email / Username</label>
            <Input placeholder="contoh: user@email.com" error={errors.identifier?.message} {...register("identifier")} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <Input type="password" error={errors.password?.message} {...register("password")} />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            Login
          </Button>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            Belum punya akun?{" "}
            <Link className="font-medium text-emerald-700 hover:underline dark:text-emerald-300" to="/register">
              Registrasi
            </Link>
          </p>
        </form>
      </div>
    </Container>
  );
}

