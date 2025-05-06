
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, ShieldCheck, Wallet, RefreshCcw } from 'lucide-react';
import { useExchange } from '../context/ExchangeContext';

// page for exchange of SUI and KSH tokens   
const Home = () => {
  const { exchangeRates, recentTransactions } = useExchange();
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to SUI-KSH DEX</h1>
        <p className="text-gray-600">The secure bridge between SUI blockchain and M-PESA.</p>
      </div>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-8 mb-8 text-white">
        <div className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Fast, Secure and Affordable SUI to KSH Exchange</h2>
          <p className="mb-6 text-white/90">Our automated bot ensures seamless transactions between SUI cryptocurrency and Kenyan Shillings through M-PESA.</p>
          <Link 
            to="/exchange" 
            className="inline-flex items-center bg-white text-primary px-5 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Start Exchange <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
      
      {/* Current Rates */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Exchange Rates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">SUI to KSH</span>
              </div>
              <span className="text-sm text-gray-500">Updated {new Date(exchangeRates['SUI-KSH'].lastUpdated).toLocaleTimeString()}</span>
            </div>
            <div className="text-3xl font-bold mb-2">
              {exchangeRates['SUI-KSH'].rate.toFixed(2)} <span className="text-sm font-normal text-gray-500">KSH</span>
            </div>
            <div className="flex items-center text-green-500 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+2.5% from yesterday</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                </div>
                <span className="font-medium">KSH to SUI</span>
              </div>
              <span className="text-sm text-gray-500">Updated {new Date(exchangeRates['KSH-SUI'].lastUpdated).toLocaleTimeString()}</span>
            </div>
            <div className="text-3xl font-bold mb-2">
              {exchangeRates['KSH-SUI'].rate.toFixed(6)} <span className="text-sm font-normal text-gray-500">SUI</span>
            </div>
            <div className="flex items-center text-green-500 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+1.8% from yesterday</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Why Choose Our DEX</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <RefreshCcw className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Automated Exchange</h3>
            <p className="text-gray-600">Our bot automatically confirms transactions on both networks and completes the exchange without manual intervention.</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Secure & Reliable</h3>
            <p className="text-gray-600">Advanced security measures protect both our liquidity pools and your transactions with multi-layer verification.</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Managed Liquidity</h3>
            <p className="text-gray-600">Our liquidity pools ensure fast execution of exchanges with minimal slippage and competitive rates.</p>
          </div>
        </div>
      </div>
      
      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <Link to="/transactions" className="text-primary text-sm flex items-center hover:underline">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.slice(0, 3).map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transaction.type === 'SUI-KSH' 
                          ? `${transaction.amount} SUI → ${(transaction.amount * transaction.exchangeRate).toFixed(2)} KSH`
                          : `${transaction.amount} KSH → ${(transaction.amount * transaction.exchangeRate).toFixed(6)} SUI`
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;