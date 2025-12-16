import React, { useEffect, useState } from "react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import ReviewCard from "./ReviewCard";

const Reviews = ({ reviewsPromise }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    reviewsPromise.then((data) => {
      setReviews(data);
    });
  }, [reviewsPromise]);

  // console.log(reviews);

  return (
    <div>
      <div className="text-center">
        <h2 className="text-3xl font-bold mt-15">Customer Reviews</h2>
        <p className="my-3 text-gray-600">
          See what our happy customers have to say about their journey with us. <br />
          We take pride in providing the best plants and service.
        </p>
      </div>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        spaceBetween={30}
        slidesPerView={3}
        coverflowEffect={{
          rotate: 30,
          stretch: "50%",
          depth: 200,
          scale: 0.75,
          modifier: 1,
          slideShadows: true,
        }}
       loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination,Autoplay]}
        className="mySwiper"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            <ReviewCard review={review}></ReviewCard>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Reviews;
