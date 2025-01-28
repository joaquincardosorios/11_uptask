import { useForm } from "react-hook-form";
import { UserLoginForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";

export default function LoginView() {

  const initialValues: UserLoginForm = {
    email: '',
    password: '',
  }
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

  const handleLogin = (formData: UserLoginForm) => { }

    return (
    <>
    <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-8 p-10 bg-white"
        noValidate
    >
        <div className="flex flex-col gap-5">
            <label
                className="font-normal text-2xl"
            >Email</label>
            <div>
                <input
                    id="email"
                    type="email"
                    placeholder="E.g., user@email.com"
                    className="w-full p-3  border-gray-300 border"
                    {...register("email", {
                    required: "Email es required",
                    pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Email invalid",
                    },
                    })}
                />
                {errors.email && (
                    <ErrorMessage>{errors.email.message}</ErrorMessage>
                )}
            </div>
        </div>

        <div className="flex flex-col gap-5">
            <label
                className="font-normal text-2xl"
            >Password</label>
            <div>
                <input
                    type="password"
                    placeholder="********"
                    className="w-full p-3  border-gray-300 border"
                    {...register("password", {
                    required: "Password is required",
                    })}
                />
                {errors.password && (
                    <ErrorMessage>{errors.password.message}</ErrorMessage>
                )}
            </div>
        </div>

        <input
            type="submit"
            value='Login'
            className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>
    </>
  )
}