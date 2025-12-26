import React from "react";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import axios from "axios";
import { IoBagCheckOutline } from "react-icons/io5";
import useCart from "../../../hooks/useCart";

const PaymentSuccess = () => {
  const { clearCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  // console.log(sessionId);
  useEffect(() => {
    if (sessionId) {
      // fetch
      axios.post(`${import.meta.env.VITE_API_URL}/payment-success`, {
        sessionId,
      })
      .then(res => {
         if(res.data.success) {
            clearCart();
         }
      })
      .catch(err => console.error(err))
    }
  }, [sessionId, clearCart]);
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <IoBagCheckOutline className="w-16 h-16 text-green-500 mx-auto mb-4" />

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order is being processed.
        </p>

        <Link
          to="/dashboard/my-orders"
          className="inline-block bg-lime-500 text-white font-semibold py-2 px-4 rounded"
        >
          Go to My Orders
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
