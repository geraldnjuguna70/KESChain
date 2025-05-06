import React from 'react';
import './ClassComponentsGuide.css';

// =============================================
// 1. BASIC CLASS COMPONENT
// =============================================
class BasicClassComponent extends React.Component {
  render() {
    return (
      <div className="component-section">
        <h2>1. Basic Class Component</h2>
        <p>This is the simplest form of a React class component.</p>
      </div>
    );
  }
}

// =============================================
// 2. CLASS COMPONENT WITH PROPS
// =============================================
class PropsComponent extends React.Component {
  render() {
    // Props are accessed via this.props
    return (
      <div className="component-section">
        <h2>2. Class Component with Props</h2>
        <p>Hello, {this.props.name}!</p>
        <p>Age: {this.props.age}</p>
      </div>
    );
  }
}

// Default props
PropsComponent.defaultProps = {
  name: 'Guest',
  age: 25
};

// =============================================
// 3. CLASS COMPONENT WITH STATE
// =============================================
class StateComponent extends React.Component {
  constructor(props) {
    super(props);
    // Initialize state in constructor
    this.state = {
      count: 0,
      isActive: false
    };
  }

  render() {
    return (
      <div className="component-section">
        <h2>3. Class Component with State</h2>
        <p>Count: {this.state.count}</p>
        <p>Status: {this.state.isActive ? 'Active' : 'Inactive'}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Increment
        </button>
        <button onClick={() => this.setState({ isActive: !this.state.isActive })}>
          Toggle Status
        </button>
      </div>
    );
  }
}

// =============================================
// 4. LIFECYCLE METHODS
// =============================================
class LifecycleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      time: new Date()
    };
    console.log('1. Constructor called');
  }

  componentDidMount() {
    console.log('3. componentDidMount called');
    // Simulate API call
    setTimeout(() => {
      this.setState({ data: 'Data loaded from API' });
    }, 2000);

    // Set up timer
    this.timerID = setInterval(() => {
      this.setState({ time: new Date() });
    }, 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('4. componentDidUpdate called');
    if (prevState.data !== this.state.data) {
      console.log('Data has changed!');
    }
  }

  componentWillUnmount() {
    console.log('5. componentWillUnmount called');
    // Clean up timer
    clearInterval(this.timerID);
  }

  render() {
    console.log('2. Render called');
    return (
      <div className="component-section">
        <h2>4. Lifecycle Methods</h2>
        <p>Current time: {this.state.time.toLocaleTimeString()}</p>
        <p>Data: {this.state.data || 'Loading...'}</p>
        <p>Check console for lifecycle method logs</p>
      </div>
    );
  }
}

// =============================================
// 5. EVENT HANDLING
// =============================================
class EventHandlingComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Hello!'
    };

    // Binding in constructor (recommended approach)
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ message: 'Button clicked!' });
  }

  // Arrow function method (automatically binds 'this')
  handleReset = () => {
    this.setState({ message: 'Hello!' });
  }

  render() {
    return (
      <div className="component-section">
        <h2>5. Event Handling</h2>
        <p>{this.state.message}</p>
        <button onClick={this.handleClick}>Click Me</button>
        <button onClick={this.handleReset}>Reset</button>
        {/* Inline arrow function (alternative approach) */}
        <button onClick={() => this.setState({ message: 'Inline handler!' })}>
          Inline Handler
        </button>
      </div>
    );
  }
}

// =============================================
// 6. CONDITIONAL RENDERING
// =============================================
class ConditionalRenderingComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      userType: 'guest',
      items: ['Apple', 'Banana', 'Orange']
    };
  }

  toggleLogin = () => {
    this.setState(prevState => ({
      isLoggedIn: !prevState.isLoggedIn
    }));
  }

  changeUserType = () => {
    const types = ['guest', 'user', 'admin'];
    const currentIndex = types.indexOf(this.state.userType);
    const nextIndex = (currentIndex + 1) % types.length;
    this.setState({ userType: types[nextIndex] });
  }

  render() {
    const { isLoggedIn, userType, items } = this.state;

    // Method 1: If/else
    let loginStatus;
    if (isLoggedIn) {
      loginStatus = <p>Welcome back, user!</p>;
    } else {
      loginStatus = <p>Please log in</p>;
    }

    return (
      <div className="component-section">
        <h2>6. Conditional Rendering</h2>
        
        {/* Method 1: Using variables */}
        {loginStatus}
        
        {/* Method 2: Inline if with && operator */}
        {isLoggedIn && <p>You are now logged in!</p>}
        
        {/* Method 3: Ternary operator */}
        <p>Status: {isLoggedIn ? 'Logged In' : 'Logged Out'}</p>
        
        {/* Method 4: Switch case (via IIFE) */}
        <div>
          User Type: {userType}
          {(() => {
            switch(userType) {
              case 'admin':
                return <p>You have full access</p>;
              case 'user':
                return <p>You have limited access</p>;
              default:
                return <p>You have view-only access</p>;
            }
          })()}
        </div>
        
        {/* List rendering with conditional */}
        <ul>
          {items.length > 0 ? (
            items.map((item, index) => <li key={index}>{item}</li>)
          ) : (
            <li>No items available</li>
          )}
        </ul>
        
        <button onClick={this.toggleLogin}>
          {isLoggedIn ? 'Log Out' : 'Log In'}
        </button>
        <button onClick={this.changeUserType}>
          Change User Type
        </button>
      </div>
    );
  }
}

// =============================================
// 7. FORM HANDLING
// =============================================
class FormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      topic: 'react',
      agreeToTerms: false,
      formErrors: {},
      submitted: false
    };
  }

  handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const val = type === 'checkbox' ? checked : value;
    
    this.setState({
      [name]: val
    });
  }

  validateForm = () => {
    const { username, email, agreeToTerms } = this.state;
    const errors = {};
    
    if (!username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!agreeToTerms) {
      errors.agreeToTerms = 'You must agree to terms';
    }
    
    return errors;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    
    const formErrors = this.validateForm();
    
    if (Object.keys(formErrors).length === 0) {
      // Form is valid
      this.setState({
        formErrors: {},
        submitted: true
      });
      console.log('Form submitted:', this.state);
    } else {
      // Form has errors
      this.setState({ formErrors });
    }
  }

  render() {
    const { username, email, topic, agreeToTerms, formErrors, submitted } = this.state;
    
    if (submitted) {
      return (
        <div className="component-section">
          <h2>7. Form Handling</h2>
          <div className="success-message">
            <h3>Form Submitted Successfully!</h3>
            <p>Username: {username}</p>
            <p>Email: {email}</p>
            <p>Topic: {topic}</p>
            <button onClick={() => this.setState({ submitted: false })}>
              Submit Another
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="component-section">
        <h2>7. Form Handling</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={this.handleChange}
            />
            {formErrors.username && (
              <span className="error">{formErrors.username}</span>
            )}
          </div>
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
            {formErrors.email && (
              <span className="error">{formErrors.email}</span>
            )}
          </div>
          
          <div className="form-group">
            <label>Topic:</label>
            <select
              name="topic"
              value={topic}
              onChange={this.handleChange}
            >
              <option value="react">React</option>
              <option value="angular">Angular</option>
              <option value="vue">Vue</option>
            </select>
          </div>
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={agreeToTerms}
              onChange={this.handleChange}
            />
            <label>I agree to terms and conditions</label>
            {formErrors.agreeToTerms && (
              <span className="error">{formErrors.agreeToTerms}</span>
            )}
          </div>
          
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

// =============================================
// 8. REFS
// =============================================
class RefsComponent extends React.Component {
  constructor(props) {
    super(props);
    // Create refs
    this.inputRef = React.createRef();
    this.textareaRef = React.createRef();
    
    // Legacy string ref approach (not recommended)
    this.state = {
      message: ''
    };
  }
  
  componentDidMount() {
    // Focus the input element when component mounts
    this.inputRef.current.focus();
  }
  
  handleButtonClick = () => {
    // Access the input value using ref
    const inputValue = this.inputRef.current.value;
    alert(`Input contains: ${inputValue}`);
    
    // Clear and focus the input
    this.inputRef.current.value = '';
    this.inputRef.current.focus();
  }
  
  handleResetClick = () => {
    // Reset both input and textarea
    this.inputRef.current.value = '';
    this.textareaRef.current.value = '';
    this.inputRef.current.focus();
  }
  
  render() {
    return (
      <div className="component-section">
        <h2>8. Refs</h2>
        <div>
          <input
            type="text"
            ref={this.inputRef}
            placeholder="This input is focused on load"
          />
        </div>
        <div>
          <textarea
            ref={this.textareaRef}
            placeholder="This is a textarea with ref"
          />
        </div>
        <button onClick={this.handleButtonClick}>
          Get Input Value
        </button>
        <button onClick={this.handleResetClick}>
          Reset Fields
        </button>
      </div>
    );
  }
}

// =============================================
// 9. HIGHER ORDER COMPONENTS (HOC)
// =============================================

// HOC that adds logging functionality
function withLogging(WrappedComponent) {
  return class extends React.Component {
    componentDidMount() {
      console.log(`Component ${WrappedComponent.name} mounted`);
    }
    
    componentWillUnmount() {
      console.log(`Component ${WrappedComponent.name} will unmount`);
    }
    
    render() {
      // Pass through all props
      return <WrappedComponent {...this.props} />;
    }
  };
}

// HOC that adds a loading state
function withLoader(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: true
      };
    }
    
    componentDidMount() {
      // Simulate loading delay
      setTimeout(() => {
        this.setState({ isLoading: false });
      }, 1500);
    }
    
    render() {
      const { isLoading } = this.state;
      
      if (isLoading) {
        return <div>Loading...</div>;
      }
      
      // Pass through all props
      return <WrappedComponent {...this.props} />;
    }
  };
}

// Simple component to enhance with HOCs
class SimpleHOCDemo extends React.Component {
  render() {
    return (
      <div>
        <p>This component is enhanced with HOCs</p>
        <p>Extra prop from HOC: {this.props.extraData}</p>
      </div>
    );
  }
}

// Apply multiple HOCs (composition)
const EnhancedComponent = withLoader(withLogging(SimpleHOCDemo));

// Component that demonstrates HOC usage
class HOCComponent extends React.Component {
  render() {
    return (
      <div className="component-section">
        <h2>9. Higher Order Components (HOC)</h2>
        <p>HOCs add reusable logic to components:</p>
        <EnhancedComponent extraData="This data was injected by HOC" />
      </div>
    );
  }
}

// =============================================
// 10. CONTEXT API
// =============================================

// Create a Context
const ThemeContext = React.createContext('light');

// Provider Component
class ThemeProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: 'light'
    };
  }
  
  toggleTheme = () => {
    this.setState(prevState => ({
      theme: prevState.theme === 'light' ? 'dark' : 'light'
    }));
  }
  
  render() {
    return (
      <ThemeContext.Provider 
        value={{
          theme: this.state.theme,
          toggleTheme: this.toggleTheme
        }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

// Consumer Component using Context
class ThemedButton extends React.Component {
  // Use contextType to access context in any lifecycle method
  static contextType = ThemeContext;
  
  render() {
    const { theme, toggleTheme } = this.context;
    const style = {
      backgroundColor: theme === 'light' ? '#fff' : '#333',
      color: theme === 'light' ? '#333' : '#fff',
      padding: '10px 15px',
      border: '1px solid #ccc',
      cursor: 'pointer'
    };
    
    return (
      <button 
        style={style} 
        onClick={toggleTheme}
      >
        Toggle Theme (Current: {theme})
      </button>
    );
  }
}

// Alternative Consumer Component using render props pattern
class ThemedText extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({ theme }) => (
          <p style={{ 
            color: theme === 'light' ? '#333' : '#fff',
            backgroundColor: theme === 'light' ? '#f8f9fa' : '#555',
            padding: '10px'
          }}>
            This text is styled based on the current theme
          </p>
        )}
      </ThemeContext.Consumer>
    );
  }
}

// Component that demonstrates Context API
class ContextComponent extends React.Component {
  render() {
    return (
      <div className="component-section">
        <h2>10. Context API</h2>
        <p>Context provides a way to pass data through the component tree without prop drilling:</p>
        
        <ThemeProvider>
          <div style={{ padding: '20px' }}>
            <ThemedText />
            <ThemedButton />
          </div>
        </ThemeProvider>
      </div>
    );
  }
}

// =============================================
// MAIN COMPONENT THAT COMBINES ALL EXAMPLES
// =============================================
class ClassComponentsGuide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSection: null
    };
  }
  
  setActiveSection = (section) => {
    this.setState({ activeSection: section });
  }
  
  render() {
    const { activeSection } = this.state;
    
    const sections = [
      { id: 'basic', title: 'Basic Class Component', component: <BasicClassComponent /> },
      { id: 'props', title: 'Props', component: <PropsComponent name="John Doe" age={30} /> },
      { id: 'state', title: 'State', component: <StateComponent /> },
      { id: 'lifecycle', title: 'Lifecycle Methods', component: <LifecycleComponent /> },
      { id: 'events', title: 'Event Handling', component: <EventHandlingComponent /> },
      { id: 'conditional', title: 'Conditional Rendering', component: <ConditionalRenderingComponent /> },
      { id: 'forms', title: 'Form Handling', component: <FormComponent /> },
      { id: 'refs', title: 'Refs', component: <RefsComponent /> },
      { id: 'hoc', title: 'Higher Order Components', component: <HOCComponent /> },
      { id: 'context', title: 'Context API', component: <ContextComponent /> }
    ];
    
    return (
      <div className="class-components-guide">
        <h1>React Class Components Guide</h1>
        <p>From basic to advanced implementations</p>
        
        <div className="navigation">
          <h3>Jump to Section:</h3>
          <ul>
            {sections.map(section => (
              <li key={section.id}>
                <button 
                  onClick={() => this.setActiveSection(section.id)}
                  className={activeSection === section.id ? 'active' : ''}
                >
                  {section.title}
                </button>
              </li>
            ))}
            <li>
              <button 
                onClick={() => this.setActiveSection(null)}
                className={activeSection === null ? 'active' : ''}
              >
                Show All
              </button>
            </li>
          </ul>
        </div>
        
        <div className="sections">
          {activeSection === null ? (
            // Show all sections
            sections.map(section => (
              <div key={section.id} id={section.id}>
                {section.component}
              </div>
            ))
          ) : (
            // Show only the active section
            sections.find(section => section.id === activeSection)?.component
          )}
        </div>
      </div>
    );
  }
}

export default ClassComponentsGuide;
