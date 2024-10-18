import registerSVG from "../../assets/undraw_sign_up_n6im.svg";

import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import api from "@/data/instance";
import { useState } from "react";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const handleRegisterClick = () => {
    navigate("/login"); // Navigate to the /login page
  };

  const onSubmit = async (data) => {
    const { confirmPassword, ...registerData } = data; // Exclude confirmPassword from registration data

    if (data.password !== confirmPassword) {
      toast.error("كلمة السر غير متطابقة");
      return;
    }

    setIsLoading(true); // Set loading state
    try {
      const response = await api.post("/doctors/", registerData); // Use registerData without confirmPassword
      // Handle successful response, e.g., redirect or show success message
      toast.success("تم التسجيل بنجاح. يمكنك تسجيل الدخول الان.");
      // Redirect to login page after successful registration
      navigate("/login"); // Redirect to login after successful registration
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to register. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center h-48">
          {/* Optional Logo or Image */}
          <img src={registerSVG} alt="logo" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="rounded bg-white border py-3 m-8 ">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">مرحبا بك</CardTitle>
              <CardDescription>أدخل بياناتك للوصول إلى حسابك.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 ">
              <div className="space-y-2 ">
                <Label htmlFor="name">الاسم</Label>
                <Input
                  id="name"
                  {...register("name", { required: "الاسم مطلوب" })}
                  placeholder="أدخل الاسم الخاص بك"
                  type="text"
                  className="rounded"
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2 ">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  {...register("username", { required: "اسم المستخدم مطلوب" })}
                  placeholder="أدخل اسم المستخدم الخاص بك"
                  type="text"
                  className="rounded"
                />
                {errors.username && (
                  <p className="text-red-500">{errors.username.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  {...register("password", { required: "كلمة المرور مطلوبة" })}
                  placeholder="أدخل كلمة المرور الخاصة بك"
                  type="password"
                  className="rounded"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <Input
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    required: "تأكيد كلمة المرور مطلوب",
                  })}
                  placeholder="أدخل كلمة المرور مرة اخرى"
                  type="password"
                  className="rounded"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-6/12 bg-[#000080] text-white hover:bg-[#000095] rounded"
              >
                {isLoading ? "جاري التسجيل..." : "تسجيل الدخول"}
              </Button>
            </CardFooter>
            <p className="text-center">
              لديك بالفعل حساب{" "}
              <span
                className="text-blue-900 underline cursor-pointer "
                onClick={handleRegisterClick}
              >
                تسجيل الدخول
              </span>{" "}
            </p>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default Register;
