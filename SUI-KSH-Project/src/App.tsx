
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ExchangeProvider } from './context/ExchangeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Exchange from './pages/Exchange';
import Transactions from './pages/Transactions';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Login from './pages/Login';

// app function that handles routing and authentication
function App() {
  return (
    <Router>
      <AuthProvider>
        <ExchangeProvider>
          <Toaster position="bottom-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="exchange" element={<Exchange />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </ExchangeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;