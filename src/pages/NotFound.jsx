import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="notfound-page">
      <h1>404</h1>
      <p>Oops! Page not found.</p>
      <Link to="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
