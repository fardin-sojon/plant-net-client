import { useForm } from "react-hook-form";
import { useState } from "react";
import { imageUpload } from "../../utils";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import LoadingSpinner from "../Shared/LoadingSpinner";
import ErrorPage from "../../pages/ErrorPage";
import { TbFidgetSpinner } from "react-icons/tb";
import toast from "react-hot-toast";

const AddPlantForm = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // useMutation hook useCase(POST || PUT || PATCH || DELETE)
  const {
    isPending,
    isError,
    mutateAsync,
    reset: mutationReset,
  } = useMutation({
    mutationFn: async (payload) =>
      await axios.post(`${import.meta.env.VITE_API_URL}/plants`, payload),
    onSuccess: (data) => {
      // console.log(data);
      toast.success("Your Plant has been Added")
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your Plant has been Added",
        showConfirmButton: false,
        timer: 2000,
      });
      mutationReset();
      // Query key invalidate
    },
    onError: (error) => {
      // console.log(error);
    },
    onMutate: (payload) => {
      // console.log("I will post this data --->", payload);
    },
    onSettled: (data, error) => {
      // console.log(data);
      if (error) {
        // console.log(error);
      }
    },
    retry: 3,
  });

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    // console.log(data);
    const { name, description, quantity, price, category, image } = data;
    const imageFile = image[0];

    try {
      const imageUrl = await imageUpload(imageFile);
      const plantData = {
        name,
        image: imageUrl,
        price: Number(price),
        description,
        quantity: Number(quantity),
        category,
        seller: {
          name: user?.displayName,
          image: user?.photoURL,
          email: user?.email || user?.providerData[0]?.email,
        },
      };
      await mutateAsync(plantData);
      // Form Reset
      reset();
    } catch (err) {
      // console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (isPending) return <LoadingSpinner />;
  if (isError) return <ErrorPage />;

  return (
    <div className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-1 text-sm">
              <label htmlFor="name" className="block text-gray-600">
                Name
              </label>
              <input
                className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                name="name"
                id="name"
                type="text"
                placeholder="Plant Name"
                {...register("name", { required: true })}
              />
              {errors.name?.type === "required" && (
                <p className="text-red-500">Name is required.</p>
              )}
            </div>
            {/* Category */}
            <div className="space-y-1 text-sm">
              <label htmlFor="category" className="block text-gray-600 ">
                Category
              </label>
              <select
                {...register("category", { required: true })}
                className="w-full px-4 py-3 border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                name="category"
              >
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Succulent">Succulent</option>
                <option value="Flowering">Flowering</option>
              </select>
              {errors.category?.type === "required" && (
                <p className="text-red-500">Category is required.</p>
              )}
            </div>
            {/* Description */}
            <div className="space-y-1 text-sm">
              <label htmlFor="description" className="block text-gray-600">
                Description
              </label>

              <textarea
                {...register("description", { required: true })}
                id="description"
                placeholder="Write plant description here..."
                className="block rounded-md focus:lime-300 w-full h-32 px-4 py-3 text-gray-800  border border-lime-300 bg-white focus:outline-lime-500 "
                name="description"
              ></textarea>
              {errors.description?.type === "required" && (
                <p className="text-red-500">Description is required.</p>
              )}
            </div>
          </div>
          <div className="space-y-6 flex flex-col">
            {/* Price & Quantity */}
            <div className="flex justify-between gap-2">
              {/* Price */}
              <div className="space-y-1 text-sm">
                <label htmlFor="price" className="block text-gray-600 ">
                  Price
                </label>
                <input
                  className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                  name="price"
                  id="price"
                  type="number"
                  placeholder="Price per unit"
                  {...register("price", { required: true })}
                />
                {errors.price?.type === "required" && (
                  <p className="text-red-500">Price is required.</p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-1 text-sm">
                <label htmlFor="quantity" className="block text-gray-600">
                  Quantity
                </label>
                <input
                  className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                  name="quantity"
                  id="quantity"
                  type="number"
                  defaultValue={1}
                  placeholder="Available quantity"
                  {...register("quantity", { required: true })}
                />
                {errors.quantity?.type === "required" && (
                  <p className="text-red-500">Quantity is required.</p>
                )}
              </div>
            </div>
            {/* Image */}
            <div className=" p-4  w-full  m-auto rounded-lg grow">
              <div className="file_upload px-5 py-3 relative border-4 border-dotted border-gray-300 rounded-lg">
                <div className="flex flex-col w-max mx-auto text-center">
                  <label>
                    <input
                      className="text-sm cursor-pointer w-36 hidden"
                      type="file"
                      name="image"
                      id="image"
                      accept="image/*"
                      hidden
                      {...register("image", { required: true })}
                    />
                    {errors.image?.type === "required" && (
                      <p className="text-red-500">Image is required.</p>
                    )}
                    <div className="bg-lime-500 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-lime-500">
                      Upload
                    </div>
                  </label>
                </div>
              </div>
              {watch("image") && watch("image").length > 0 && (
                <div className="flex justify-center mt-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                    <img
                      src={URL.createObjectURL(watch("image")[0])}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setValue("image", null)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    >
                      X
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full cursor-pointer p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-lime-500 "
            >
              {loading || isPending ? (
                <TbFidgetSpinner className="animate-spin m-auto" />
              ) : (
                "Save & Continue"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPlantForm;
