import React from "react";
import { createContext } from "react";

//react class component
class SimpleClass extends React.Component {
    render() {
        return (
            <div className="container">
                <h1>Class component</h1>
                <p>this is a simple class component</p>
                <hr></hr>
                <StateAndPropsComponent />
                <hr></hr>
                    <App />
            </div>
        )
    }
}

/*State and Props in Class Components 
State is used to manage dynamic data within a component, 
while props are used to pass data from parent to child components. 
*/

class StateAndPropsComponent extends React.Component {
    constructor(props) {//constructor initializes the component and receives [props from the parent]
        super(props) // required to access "this.props" in the constructor
        this.state = {
            count: 0,
            //initialize the state with a count property set to 0
        }
    }

    incrementCount = () => {
        this.setState({ count: this.state.count + 1 })
        //update the state by incrementing the count property by 1
    }

    render() {
        return (
            <div>
                <h1>Count: {this.state.count}</h1>
                {/* Displays the current count from the state. */}

                <button onClick={this.incrementCount}>Increment</button>
                {/* Button to trigger the `incrementCount` method when clicked. */}

                <p>Message from Parent: {this.props.message}</p>
                {/* Displays a message passed as a prop from the parent component. */}
            </div>
        )
    }

}



// Create Context
//The Context API allows you to share data across the component tree without passing props manually
const ThemeContext = createContext();

class App extends React.Component {
    state = {
        theme: 'light',
    };

    toggleTheme = () => {
        this.setState((prevState) => ({
            theme: prevState.theme === 'light' ? 'dark' : 'light',
        }));
    };

    render() {
        return (
            <ThemeContext.Provider value={{ theme: this.state.theme, toggleTheme: this.toggleTheme }}>
                <div>
                    <h1>Current Theme: {this.state.theme}</h1>
                    <ThemeConsumerComponent />
                </div>
            </ThemeContext.Provider>
        );
    }
}

class ThemeConsumerComponent extends React.Component {
    static contextType = ThemeContext;

    render() {
        const { theme, toggleTheme } = this.context;
        return (
            <div>
                <p>Theme in Consumer: {theme}</p>
                <button onClick={toggleTheme}>Toggle Theme</button>
            </div>
        );
    }
}



export default SimpleClass;