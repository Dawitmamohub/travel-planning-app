import React from "react";

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${className}`}
    />
  );
}
