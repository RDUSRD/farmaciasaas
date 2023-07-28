import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import "../assets/css/style.css";
import jsPDF from "jspdf";

async function obtenerProveedores() {
  try {
    const response = await axios.get(
      "http://php1ruben.infinityfreeapp.com/app/proveedor.services.php"
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
      `http://php1ruben.infinityfreeapp.com/app/proveedor.services.php?id=${proveedor.id}`,
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
        "http://php1ruben.infinityfreeapp.com/app/proveedor.services.php",
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
      `http://php1ruben.infinityfreeapp.com/app/proveedor.services.php?id=${proveedor.id}`
    );
    if (Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

function generatePDF2() {
  const codeSection = document.getElementById("listaProveedores");
  const doc = new jsPDF({
    orientation: "p",
    unit: "pt",
    format: [1700, 2200], // establecer tamaño de la página aquí
    compress: true,
    lineHeight: 1.5,
    fontSize: 10,
    putOnlyUsedFonts: true,
    floatPrecision: 2,
  }); // configuración del documento PDF
  doc.text("Este es un texto de ejemplo", 20, 20);
  doc.html(codeSection, {
    marginLeft:
      doc.internal.pageSize.getWidth() / 2 - codeSection.offsetWidth / 2, // Centrar el contenido del div
    callback: function (doc) {
      // Obtener los datos del PDF como una cadena de datos
      const pdfData = doc.output("datauristring");

      // Abrir una nueva ventana del navegador con los datos del PDF
      const newWindow = window.open();
      newWindow.document.write(
        '<iframe width="100%" height="100%" src="' + pdfData + '"></iframe>'
      );
    },
  });
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
      <div id="listaProveedores">
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
      </div>
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

      <Button variant="primary" onClick={generatePDF2}>
        Generar PDF
      </Button>
    </div>
  );
}
export { Proveedor };
