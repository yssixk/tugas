import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { Container } from "../../components/ui/Container";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Spinner } from "../../components/ui/Spinner";
import { useAuth } from "../../stores/auth";

const schema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(1),
});
type FormValues = z.infer<typeof schema>;

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const { data } = await api.post("/auth/admin/login", values);
      setSession(data.token, data.user);
      toast.success("Login admin berhasil");
      navigate("/admin");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Login admin gagal");
    }
  };

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-semibold">Login Admin</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Masuk sebagai admin untuk kelola toko.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-medium">Email / Username</label>
            <Input error={errors.identifier?.message} {...register("identifier")} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <Input type="password" error={errors.password?.message} {...register("password")} />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            Login admin
          </Button>
        </form>
      </div>
    </Container>
  );
}

