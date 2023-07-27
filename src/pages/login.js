import React, { useState } from "react";
import axios from "axios";
import "../assets/css/login.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Verificar el inicio de sesión del usuario
    axios.post("http://localhost/ApiFarmacia/app/services/login.php", { email, password })
      .then((response) => {
        if (response.data.success) {
          // Iniciar sesión y redirigir al usuario a la página de inicio
          localStorage.setItem("email", email);
          window.location.href = "/";
        } else {
          // Mostrar un mensaje de error si el inicio de sesión falla
          setError("Correo electrónico o contraseña incorrectos.");
        }
      })
      .catch((error) => {
        console.error(error);
        setError("Ocurrió un error al iniciar sesión.");
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Iniciar sesión</div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Correo electrónico:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Contraseña:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Iniciar sesión</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export {LoginForm};