import { message, Table } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../services/axios";

const cols = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
  },
  {
    title: "End Date",
    dataIndex: "endDate",
    key: "endDate",
  },
  {
    title: "Start Location",
    dataIndex: "startLocation",
    key: "startLocation",
  },
  {
    title: "End Location",
    dataIndex: "endLocation",
    key: "endLocation",
  },
  {
    title: "Farms",
    dataIndex: "farms",
    key: "farms",
    render: (farms) => {
      return farms.map((farm) => farm.farmName);
    },
  },
];
function ManagerTrip() {
  const [trips, setTrips] = useState({
    startDate: "2024-10-08",
    endDate: "2024-10-08",
    startLocation: "string",
    endLocation: "string",
    farms: [{}],
  });
  const [farmList, setFarmList] = useState([{}]);

  const fetchTrips = async () => {
    try {
      const res = await api.get("trip");
      console.log("res data:", res.data);

      const listTrips = res.data;
      setTrips(listTrips);
      console.log("listTrips: ", listTrips);
    } catch (error) {
      message.error("Error fetching trips");
      console.log(error.message.toString());
    }
  };

  const handleCreateTrip = async () => {
    try {
      const res = await api.post("trip");
      console.log("res data:", res.data);
      setTrips(res.data);
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
      <h1>ManagerTrip</h1>
      <Table columns={cols} dataSource={trips} />
    </div>
  );
}

export default ManagerTrip;
