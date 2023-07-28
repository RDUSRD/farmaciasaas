import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-text">Farmacia Saas</span>
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              Login
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/usuario" className="navbar-link">
              Usuario
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/proveedor" className="navbar-link">
              Proveedor
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/producto" className="navbar-link">
              Producto
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/inventario" className="navbar-link">
              Inventario
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export { NavBar };
