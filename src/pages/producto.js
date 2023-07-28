import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import "../assets/css/style.css";
import jsPDF from "jspdf";

const api = axios.create({
  baseURL: "http://php1ruben.infinityfreeapp.com/app/",
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

async function crearProducto(name, img) {
  try {
    const producto = { name: name, img: img };
    const response = await api.post("producto.services.php", producto);
    console.log(response);
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

function generatePDF2() {
  const codeSection = document.getElementById("listaProductos");
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

function Producto() {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState([{ name: "", img: "" }]);

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
      if (producto.id) {
        // Actualizar producto existente
        await actualizarProducto(producto);
        console.log(`Producto actualizado exitosamente.`);
      } else {
        // Crear nuevo producto
        await crearProducto(producto.name, producto.img);
        console.log(`Producto creado exitosamente.`);
      }

      const data = await obtenerProductos();
      const productoCreado = data.find(
        (p) => p.name === producto.name && p.imgUrl === producto.imgUrl
      );
      if (productoCreado) {
        // Producto creado exitosamente
        setProductos(data);
        setProducto({ id: null, name: "", img: "" });
        document.getElementById("name").value = " ";
        document.getElementById("img").value = " ";
      } else {
        throw new Error(
          `No se pudo ${producto.id ? "actualizar" : "crear"} el producto.`
        );
      }
    } catch (error) {
      // Error al crear o actualizar
      console.error(error);
    }
  }

  async function actualizarProducto(producto) {
    try {
      const response = await api.put(
        `producto.services.php?id=${producto.id}`,
        producto
      );
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
      <div id="listaProductos">
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
                  {producto.img && (
                    <img src={producto.img} alt={producto.name} width="100" />
                  )}
                  {!producto.img && <span>Sin imagen</span>}
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
      </div>
      <h2 className="subtitle">Crear o actualizar producto</h2>
      <form name="formulario" className="form" onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label className="label" htmlFor="formNombre">
            Nombre:
          </label>
          <input
            className="input"
            type="text"
            name="name"
            defaultValuenpm
            install
            react-pdf={producto.name}
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
            name="img"
            defaultValue={producto.img}
            onChange={handleInputChange}
          />
        </div>
        <button className="button" variant="primary" type="submit">
          {producto.id ? "Actualizar" : "Crear"}
        </button>
      </form>

      <Button variant="primary" onClick={generatePDF2}>
        Generar PDF
      </Button>
    </div>
  );
}

export { Producto };
