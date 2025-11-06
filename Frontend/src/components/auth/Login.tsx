import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import logo from "@/assets/images/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { loginSchema } from "@/schemas/authSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { AuthService } from "@/services/authService";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/store/slice/authSlice";
import type { RootState } from "@/store/store";
import Loading from "../common/Loading";

export type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispath = useDispatch();
  const navigate = useNavigate();
  const {isAuthenticated} = useSelector((state:RootState)=>state.auth);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/myFeed");
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting login data:", data);
      const response = await AuthService.login(data);
      console.log(`Login Successfull with status ${response.status}`);
      dispath(
        setCredentials({
          user: response.user,
          accessToken: response.accessToken,
        })
      );
      toast.success(response.message);
      navigate(`/user/dashboard`);
    } catch (error: unknown) {
      console.log("Login error:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    <Loading content="Loading login form..."/>;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <img src={logo} className="w-20 h-20 mr-2" alt="Quiz Master Pro logo" />
          <div>
            <h1 className="text-2xl font-bold text-white">Quiz Master Pro</h1>
            <p className="text-sm text-gray-400">Login Page</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="bg-gray-700 border-gray-600 text-white focus:ring-indigo-500"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Password</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="bg-gray-700 border-gray-600 text-white focus:ring-indigo-500"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-4 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <div className="mt-4 text-center text-sm flex justify-between">
              <Link
                to="/auth/forgot-password"
                className="text-indigo-400 hover:text-indigo-300"
              >
                Forgot Password?
              </Link>
              <Link
                to="/auth?path=register"
                className="text-indigo-400 hover:text-indigo-300"
              >
                {/* eslint-disable-next-line */}
                Don't have an account? Register
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
