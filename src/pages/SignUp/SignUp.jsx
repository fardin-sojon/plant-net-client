import { Link, useLocation, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { TbFidgetSpinner } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { imageUpload, saveOrUpdateUser } from "../../utils";
import { useState } from "react";

// axios.<method> will now provide autocomplete and parameter typings


const SignUp = () => {
  const { createUser, updateUserProfile, signInWithGoogle, loading, setLoading } =
    useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  // console.log(watch);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state || "/";

  const onSubmit = async (data) => {
    // console.log(data);
    const { name, image, email, password } = data;
    const imageFile = image[0];
    // const formData = new FormData();
    // formData.append("image", imageFile);

    try {
      setLoading(true)
      // IMageBB
      // const {data} = await axios.post(
      //   `https://api.imgbb.com/1/upload?key=${
      //     import.meta.env.VITE_IMGBB_API_KEY
      //   }`,
      //   formData
      // );
      // console.log(data.data.display_url);
      const imageURL = await imageUpload(imageFile)

      //2. User Registration
      const result = await createUser(email, password);

      //3. Save username & profile photo
      await updateUserProfile(
        name,
        imageURL
      );

      // save or update user in db
      await saveOrUpdateUser({
        name,
        image: imageURL,
        email,
      })
      navigate(from, { replace: true });
      toast.success("Signup Successful");
    } catch (err) {
      // console.log(err);
      toast.error(err?.message);
      setLoading(false)
    }
  };
  // form submit handler
  // const handleSubmit = async event => {
  //   event.preventDefault()
  //   const form = event.target
  //   const name = form.name.value
  //   const email = form.email.value
  //   const password = form.password.value

  //   try {
  //     //2. User Registration
  //     const result = await createUser(email, password)

  //     //3. Save username & profile photo
  //     await updateUserProfile(
  //       name,
  //       'https://lh3.googleusercontent.com/a/ACg8ocKUMU3XIX-JSUB80Gj_bYIWfYudpibgdwZE1xqmAGxHASgdvCZZ=s96-c'
  //     )
  //     console.log(result)

  //     navigate(from, { replace: true })
  //     toast.success('Signup Successful')
  //   } catch (err) {
  //     console.log(err)
  //     toast.error(err?.message)
  //   }
  // }

  // Handle Google Signin
  const handleGoogleSignIn = async () => {
    try {
      //User Registration using google
      const result = await signInWithGoogle();
      const user = result.user
      // save or update user in db
      await saveOrUpdateUser({
        name: user?.displayName,
        image: user?.photoURL,
        email: user?.email,
      })
      navigate(from, { replace: true });
      toast.success("Signup Successful");
    } catch (err) {
      // console.log(err);
      toast.error(err?.message);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900">
        <div className="mb-8 text-center">
          <h1 className="my-3 text-4xl font-bold">Sign Up</h1>
          <p className="text-sm text-gray-400">Welcome to PlantNet</p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate=""
          action=""
          className="space-y-6 ng-untouched ng-pristine ng-valid"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Your Name Here"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900"
                data-temp-mail-org="0"
                {...register("name", { required: true })}
              />
              {errors.name?.type === "required" && (
                <p className="text-red-500">Name is required.</p>
              )}
            </div>
            {/* Image */}
            {/* Image */}
            <div>
              <label
                htmlFor="image"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Profile Image
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    name="image"
                    type="file"
                    id="image"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-lime-50 file:text-lime-700
          hover:file:bg-lime-100
          bg-gray-100 border border-dashed border-lime-300 rounded-md cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400
          py-2"
                    {...register("image", { required: true })}
                  />
                </div>
                {watch("image") && watch("image").length > 0 && (
                  <div className="relative w-16 h-16">
                    <img
                      src={URL.createObjectURL(watch("image")[0])}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-full border-2 border-lime-300"
                    />
                    <button
                      type="button"
                      onClick={() => setValue("image", null)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md z-10"
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-400">
                PNG, JPG or JPEG (max 2MB)
              </p>
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="Enter Your Email Here"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900"
                data-temp-mail-org="0"
                {...register("email", {
                  required: true,
                  pattern: emailRegex,
                })}
              />
              {errors.email?.type === "required" && (
                <p className="text-red-500">Email is required.</p>
              )}
            </div>
            <div>
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm mb-2">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  id="password"
                  required
                  placeholder="*******"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900 pr-10"
                  {...register("password", {
                    required: "Password is required",
                    minLength: 8,
                    pattern: passwordRegex,
                    // message:
                    //   "Password must be ≥8 chars and include uppercase, lowercase, number and special character.",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password?.type === "required" && (
                <p className="text-red-500">Password is required.</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="text-red-500">
                  Password must be 8 characters or longer
                </p>
              )}
              {errors.password?.type === "pattern" && (
                <p className="text-red-500">
                  Password must contain at least one uppercase letter, one
                  lowercase letter, one number, and one special character.
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-lime-500 w-full rounded-md py-3 text-white"
            >
              {loading ? (
                <TbFidgetSpinner className="animate-spin m-auto" />
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </form>
        <div className="flex items-center pt-4 space-x-1">
          <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
          <p className="px-3 text-sm dark:text-gray-400">
            Signup with social accounts
          </p>
          <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
        </div>
        <div
          onClick={handleGoogleSignIn}
          className="flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 border-rounded cursor-pointer"
        >
          <FcGoogle size={32} />

          <p>Continue with Google</p>
        </div>
        <p className="px-6 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="hover:underline hover:text-lime-500 text-gray-600"
          >
            Login
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default SignUp;
