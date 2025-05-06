import React, {useState} from "react";

//the use of the useState hook – For Local Component State
const UseStateHook = () => {
    const [counter, setConter] = useState(0);
    return (
        <div>
            <h1>UseStateHook</h1>
            <p>counter: {counter}</p>
            <button onClick={() => setConter((counter) => counter + 1)}>Counter</button>
            <ColorPicker />
        </div>
    );
};


const ColorPicker = () => {
    const colors = ['red', 'green', 'blue', 'black', 'orange', 'purple']
    const [colorIndex, setColor] = useState(0)
    
    // function to change the color
    function handleClick() {
        // set the color to the next color in the array(cycle through colors)
        setColor((prevIndex) => (prevIndex + 1)%colors.length)
    }

    return (
        <div 
            style={
                { 
                    height: '100px',
                    margin: '20px',
                    padding: '20px',
                    backgroundColor: colors[colorIndex],
                    borderRadius: '8px',
                }
            }
        >
            <p>The color is {colors[colorIndex]}</p>
            <button onClick={handleClick}>Change Color</button>
        </div>

    )
  
  };

export default UseStateHook;