import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import "../assets/css/style.css";

async function obtenerInventario() {
  try {
    const response = await axios.get(
      "http://localhost/ApiFarmacia/app/services/inventario.services.php"
    );
    if (Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function actualizarInventario(inventario) {
  try {
    const response = await axios.put(
      `http://localhost/ApiFarmacia/app/services/inventario.services.php?id=${inventario.id}`,
      inventario,
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

async function crearInventario(inventario) {
  try {
    // Verificar si el inventario ya existe en la base de datos
    const inventarios = await obtenerInventario();
    const inventarioExistente = inventarios.find((i) => i.id === inventario.id);
    if (inventarioExistente) {
      throw new Error("El inventario ya existe en la base de datos.");
    } else {
      // Crear el nuevo inventario
      const response = await axios.post(
        "http://localhost/ApiFarmacia/app/services/inventario.services.php",
        inventario,
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

async function eliminarInventario(inventario) {
  try {
    const response = await axios.delete(
      `http://localhost/ApiFarmacia/app/services/inventario.services.php?id=${inventario.id}`
    );
    if (Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function obtenerProductos() {
  try {
    const response = await axios.get(
      "http://localhost/ApiFarmacia/app/services/producto.services.php"
    );
    if (Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

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

async function obtenerUsuarios() {
  try {
    const response = await axios.get(
      "http://localhost/ApiFarmacia/app/services/usuario.services.php"
    );
    if (Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

function Inventario() {
  const [inventarios, setInventarios] = useState([]);
  const [inventario, setInventario] = useState({
    id: "",
    producto_id: "",
    clasificacion_id: "",
    cantidad: "",
    fecha_vencimiento: "",
    numero_lote: "",
    proveedor_id: "",
    farmaceutica_id: "",
    usuario_id: "",
    fecha_ingreso: "",
    numero_factura: "",
  });
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [usuarios, setUsuario] = useState([]);

  // obtener inventarios.
  useEffect(() => {
    async function fetchData() {
      const data = await obtenerInventario();
      setInventarios(data);
    }
    fetchData();
  }, []);

  // obtener productos.
  useEffect(() => {
    async function fetchData() {
      const data = await obtenerProductos();
      setProductos(data);
    }
    fetchData();
  }, []);

  // obtener usuarios.
  useEffect(() => {
    async function fetchData() {
      const data = await obtenerUsuarios();
      setUsuario(data);
    }
    fetchData();
  }, []);

  // obtener proveedores.
  useEffect(() => {
    async function fetchData() {
      const data = await obtenerProveedores();
      setProveedores(data);
    }
    fetchData();
  }, []);

  async function handleFormSubmit(event) {
    event.preventDefault();
    if (inventario.id) {
      // Actualizar el inventario existente
      const data = await actualizarInventario(inventario);
      setInventarios((prevInventarios) =>
        prevInventarios.map((prevInventario) =>
          prevInventario.id === inventario.id ? inventario : prevInventario
        )
      );
      setInventario({
        id: "",
        producto_id: "",
        clasificacion_id: "",
        cantidad: "",
        fecha_vencimiento: "",
        numero_lote: "",
        proveedor_id: "",
        farmaceutica_id: "",
        usuario_id: "",
        fecha_ingreso: "",
        numero_factura: "",
      });
    } else {
      // Crear un nuevo inventario
      const data = await crearInventario(inventario);
      setInventarios((prevInventarios) => [...prevInventarios, inventario]);
      setInventario({
        id: "",
        producto_id: "",
        clasificacion_id: "",
        cantidad: "",
        fecha_vencimiento: "",
        numero_lote: "",
        proveedor_id: "",
        farmaceutica_id: "",
        usuario_id: "",
        fecha_ingreso: "",
        numero_factura: "",
      });
    }
  }

  async function handleDeleteClick(inventario) {
    const data = await eliminarInventario(inventario);
    setInventarios((prevInventarios) =>
      prevInventarios.filter(
        (prevInventario) => prevInventario.id !== inventario.id
      )
    );
  }

  const handleEditClick = (inventario) => {
    setInventario({
      id: inventario.id,
      producto_id: inventario.producto_id,
      clasificacion: inventario.clasificacion_id, // Actualizar la propiedad 'clasificacion' en lugar de 'clasificacion_id'
      cantidad: inventario.cantidad,
      fecha_vencimiento: inventario.fecha_vencimiento,
      numero_lote: inventario.numero_lote,
      proveedor_id: inventario.proveedor_id,
      farmaceutica_id: inventario.farmaceutica_id,
      usuario_id: inventario.usuario_id,
      fecha_ingreso: inventario.fecha_ingreso,
      numero_factura: inventario.numero_factura,
    });
  };

  function handleInputChange(event) {
    const { name, value } = event.target;
    setInventario((prevInventario) => ({
      ...prevInventario,
      [name]: value,
    }));
  }

  return (
    <div className="container">
      <h1 className="title">Inventario</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Clasificación</th>
            <th>Cantidad</th>
            <th>Fecha de vencimiento</th>
            <th>Número de lote</th>
            <th>Proveedor</th>
            <th>Farmacéutica</th>
            <th>Usuario</th>
            <th>Fecha de ingreso</th>
            <th>Número de factura</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inventarios.map((inventario) => (
            <tr key={inventario.id}>
              <td>{inventario.producto_id}</td>
              <td>{inventario.clasificacion_id}</td>
              <td>{inventario.cantidad}</td>
              <td>{inventario.fecha_vencimiento}</td>
              <td>{inventario.numero_lote}</td>
              <td>{inventario.proveedor_id}</td>
              <td>{inventario.farmaceutica_id}</td>
              <td>{inventario.usuario_id}</td>
              <td>{inventario.fecha_ingreso}</td>
              <td>{inventario.numero_factura}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleEditClick(inventario)}
                >
                  Editar
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteClick(inventario)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="subtitle">Crear o actualizar inventario</h2>
      <form className="form" onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label className="label" htmlFor="formProducto">
            Producto:
          </label>
          <select
            className="input"
            name="producto_id"
            value={inventario.producto_id}
            onChange={handleInputChange}
          >
            <option value="">Seleccionar producto</option>
            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="label" htmlFor="formClasificacion">
            Clasificación:
          </label>
          <input
            className="input"
            type="text"
            name="clasificacion_id"
            value={inventario.clasificacion_id}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="formCantidad">
            Cantidad:
          </label>
          <input
            className="input"
            type="number"
            name="cantidad1"
            value={inventario.cantidad}
            onChange={handleInputChange}
            min="1"
          />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="formFechaVencimiento">
            Fecha de vencimiento:
          </label>
          <input
            className="input"
            type="date"
            name="fecha_vencimiento"
            value={inventario.fecha_vencimiento}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="formNumeroLote">
            Número de lote:
          </label>
          <input
            className="input"
            type="number"
            name="numero_lote"
            value={inventario.numero_lote}
            onChange={handleInputChange}
            min="1"
            max="100000000"
          />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="formProveedor">
            Proveedor:
          </label>
          <select
            className="input"
            name="proveedor_id"
            value={inventario.proveedor_id}
            onChange={handleInputChange}
          >
            <option value="">Seleccionar proveedor</option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="label" htmlFor="formFarmaceutica">
            Farmacéutica:
          </label>
          <input
            className="input"
            type="text"
            name="farmaceutica"
            value={inventario.farmaceutica_id}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="formUsuario">
            Usuario:
          </label>
          <select
            className="input"
            name="usuario_id"
            value={inventario.usuario_id}
            onChange={handleInputChange}
          >
            <option value="">Seleccionar usuario</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="label" htmlFor="formFechaIngreso">
            Fecha de ingreso:
          </label>
          <input
            className="input"
            type="text"
            name="fecha_ingreso"
            defaultValue={new Date().toISOString().slice(0, 10)}
            readOnly
          />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="formNumeroFactura">
            Número de factura:
          </label>
          <input
            className="input"
            type="number"
            name="numero_factura"
            value={inventario.numero_factura}
            onChange={handleInputChange}
            min="1"
            max="100000000"
          />
        </div>
        <button className="button" variant="primary" type="submit">
          {inventario.id ? "Actualizar" : "Crear"}
        </button>
      </form>
    </div>
  );
}

export { Inventario };
