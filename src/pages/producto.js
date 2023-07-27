import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import "../assets/css/style.css";

const api = axios.create({
  baseURL: "http://localhost/ApiFarmacia/app/services/",
});

async function obtenerProductos() {
  try {
    const response = await api.get("producto.services.php");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function actualizarProducto(producto) {
  try {
    const response = await api.put("producto.services.php", producto);
    if (response.data.message === "Producto actualizado exitosamente.") {
      return true;
    } else {
      throw new Error("No se pudo actualizar el producto.");
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function crearProducto(nombre, imgUrl) {
  try {
    const producto = { name: nombre, imgUrl: imgUrl };
    const response = await api.post("producto.services.php", producto);
    if (response.data.message === "Producto creado exitosamente.") {
      return true;
    } else {
      throw new Error("No se pudo crear el producto.");
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function eliminarProducto(id) {
  try {
    const response = await api.delete(`producto.services.php?id=${id}`);
    if (response.data.message === "Producto eliminado exitosamente.") {
      return true;
    } else {
      throw new Error("No se pudo eliminar el producto.");
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

function Producto() {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState({ name: "", imgUrl: "" });

  useEffect(() => {
    async function fetchData() {
      const data = await obtenerProductos();
      setProductos(data);
    }
    fetchData();
  }, []);

  async function handleFormSubmit(event) {
    event.preventDefault();
    try {
      if (producto && producto.id) {
        // Verifica si la variable 'producto' está definida
        // Actualizar producto existente
        const success = await actualizarProducto(producto);
        if (success) {
          // Actualización exitosa
          console.log("Producto actualizado exitosamente.");
          setProductos((prevProductos) =>
            prevProductos.map((prevProducto) =>
              prevProducto.id === producto.id ? producto : prevProducto
            )
          );
        } else {
          throw new Error("No se pudo actualizar el producto.");
        }
      } else {
        // Crear nuevo producto
        const success = await crearProducto(producto.name, producto.imgUrl);
        if (success) {
          // Creación exitosa
          console.log("Producto creado exitosamente.");
          const data = await obtenerProductos();
          setProductos(data);
        } else {
          throw new Error("No se pudo crear el producto.");
        }
      }
      setProducto({ name: "", imgUrl: "" });
    } catch (error) {
      // Error al crear o actualizar
      console.error(error);
    }
  }

  async function handleDeleteClick(id) {
    try {
      const success = await eliminarProducto(id);
      if (success) {
        // Eliminación exitosa
        console.log("Producto eliminado exitosamente.");
        const data = await obtenerProductos();
        setProductos(data);
      } else {
        throw new Error("No se pudo eliminar el producto.");
      }
    } catch (error) {
      // Error al eliminar
      console.error(error);
    }
  }

  function handleEditClick(producto) {
    setProducto(producto);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setProducto((prevProducto) => ({
      ...prevProducto,
      [name]: value,
    }));
  }

  return (
    <div className="container">
      <h1 className="title">Lista de productos</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.name}</td>
              <td>
                {producto.imgUrl && (
                  <img src={producto.imgUrl} alt={producto.name} width="100" />
                )}
                {!producto.imgUrl && <span>Sin imagen</span>}
              </td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleEditClick(producto)}
                >
                  Editar
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteClick(producto.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="subtitle">Crear o actualizar producto</h2>
      <form className="form" onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label className="label" htmlFor="formNombre">
            Nombre:
          </label>
          <input
            className="input"
            type="text"
            name="name"
            value={producto.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="formImg">
            URL de la imagen:
          </label>
          <input
            className="input"
            type="text"
            name="imgUrl"
            value={producto.imgUrl}
            onChange={handleInputChange}
          />
        </div>
        <button className="button" variant="primary" type="submit">
          {producto.id ? "Actualizar" : "Crear"}
        </button>
      </form>
    </div>
  );
}

export { Producto };
