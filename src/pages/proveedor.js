import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import "../assets/css/style.css";

async function obtenerProveedores() {
  try {
    const response = await axios.get(
      "http://localhost/ApiFarmacia/app/services/proveedor.services.php"
    );
    if (Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function actualizarProveedor(proveedor) {
  try {
    const response = await axios.put(
      `http://localhost/ApiFarmacia/app/services/proveedor.services.php?id=${proveedor.id}`,
      proveedor,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function crearProveedor(proveedor) {
  try {
    // Verificar si el proveedor ya existe en la base de datos
    const proveedores = await obtenerProveedores();
    const proveedorExistente = proveedores.find((p) => p.id === proveedor.id);
    if (proveedorExistente) {
      throw new Error("El proveedor ya existe en la base de datos.");
    } else {
      // Crear el nuevo proveedor
      const response = await axios.post(
        "http://localhost/ApiFarmacia/app/services/proveedor.services.php",
        proveedor,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (Array.isArray(response.data)) {
        return response.data;
      }
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function eliminarProveedor(proveedor) {
  try {
    const response = await axios.delete(
      `http://localhost/ApiFarmacia/app/services/proveedor.services.php?id=${proveedor.id}`
    );
    if (Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

function Proveedor() {
  const [proveedores, setProveedores] = useState([]);
  const [proveedor, setProveedor] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    async function fetchData() {
      const data = await obtenerProveedores();
      setProveedores(data);
    }
    fetchData();
  }, []);

  async function handleFormSubmit(event) {
    event.preventDefault();
    if (proveedor.id) {
      // Actualizar el proveedor existente
      const data = await actualizarProveedor(proveedor);
      setProveedores((prevProveedores) =>
        prevProveedores.map((prevProveedor) =>
          prevProveedor.id === proveedor.id ? proveedor : prevProveedor
        )
      );
      setProveedor({
        id: "",
        name: "",
      });
    } else {
      // Crear un nuevo proveedor
      const data = await crearProveedor(proveedor);
      setProveedores((prevProveedores) => [...prevProveedores, proveedor]);
      setProveedor({
        id: "",
        name: "",
      });
    }
  }

  async function handleDeleteClick(proveedor) {
    const data = await eliminarProveedor(proveedor);
    setProveedores((prevProveedores) =>
      prevProveedores.filter(
        (prevProveedor) => prevProveedor.id !== proveedor.id
      )
    );
  }

  function handleEditClick(proveedor) {
    setProveedor(proveedor);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setProveedor((prevProveedor) => ({
      ...prevProveedor,
      [name]: value,
    }));
  }

  return (
    <div className="container">
      <h1 className="title">Lista de proveedores</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor) => (
            <tr key={proveedor.id}>
              <td>{proveedor.name}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleEditClick(proveedor)}
                >
                  Editar
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteClick(proveedor)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="subtitle">Crear o actualizar proveedor</h2>
      <form className="form" onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label className="label" htmlFor="formNombre">
            Nombre:
          </label>
          <input
            className="input"
            type="text"
            name="name"
            value={proveedor.name}
            onChange={handleInputChange}
          />
        </div>
        <button className="button" variant="primary" type="submit">
          {proveedor.id ? "Actualizar" : "Crear"}
        </button>
      </form>
    </div>
  );
}
export { Proveedor };
