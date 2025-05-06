import React from 'react'

//a reusable card for any website
export default function Card({ title, description, imageUrl }) {
    return (
        <div
            className="card"
            style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                margin: "10px",
                maxWidth: "300px",
                textAlign: "center",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
            }}
        >
            {
                imageUrl && (
                    <img
                        src={imageUrl}
                        alt={title}
                        style={{
                            width: "100%",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginBottom: "10px",
                        }}
                    />
                )
            }
            <h3 style={{ fontSize: "1.2rem", margin: "10px 0" }}>{title}</h3>
            <p style={{ fontSize: "0.9rem", color: "#555" }}>{description}</p>
        </div>
    )
}