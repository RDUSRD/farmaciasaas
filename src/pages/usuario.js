import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import "../assets/css/style.css";
import jsPDF from "jspdf";

async function obtenerUsuarios() {
  try {
    const response = await axios.get(
      "http://php1ruben.infinityfreeapp.com/app/usuario.services.php"
    );
    if (Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function actualizarUsuario(usuario) {
  try {
    const response = await axios.put(
      `http://php1ruben.infinityfreeapp.com/app/usuario.services.php?id=${usuario.id}`,
      usuario,
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

async function crearUsuario(usuario) {
  try {
    // Verificar si el usuario ya existe en la base de datos
    const usuarios = await obtenerUsuarios();
    const usuarioExistente = usuarios.find((u) => u.id === usuario.id);
    if (usuarioExistente) {
      throw new Error("El usuario ya existe en la base de datos.");
    } else {
      // Crear el nuevo usuario
      const response = await axios.post(
        "http://php1ruben.infinityfreeapp.com/app/usuario.services.php",
        usuario,
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

async function eliminarUsuario(usuario) {
  try {
    const response = await axios.delete(
      `http://php1ruben.infinityfreeapp.com/app/usuario.services.php?id=${usuario.id}`
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
  const codeSection = document.getElementById("listaUsuarios");
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

function Usuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    async function fetchData() {
      const data = await obtenerUsuarios();
      setUsuarios(data);
    }
    fetchData();
  }, []);

  async function handleFormSubmit(event) {
    event.preventDefault();
    if (usuario.id) {
      // Actualizar el usuario existente
      const data = await actualizarUsuario(usuario);
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((prevUsuario) =>
          prevUsuario.id === usuario.id ? usuario : prevUsuario
        )
      );
      setUsuario({
        id: "",
        name: "",
        email: "",
        password: "",
      });
    } else {
      // Crear un nuevo usuario
      const data = await crearUsuario(usuario);
      setUsuarios((prevUsuarios) => [...prevUsuarios, usuario]);
      setUsuario({
        id: "",
        name: "",
        email: "",
        password: "",
      });
    }
  }

  async function handleDeleteClick(usuario) {
    const data = await eliminarUsuario(usuario);
    setUsuarios((prevUsuarios) =>
      prevUsuarios.filter((prevUsuario) => prevUsuario.id !== usuario.id)
    );
  }

  function handleEditClick(usuario) {
    setUsuario(usuario);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      [name]: value,
    }));
  }

  return (
    <div className="container">
      <div id="listaUsuarios">
        <h1 className="title">Lista de usuarios</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Password</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.name}</td>
                <td>{usuario.email}</td>
                <td>{usuario.password}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleEditClick(usuario)}
                  >
                    Editar
                  </Button>{" "}
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteClick(usuario)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="subtitle">Crear o actualizar usuario</h2>
      <form className="form" onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label className="label" htmlFor="formNombre">
            Nombre:
          </label>
          <input
            className="input"
            type="text"
            name="name"
            value={usuario.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="formEmail">
            Email:
          </label>
          <input
            className="input"
            type="email"
            name="email"
            value={usuario.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="formPassword">
            Password:
          </label>
          <input
            className="input"
            type="password"
            name="password"
            value={usuario.password}
            onChange={handleInputChange}
          />
        </div>
        <button className="button" variant="primary" type="submit">
          {usuario.id ? "Actualizar" : "Crear"}
        </button>
      </form>
      <Button variant="primary" onClick={generatePDF2}>
        Generar PDF
      </Button>
    </div>
  );
}

export { Usuario };
