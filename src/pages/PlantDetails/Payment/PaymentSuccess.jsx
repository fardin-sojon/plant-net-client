import React from "react";
import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import axios from "axios";
import { IoBagCheckOutline } from "react-icons/io5";
import useCart from "../../../hooks/useCart";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [processing, setProcessing] = useState(true);
  const processedRef = useRef(false);
  // console.log(sessionId);
  useEffect(() => {
    // Prevent duplicate API calls
    if (sessionId && !processedRef.current) {
      processedRef.current = true;
      
      axios.post(`${import.meta.env.VITE_API_URL}/payment-success`, {
        sessionId,
      })
      .then(res => {
         if(res.data.success) {
            clearCart();
            toast.success('Order confirmed successfully!');
            setProcessing(false);
         } else {
            toast.error('Failed to confirm order');
            setProcessing(false);
         }
      })
      .catch(err => {
        console.error('Payment confirmation error:', err);
        toast.error('Error confirming payment: ' + (err.response?.data?.message || err.message));
        setProcessing(false);
      })
    } else if (!sessionId) {
      setProcessing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-lg text-center">
        <IoBagCheckOutline className="w-16 h-16 text-green-500 mx-auto mb-4" />

        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Payment Successful!
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thank you for your purchase. Your order is being processed.
        </p>

        <Link
          to="/dashboard/my-orders"
          className="inline-block bg-lime-500 text-white font-semibold py-2 px-4 rounded hover:bg-lime-600 transition"
        >
          Go to My Orders
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
