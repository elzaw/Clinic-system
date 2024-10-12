import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import api from "@/data/instance";

const Login = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const { login, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const handleRegisterClick = () => {
    navigate("/register"); // Navigate to the /register page
  };
  const onSubmit = async (data) => {
    console.log(data);

    try {
      const response = await api.post("/doctors/login", data);
      toast.success("تم تسجيل الدخول بنجاح");
      login(response.data);
      navigate("/");

      reset();
    } catch (error) {
      toast.error("تأكد من البيانات المدخلة");
      console.error("Error during login:", error);
    }
  };
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center h-48">
          {/* <MountainIcon className="h-10 w-10 text-gray-900 dark:text-gray-50" /> */}
          {/* <img src={RiseDentalLogo} alt="logo" /> */}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="rounded bg-white border py-20 ">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">مرحبا بك</CardTitle>
              <CardDescription>أدخل بياناتك للوصول إلى حسابك.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 ">
              <div className="space-y-2 ">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  {...register("username", { required: true })}
                  placeholder="أدخل اسم المستخدم الخاص بك"
                  type="text"
                  className="rounded"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  {...register("password", { required: true })}
                  placeholder="أدخل كلمة المرور الخاصة بك"
                  type="password"
                  className="rounded"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button className="w-6/12 bg-[#000080] text-white hover:bg-[#000095] rounded">
                تسجيل الدخول
              </Button>
            </CardFooter>
            <p className="text-center">
              you don't have email{" "}
              <span
                className="text-blue-900 underline cursor-pointer "
                onClick={handleRegisterClick}
              >
                Register
              </span>{" "}
            </p>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default Login;
