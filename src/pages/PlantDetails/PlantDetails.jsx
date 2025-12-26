import Container from "../../components/Shared/Container";
import Heading from "../../components/Shared/Heading";
import Button from "../../components/Shared/Button/Button";
import PurchaseModal from "../../components/Modal/PurchaseModal";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";
import { IoArrowBack } from "react-icons/io5";

const PlantDetails = () => {
  let [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: plant = {},
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["plant", id],
    queryFn: async () => {
      const res = await axios(`${import.meta.env.VITE_API_URL}/plants/${id}`);
      return res.data;
    },
  });
  // console.log(plant);
  const { name, image, description, category, quantity, price, seller } =
    plant;

  const haldleBack = () => {
    navigate(-1);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Container>
      <div className="mx-auto flex flex-col lg:flex-row justify-between w-full gap-12">
        {/* Header */}
        <div className="flex flex-col gap-6 flex-1">
          <div>
            <div className="w-full overflow-hidden rounded-xl">
              <img
                className="object-cover w-full md:h-[415px]"
                referrerPolicy="no-referrer"
                src={image}
                alt={name}
              />
            </div>
          </div>
        </div>
        <div className="md:gap-10 flex-1">
          {/* Plant Info */}
          <Heading title={name} subtitle={`Category: ${category}`} />
          <hr className="my-6" />
          <div
            className="
          text-lg font-light text-neutral-500 dark:text-neutral-300"
          >
            {description}
          </div>
          <hr className="my-6" />

          <div
            className="
                text-xl 
                font-semibold 
                flex 
                flex-row 
                items-center
                gap-2
                dark:text-white
              "
          >
            <div>Seller: {seller?.name}</div>

            <img
              className="rounded-full border-2 border-black"
              height="30"
              width="30"
              alt="Avatar"
              referrerPolicy="no-referrer"
              src={seller?.image}
            />
          </div>
          <hr className="my-6" />
          <div>
            <p
              className="
                gap-4 
                font-light
                text-neutral-500
                dark:text-neutral-300
              "
            >
              Quantity: {quantity} Units Left Only!
            </p>
          </div>
          <hr className="my-6" />
          <div className="flex justify-between">
            <p className="font-bold text-3xl text-gray-500 dark:text-gray-200">Price: {price}$</p>
            <div>
              <Button onClick={() => setIsOpen(true)} label="Purchase" />
            </div>
          </div>
          <button onClick={haldleBack} className="btn bg-blue-500 hover:bg-red-500 text-white rounded-xl"><IoArrowBack /> Back</button>
          <hr className="my-6" />

          <PurchaseModal plant={plant} closeModal={closeModal} isOpen={isOpen} />
        </div>
      </div>
    </Container>
  );
};

export default PlantDetails;
