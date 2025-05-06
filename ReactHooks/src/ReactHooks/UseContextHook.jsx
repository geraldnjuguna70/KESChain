import React, { useContext } from "react";
import {ThemeContext} from "../context/ThemeContext";


//custom hook(basic useContext hook)
const UseContextHook = () => {

    const { theme, setTheme } = useContext(ThemeContext)
    return (
        <>
            <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                Toggle to {theme === "light" ? "dark" : "light"}
            </button>
        </>
    );

}
export default UseContextHook;