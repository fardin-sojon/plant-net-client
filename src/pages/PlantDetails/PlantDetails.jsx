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
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart, FaStar, FaSun, FaTint, FaSeedling } from "react-icons/fa";

const PlantDetails = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  let [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: 'center',
    transform: 'scale(1)'
  });
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [ratingState, setRatingState] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

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

  // Fetch reviews for this plant
  const { data: reviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const res = await axios(`${import.meta.env.VITE_API_URL}/reviews/${id}`);
      return res.data;
    }
  });

  // Fetch wishlist to check if plant is wishlisted
  const { data: wishlist = [], refetch: refetchWishlist } = useQuery({
    queryKey: ["wishlist", user?.email || user?.providerData?.[0]?.email],
    enabled: !!(user?.email || user?.providerData?.[0]?.email),
    queryFn: async () => {
      const res = await axiosSecure(`/wishlist/${user?.email || user?.providerData?.[0]?.email}`);
      return res.data;
    }
  });

  const wishlistItem = wishlist.find(item => item.plantId === id);
  const isWishlisted = !!wishlistItem;

  const { name, image, description, category, quantity, price, seller } = plant;

  // Mock secondary angles using the primary image with styling
  const galleryImages = image ? [image] : [];

  // Plant Care fallbacks based on category
  const careGuide = {
    water: category === "Succulent" ? "Low (Every 2 weeks)" : category === "Indoor" ? "Medium (1-2 times/week)" : "High (Daily)",
    sun: category === "Indoor" ? "Indirect shade" : "Direct bright sun",
    soil: category === "Succulent" ? "Sandy cactus mix" : "Loamy/Organic rich potting soil"
  };

  const haldleBack = () => {
    navigate(-1);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.6)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center',
      transform: 'scale(1)'
    });
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Please login to save to wishlist");
      navigate("/login");
      return;
    }
    try {
      if (isWishlisted) {
        await axiosSecure.delete(`/wishlist/${wishlistItem._id}`);
        toast.success("Removed from Wishlist");
      } else {
        await axiosSecure.post("/wishlist", {
          email: user?.email || user?.providerData?.[0]?.email,
          plantId: id,
          name,
          image,
          category,
          price
        });
        toast.success("Saved to Wishlist");
      }
      refetchWishlist();
    } catch (err) {
      console.error("Wishlist error:", err);
      toast.error("Error updating wishlist: " + (err.response?.data?.message || err.message));
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please type a review message");
      return;
    }
    try {
      await axiosSecure.post("/reviews", {
        plantId: id,
        rating: ratingState,
        comment: reviewComment,
        email: user?.email || user?.providerData?.[0]?.email,
        name: user.displayName || "Anonymous User",
        avatar: user.photoURL || ""
      });
      toast.success("Review submitted successfully!");
      setReviewComment("");
      refetchReviews();
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  // Compute average rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (isLoading) return <LoadingSpinner />;

  return (
    <Container>
      <div className="mx-auto flex flex-col lg:flex-row justify-between w-full gap-12 mb-16">
        {/* Gallery Image Display */}
        <div className="flex flex-col gap-6 flex-1">
          <div className="relative">
            <div 
              className="w-full overflow-hidden rounded-2xl cursor-zoom-in relative border border-base-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                className="object-cover w-full md:h-[430px] transition-transform duration-200 ease-out"
                style={zoomStyle}
                referrerPolicy="no-referrer"
                src={galleryImages[selectedImageIndex] || image}
                alt={name}
              />
            </div>
            
            {/* Wishlist Heart Icon overlay */}
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-lg cursor-pointer hover:scale-115 active:scale-95 transition-all duration-300 border focus:outline-none ${
                isWishlisted 
                  ? 'bg-rose-50 border-rose-200 dark:bg-rose-950 dark:border-rose-900' 
                  : 'bg-white border-base-200 dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              {isWishlisted ? (
                <FaHeart className="text-rose-500 text-xl animate-pulse" />
              ) : (
                <FaRegHeart className="text-gray-500 dark:text-gray-300 text-xl hover:text-rose-500" />
              )}
            </button>
          </div>

          {/* Thumbnail Selectors */}
          {galleryImages.length > 1 && (
            <div className="flex gap-4">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                    selectedImageIndex === idx ? 'border-lime-500 scale-105 shadow-md' : 'border-base-300 dark:border-gray-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt="angle" 
                    className={`w-full h-full object-cover ${
                      idx === 1 ? 'hue-rotate-15' : idx === 2 ? 'saturate-150' : ''
                    }`} 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Area */}
        <div className="md:gap-10 flex-1">
          {/* Title & Avg Rating */}
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <Heading title={name} subtitle={`Category: ${category}`} />
            {avgRating > 0 && (
              <div className="flex items-center gap-1 bg-lime-100 dark:bg-lime-950 px-3 py-1.5 rounded-lg text-lime-700 dark:text-lime-400 font-bold text-sm shadow-xs mt-2">
                <FaStar />
                <span>{avgRating} ({reviews.length} reviews)</span>
              </div>
            )}
          </div>
          
          <hr className="my-5 border-base-200 dark:border-gray-700" />
          
          {/* Description */}
          <div className="text-lg font-light text-neutral-500 dark:text-neutral-300 leading-relaxed">
            {description}
          </div>
          
          <hr className="my-5 border-base-200 dark:border-gray-700" />

          {/* Care Guide Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50/50 dark:bg-gray-800/50 border border-green-100/50 dark:border-gray-700/50 p-4 rounded-xl flex items-center gap-3">
              <span className="p-2.5 bg-lime-100 dark:bg-lime-900 rounded-lg text-lime-600 dark:text-lime-300"><FaTint /></span>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Water</p>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-0.5">{careGuide.water}</p>
              </div>
            </div>
            <div className="bg-green-50/50 dark:bg-gray-800/50 border border-green-100/50 dark:border-gray-700/50 p-4 rounded-xl flex items-center gap-3">
              <span className="p-2.5 bg-lime-100 dark:bg-lime-900 rounded-lg text-lime-600 dark:text-lime-300"><FaSun /></span>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Sunlight</p>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-0.5">{careGuide.sun}</p>
              </div>
            </div>
            <div className="bg-green-50/50 dark:bg-gray-800/50 border border-green-100/50 dark:border-gray-700/50 p-4 rounded-xl flex items-center gap-3">
              <span className="p-2.5 bg-lime-100 dark:bg-lime-900 rounded-lg text-lime-600 dark:text-lime-300"><FaSeedling /></span>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Soil Type</p>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-0.5">{careGuide.soil}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-md font-semibold text-gray-800 dark:text-gray-200 mb-6">
            <span>Seller: {seller?.name}</span>
            <img
              className="rounded-full border border-base-300 dark:border-gray-600 shadow-sm"
              height="32"
              width="32"
              alt="Avatar"
              referrerPolicy="no-referrer"
              src={seller?.image}
            />
          </div>
          
          <div className="flex items-center justify-between bg-base-50 dark:bg-gray-900 p-4 rounded-2xl border border-base-200 dark:border-gray-800 mb-6">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Stock Remaining</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">{quantity} Units Available</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 uppercase">Unit Price</p>
              <p className="text-2xl font-bold text-lime-600 dark:text-lime-400 mt-0.5">${price}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              disabled={quantity <= 0}
              onClick={() => {
                if (!user) {
                  navigate('/login');
                  return;
                }
                setIsOpen(true);
              }}
              label={
                quantity <= 0
                  ? "Out of Stock"
                  : "Purchase Now"
              }
            />
            <button onClick={haldleBack} className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition cursor-pointer flex items-center gap-2">
              <IoArrowBack /> Back
            </button>
          </div>

          <PurchaseModal plant={plant} closeModal={closeModal} isOpen={isOpen} />
        </div>
      </div>

      {/* --- Ratings & Reviews Area --- */}
      <div className="border-t border-base-200 dark:border-gray-800 pt-10 mt-10">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Customer Reviews</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Review Submission Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-base-200 dark:border-gray-700 shadow-sm">
            <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Write a Review</h4>
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingState(star)}
                      className="cursor-pointer text-2xl focus:outline-none"
                    >
                      <FaStar className={star <= ratingState ? 'text-amber-400' : 'text-gray-300 dark:text-gray-700'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Comment</label>
                <textarea
                  rows="3"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your thoughts about this plant..."
                  className="w-full px-3 py-2 rounded-xl border border-base-300 dark:border-gray-700 bg-base-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-lime-500 focus:outline-none transition"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-xl transition cursor-pointer shadow-sm text-sm"
              >
                Submit Review
              </button>
            </form>
          </div>

          {/* Right Reviews List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {reviews.length === 0 ? (
              <div className="bg-base-50 dark:bg-gray-900 p-8 text-center text-gray-500 rounded-2xl border border-dashed border-base-300 dark:border-gray-700">
                No reviews yet. Be the first to share your experience!
              </div>
            ) : (
              reviews.map((rev) => (
                <div 
                  key={rev._id} 
                  className="bg-white dark:bg-gray-800/80 p-5 rounded-2xl border border-base-200 dark:border-gray-800 shadow-xs flex gap-4 items-start"
                >
                  <img
                    src={rev.avatar || "https://i.pravatar.cc/150"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border border-base-200 dark:border-gray-700"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <p className="font-bold text-gray-800 dark:text-white text-sm">{rev.name}</p>
                      <p className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    {/* Stars */}
                    <div className="flex gap-0.5 my-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar 
                          key={star} 
                          className={`text-xs ${star <= rev.rating ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'}`} 
                        />
                      ))}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{rev.comment}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PlantDetails;
