import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCar from "./AddCar";
import EditCar from "./EditCar";
import { getCars } from "../carapi";

function Carlist() {
  const [cars, setCars] = useState([]);
  const [colDefs, setColDefs] = useState([
    { field: "brand", filter: true },
    { field: "model", filter: true },
    { field: "color", filter: true },
    { field: "fuel", filter: true, width: 100 },
    { field: "modelYear", filter: true, width: 100 },
    { field: "price", filter: true },
    {
      cellRenderer: (params) => (
        <EditCar data={params.data} updatedCar={updatedCar} />
      ),
      width: 120,
    },
    {
      cellRenderer: (params) => (
        <Button
          size="small"
          color="error"
          onClick={() => deleteCar(params.data._links.car.href)}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      ),
      width: 150,
    },
  ]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    getCars()
      .then((data) => setCars(data._embedded.cars))
      .catch((err) => console.log(err));
  };

  const deleteCar = (url) => {
    if (window.confirm("Are you sure?")) {
      fetch(url, { method: "DELETE" })
        .then((response) => {
          if (!response.ok)
            throw new Error("Error in deletion: " + error.statusText);
          return response.json();
        })
        .then(() => fetchCars())
        .catch((err) => console.log(err));
    }
  };

  const addCar = (newCar) => {
    fetch("https://carrestservice-carshop.rahtiapp.fi/cars", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newCar),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error when adding a car");
        return response.json();
      })
      .then(() => fetchCars())
      .catch((err) => console.log(err));
  };

  const updatedCar = (url, updatedCar) => {
    if (window.confirm("Are you sure?")) {
      fetch(url, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(updatedCar),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Error when updating a car");
          return response.json();
        })
        .then(() => fetchCars())
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <AddCar addCar={addCar} />
      <div className="ag-theme-material" style={{ height: 550, width: 1300 }}>
        <AgGridReact
          rowData={cars}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    </>
  );
}

export default Carlist;
