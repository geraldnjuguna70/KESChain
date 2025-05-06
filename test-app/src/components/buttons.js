import React from 'react'

//reusable button component 
export const CustomButton = ({ label, onClick }) => {
    return (
        <button
            style={{
                padding: "10px 20px",
                margin: "5px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
            }}
            onClick={onClick}
        >
            {label}
        </button>
    )
}


//function to show the alert message on click
export const handleAlert = () => {
    alert(`This is the alert message!....`)
}

//function to rediract to the url provided
export const handleRedirect = (url) => {
    return () => (
        window.location.href = url
    )
}

// Predefined Functionality: Toggle State
export const useToggle = () => {
    const [isToggled, setIsToggled] = React.useState(false);
    const toggle = () => setIsToggled(!isToggled);
    return [isToggled, toggle];
};


