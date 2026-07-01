import Card from "./Card";
import Container from "../Shared/Container";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../Shared/LoadingSpinner";
import SkeletonCard from "../Shared/SkeletonCard";
import { Link } from "react-router";

const Plants = ({ limit, search = '', category = 'All', sortBy = 'default', stockStatus = 'All' }) => {
  const {
    data: plants = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const res = await axios(`${import.meta.env.VITE_API_URL}/plants`);
      return res.data;
    },
  });
  
  if (isLoading) {
    return (
      <Container>
        <div className="pt-12 pb-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 w-full animate-pulse">
          {Array.from({ length: limit || 10 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      </Container>
    );
  }

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || plant.category.toLowerCase() === category.toLowerCase()
    const matchesStock = stockStatus === 'All'
      ? true
      : stockStatus === 'In Stock'
        ? plant.quantity > 0
        : plant.quantity === 0

    return matchesSearch && matchesCategory && matchesStock
  })

  // Sort the plants array
  const sortedPlants = [...filteredPlants].sort((a, b) => {
    if (sortBy === 'low-to-high') return a.price - b.price
    if (sortBy === 'high-to-low') return b.price - a.price
    if (sortBy === 'name-a-z') return a.name.localeCompare(b.name)
    if (sortBy === 'name-z-a') return b.name.localeCompare(a.name)
    return 0
  })

  const displayPlants = limit ? sortedPlants.slice(0, limit) : sortedPlants;

  return (
    <Container>
      {displayPlants && displayPlants.length > 0 ? (
        <div className="flex flex-col items-center">
          <div className="pt-12 pb-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 w-full">
            {
              displayPlants.map(plant=><Card key={plant._id}  plant={plant}/>)
            }
          </div>
          {limit && plants.length > limit && (
            <div className="pb-16">
              <Link to="/shop">
                <button className="px-8 py-3 bg-lime-500 text-white font-semibold rounded-md hover:bg-lime-600 transition duration-300 shadow-md">
                  All Plants
                </button>
              </Link>
            </div>
          )}
        </div>
      ) : null}
    </Container>
  );
};

export default Plants;
