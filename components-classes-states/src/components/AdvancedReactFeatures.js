import React, { 
  useState, 
  useEffect, 
  useCallback, 
  useMemo, 
  useRef, 
  useReducer, 
  useTransition, 
  useId,
  startTransition,
  Suspense, 
  lazy 
} from 'react';
import { createPortal } from 'react-dom';

// 1. Custom Hook with TypeScript-like PropTypes
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// 2. Complex Reducer Pattern
const initialState = { count: 0, history: [] };

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return {
        count: state.count + 1,
        history: [...state.history, { type: 'increment', timestamp: Date.now() }]
      };
    case 'decrement':
      return {
        count: state.count - 1,
        history: [...state.history, { type: 'decrement', timestamp: Date.now() }]
      };
    case 'reset':
      return initialState;
    default:
      return state;
  }
};

// 3. React Portal Component
const Modal = ({ children, onClose }) => {
  const modalRoot = document.getElementById('modal-root') || document.body;
  
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalRoot
  );
};

// 4. Custom Error Boundary with Recovery
class AdvancedErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // Log error to service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

// 5. Advanced Context with Reducer
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// 6. Component with Advanced Hooks
const AdvancedHooksDemo = () => {
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const searchInputRef = useRef(null);
  const uniqueId = useId();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleSearch = useCallback((event) => {
    const value = event.target.value;
    startTransition(() => {
      setSearchTerm(value);
    });
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [items, debouncedSearchTerm]);

  return (
    <div>
      <input
        ref={searchInputRef}
        id={`search-${uniqueId}`}
        type="text"
        onChange={handleSearch}
        placeholder="Search..."
      />
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {filteredItems.map((item, index) => (
            <li key={`${uniqueId}-${index}`}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

// 7. Render Props Pattern with Performance Optimization
const DataRenderer = ({ render, data }) => {
  const memoizedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: item.value * 2
    }));
  }, [data]);

  return render(memoizedData);
};

// 8. Advanced Form Handling with Custom Hooks
const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    reset
  };
};

// Main Component
const AdvancedFeatures = () => {
  const [showModal, setShowModal] = useState(false);
  const { values, handleChange, handleBlur } = useForm({
    username: '',
    email: ''
  });

  return (
    <AppProvider>
      <AdvancedErrorBoundary>
        <div className="advanced-features">
          <h1>Advanced React Features</h1>

          <section>
            <h2>Advanced Hooks Demo</h2>
            <AdvancedHooksDemo />
          </section>

          <section>
            <h2>Portal Demo</h2>
            <button onClick={() => setShowModal(true)}>Open Modal</button>
            {showModal && (
              <Modal onClose={() => setShowModal(false)}>
                <h3>Modal Content</h3>
                <p>This is rendered in a portal</p>
              </Modal>
            )}
          </section>

          <section>
            <h2>Advanced Form</h2>
            <form onSubmit={e => e.preventDefault()}>
              <input
                name="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Username"
              />
              <input
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email"
              />
            </form>
          </section>

          <section>
            <h2>Render Props Pattern</h2>
            <DataRenderer
              data={[{ value: 1 }, { value: 2 }]}
              render={data => (
                <ul>
                  {data.map((item, index) => (
                    <li key={index}>
                      Original: {item.value}, Processed: {item.processed}
                    </li>
                  ))}
                </ul>
              )}
            />
          </section>
        </div>
      </AdvancedErrorBoundary>
    </AppProvider>
  );
};

export default AdvancedFeatures;