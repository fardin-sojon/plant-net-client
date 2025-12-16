import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

const ReviewCard = ({ review }) => {
//   console.log(review);
  return (
    <div>
      <div className="w-full max-w-sm p-6 rounded-2xl bg-base-100 shadow-lg border">
        <FaQuoteLeft className="text-3xl text-lime-500 opacity-60 mb-3" />

        <p className="text-base leading-relaxed text-gray-600">
          {review.review}
        </p>

        <div className="border-t border-dashed border-gray-300 my-4"></div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <img className="rounded-full" src={review.user_photoURL} alt="" />
          </div>

          <div>
            <h3 className="font-semibold text-lg">{review.userName}</h3>
            <p className="text-sm text-gray-500">Verified Customer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
