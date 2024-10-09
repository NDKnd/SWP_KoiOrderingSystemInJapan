import { message } from "antd";
import { useEffect } from "react";
import api from "../../services/axios";

function AllTrips() {
  const fetchTrips = async () => {
    try {
      const res = await api.get("trip");
    } catch (error) {
      message.error("Error fetching trips");
      console.log(error.message.toString());
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);
  return (
    <div>
      <h1>All Trips</h1>
    </div>
  );
}

export default AllTrips;
