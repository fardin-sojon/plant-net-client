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
  const [orderInfo, setOrderInfo] = useState(null);
  const processedRef = useRef(false);

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
            setOrderInfo(res.data);
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
  }, [sessionId]);

  const activeId = orderInfo?.orderId || orderInfo?.transactionId || sessionId;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100 dark:border-gray-700">
        <IoBagCheckOutline className="w-16 h-16 text-lime-500 mx-auto mb-4" />

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-white mb-2">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
          Thank you for your purchase. Your order has been placed and is being prepared.
        </p>

        {activeId && (
          <div className="bg-lime-50 dark:bg-lime-950/40 border border-lime-100 dark:border-lime-900/60 p-4 rounded-2xl mb-6">
            <span className="text-xs uppercase font-semibold text-lime-800 dark:text-lime-300 tracking-wider">Your Order ID</span>
            <p className="text-lg font-mono font-bold text-gray-900 dark:text-white mt-0.5">{activeId}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {activeId && (
            <Link
              to={`/track-order?id=${activeId}`}
              className="py-3 px-5 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-2xl shadow transition"
            >
              Track Order Live 🚚
            </Link>
          )}
          <Link
            to="/dashboard/my-orders"
            className="py-3 px-5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-2xl transition"
          >
            My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
