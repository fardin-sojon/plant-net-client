import Card from "./Card";
import Container from "../Shared/Container";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../Shared/LoadingSpinner";

const Plants = () => {
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
  
  if (isLoading) return <LoadingSpinner />;

  return (
    <Container>
      {plants && plants.length > 0 ? (
        <div className="pt-12 pb-24 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {
            plants.map(plant=><Card key={plant._id}  plant={plant}/>)
          }
        </div>
      ) : null}
    </Container>
  );
};

export default Plants;
