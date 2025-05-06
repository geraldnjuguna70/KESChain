import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useNavigate,
  useLocation,
  Outlet
} from 'react-router-dom';

import './RoutingGuide.css';

// =============================================
// BASIC COMPONENTS FOR ROUTES
// =============================================

// Home component
const Home = () => (
  <div className="page">
    <h2>Home Page</h2>
    <p>Welcome to the React Router guide! Click on the links above to explore different routing concepts.</p>
  </div>
);

// About component
const About = () => (
  <div className="page">
    <h2>About Page</h2>
    <p>This is a comprehensive guide to React Router, covering basic to advanced concepts.</p>
  </div>
);

// Contact component
const Contact = () => (
  <div className="page">
    <h2>Contact Page</h2>
    <p>You can reach us at example@example.com</p>
  </div>
);

// =============================================
// ROUTE PARAMETERS
// =============================================

// User Profile component with route parameters
const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, we'll consider users with IDs 1-5 as valid
      if (userId >= 1 && userId <= 5) {
        setUser({
          id: userId,
          name: `User ${userId}`,
          email: `user${userId}@example.com`,
          role: userId === '1' ? 'Admin' : 'User'
        });
        setLoading(false);
      } else {
        setError('User not found');
        setLoading(false);
      }
    }, 1000);
  }, [userId]);

  if (loading) {
    return <div className="page">Loading user data...</div>;
  }

  if (error) {
    return (
      <div className="page error">
        <h2>Error: {error}</h2>
        <p>The requested user could not be found.</p>
        <Link to="/users">Back to Users List</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>User Profile</h2>
      <div className="user-card">
        <h3>{user.name}</h3>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
      <Link to="/users">Back to Users List</Link>
    </div>
  );
};

// Users List component
const UsersList = () => {
  const users = [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
    { id: 3, name: 'User 3' },
    { id: 4, name: 'User 4' },
    { id: 5, name: 'User 5' }
  ];

  return (
    <div className="page">
      <h2>Users List</h2>
      <ul className="users-list">
        {users.map(user => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
      <p>
        <strong>Try invalid user:</strong>{' '}
        <Link to="/users/999">Non-existent User (404)</Link>
      </p>
    </div>
  );
};

// =============================================
// NESTED ROUTES
// =============================================

// Parent component for nested routes
const Products = () => {
  return (
    <div className="page">
      <h2>Products</h2>
      <div className="nested-nav">
        <Link to="/products/list">All Products</Link>
        <Link to="/products/featured">Featured</Link>
        <Link to="/products/new">New Arrivals</Link>
      </div>
      
      {/* Outlet renders the matched child route */}
      <Outlet />
    </div>
  );
};

// Child components for nested routes
const ProductsList = () => (
  <div className="nested-content">
    <h3>All Products</h3>
    <ul>
      <li>Product 1</li>
      <li>Product 2</li>
      <li>Product 3</li>
      <li>Product 4</li>
      <li>Product 5</li>
    </ul>
  </div>
);

const FeaturedProducts = () => (
  <div className="nested-content">
    <h3>Featured Products</h3>
    <ul>
      <li>Featured Product 1</li>
      <li>Featured Product 2</li>
      <li>Featured Product 3</li>
    </ul>
  </div>
);

const NewProducts = () => (
  <div className="nested-content">
    <h3>New Arrivals</h3>
    <ul>
      <li>New Product 1</li>
      <li>New Product 2</li>
    </ul>
  </div>
);

// =============================================
// PROTECTED ROUTES
// =============================================

// Authentication context (simplified)
const AuthContext = React.createContext(null);

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    // Simulate login
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Simulate logout
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page, but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Login page
const Login = () => {
  const { isAuthenticated, login } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  const handleLogin = () => {
    login();
    // Redirect to the page they were trying to access
    navigate(from, { replace: true });
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="page">
      <h2>Login Page</h2>
      <p>You must log in to view the dashboard and admin pages.</p>
      <button onClick={handleLogin} className="login-button">
        Log In
      </button>
    </div>
  );
};

// Dashboard (protected page)
const Dashboard = () => {
  const { logout } = React.useContext(AuthContext);
  
  return (
    <div className="page">
      <h2>Dashboard</h2>
      <p>Welcome to your dashboard! This is a protected route.</p>
      <div className="dashboard-links">
        <Link to="/admin">Go to Admin Page</Link>
      </div>
      <button onClick={logout} className="logout-button">
        Log Out
      </button>
    </div>
  );
};

// Admin page (protected)
const Admin = () => {
  const { logout } = React.useContext(AuthContext);
  
  return (
    <div className="page">
      <h2>Admin Page</h2>
      <p>This is the admin area. Only authenticated users can see this.</p>
      <button onClick={logout} className="logout-button">
        Log Out
      </button>
    </div>
  );
};

// =============================================
// HTTP STATUS CODES & ERROR HANDLING
// =============================================

// 404 Not Found
const NotFound = () => (
  <div className="page error">
    <h2>404 - Page Not Found</h2>
    <p>The page you are looking for does not exist.</p>
    <Link to="/">Go Home</Link>
  </div>
);

// 500 Server Error
const ServerError = () => (
  <div className="page error">
    <h2>500 - Server Error</h2>
    <p>Something went wrong on our servers. Please try again later.</p>
    <Link to="/">Go Home</Link>
  </div>
);

// 403 Forbidden
const Forbidden = () => (
  <div className="page error">
    <h2>403 - Forbidden</h2>
    <p>You don't have permission to access this resource.</p>
    <Link to="/">Go Home</Link>
  </div>
);

// 401 Unauthorized
const Unauthorized = () => (
  <div className="page error">
    <h2>401 - Unauthorized</h2>
    <p>You need to be authenticated to access this resource.</p>
    <Link to="/login">Log In</Link>
  </div>
);

// 301/302 Redirect Example
const OldPage = () => {
  return <Navigate to="/about" replace />;
};

// Error Boundary for catching runtime errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page error">
          <h2>Something went wrong!</h2>
          <p>An error occurred in the application.</p>
          <pre>{this.state.error?.toString()}</pre>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
          <Link to="/">Go Home</Link>
        </div>
      );
    }

    return this.props.children;
  }
}

// Component that will throw an error
const BuggyComponent = () => {
  const [shouldThrow, setShouldThrow] = useState(false);
  
  if (shouldThrow) {
    throw new Error("This is a simulated error!");
  }
  
  return (
    <div className="page">
      <h2>Error Boundary Test</h2>
      <p>Click the button below to simulate a JavaScript error.</p>
      <button onClick={() => setShouldThrow(true)} className="error-button">
        Throw Error
      </button>
    </div>
  );
};

// =============================================
// LAZY LOADING ROUTES
// =============================================

// Lazy loaded components (simulated)
const LazyComponent = lazy(() => {
  return new Promise(resolve => {
    // Simulate delay
    setTimeout(() => {
      resolve({
        default: () => (
          <div className="page">
            <h2>Lazy Loaded Component</h2>
            <p>This component was loaded lazily to improve initial load performance.</p>
          </div>
        )
      });
    }, 2000);
  });
});

// Loading fallback for Suspense
const LoadingFallback = () => (
  <div className="page loading">
    <h2>Loading...</h2>
    <div className="spinner"></div>
  </div>
);

// =============================================
// MAIN NAVIGATION COMPONENT
// =============================================

const Navigation = () => {
  const { isAuthenticated } = React.useContext(AuthContext);
  
  return (
    <nav className="main-nav">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/products">Products</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/admin">Admin</Link></li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
        <li className="dropdown">
          <span>Error Pages ▾</span>
          <div className="dropdown-content">
            <Link to="/not-found-example">404 Not Found</Link>
            <Link to="/server-error">500 Server Error</Link>
            <Link to="/forbidden">403 Forbidden</Link>
            <Link to="/unauthorized">401 Unauthorized</Link>
            <Link to="/error-boundary-test">Error Boundary</Link>
          </div>
        </li>
        <li className="dropdown">
          <span>Special Routes ▾</span>
          <div className="dropdown-content">
            <Link to="/old-page">301 Redirect</Link>
            <Link to="/lazy">Lazy Loaded</Link>
          </div>
        </li>
      </ul>
    </nav>
  );
};

// =============================================
// MAIN APP COMPONENT
// =============================================

const RoutingGuide = () => {
  return (
    <div className="routing-guide">
      <Router>
        <AuthProvider>
          <div className="app-container">
            <header>
              <h1>React Router Guide</h1>
              <p>From Basic to Advanced Routing</p>
            </header>
            
            <Navigation />
            
            <main>
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Basic Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    
                    {/* Routes with Parameters */}
                    <Route path="/users" element={<UsersList />} />
                    <Route path="/users/:userId" element={<UserProfile />} />
                    
                    {/* Nested Routes */}
                    <Route path="/products" element={<Products />}>
                      <Route index element={<ProductsList />} />
                      <Route path="list" element={<ProductsList />} />
                      <Route path="featured" element={<FeaturedProducts />} />
                      <Route path="new" element={<NewProducts />} />
                    </Route>
                    
                    {/* Authentication Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute>
                          <Admin />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Error Status Code Routes */}
                    <Route path="/not-found-example" element={<NotFound />} />
                    <Route path="/server-error" element={<ServerError />} />
                    <Route path="/forbidden" element={<Forbidden />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/error-boundary-test" element={<BuggyComponent />} />
                    
                    {/* Redirect Example */}
                    <Route path="/old-page" element={<OldPage />} />
                    
                    {/* Lazy Loaded Route */}
                    <Route path="/lazy" element={<LazyComponent />} />
                    
                    {/* 404 Catch-all Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </main>
            
            <footer>
              <p>React Router Guide &copy; {new Date().getFullYear()}</p>
            </footer>
          </div>
        </AuthProvider>
      </Router>
    </div>
  );
};

export default RoutingGuide;
