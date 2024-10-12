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

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {};
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center h-48">
          {/* <MountainIcon className="h-10 w-10 text-gray-900 dark:text-gray-50" /> */}
          {/* <img src={RiseDentalLogo} alt="logo" /> */}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="rounded bg-white">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">مرحبا بك</CardTitle>
              <CardDescription>أدخل بياناتك للوصول إلى حسابك.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-end">
              <div className="space-y-2 ">
                <label htmlFor="username">اسم المستخدم</label>
                <input
                  id="username"
                  {...register("username", { required: true })}
                  placeholder="أدخل اسم المستخدم الخاص بك"
                  type="text"
                  className="text-end rounded"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password">كلمة المرور</label>
                <input
                  id="password"
                  {...register("password", { required: true })}
                  placeholder="أدخل كلمة المرور الخاصة بك"
                  type="password"
                  className="text-end rounded"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button className="w-6/12 bg-[#000080] text-white hover:bg-[#000095] rounded">
                تسجيل الدخول
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default Login;
