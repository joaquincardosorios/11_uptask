import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ForgotPasswordForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function ForgotPasswordView() {
  const initialValues: ForgotPasswordForm = {
    email: ''
  }
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });
  
  const { mutate } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toast.success(data)
      reset()
    },
    onError: (errors : string[]) => {
      errors.forEach( (message) => toast.error(message))
    }
  })

  const handleForgotPassword = (formData: ForgotPasswordForm) => mutate(formData)


  return (
    <>
      <h1 className="text-5xl font-black text-white">Forgot password</h1>
      <p className="text-2xl font-light text-white mt-5">
      Forgot your password? Enter your email and {''}
        <span className=" text-fuchsia-500 font-bold"> reset your password</span>
      </p>
      <form
        onSubmit={handleSubmit(handleForgotPassword)}
        className="space-y-8 p-10 mt-10 bg-white"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl"
            htmlFor="email"
          >Email</label>
          <div>

            <input
              id="email"
              type="email"
              placeholder="E.g., user@email.com"
              className="w-full p-3  border-gray-300 border"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email",
                },
              })}
            />
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </div>
        </div>

        <input
          type="submit"
          value='Send instructions'
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
      <Link 
        to={'/auth/login'}
        className="text-center text-gray-300 font-normal"
      >Already have an account? Log in.</Link>

      <Link 
        to={'/auth/register'}
        className="text-center text-gray-300 font-normal"
      >Don't have an account? Sign up.</Link>
      </nav>
    </>
  )
}