import { useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { useExchange } from '../context/ExchangeContext';
import {  TransactionStatus } from '../types';

// Page for viewing transactions history and filtering
const Transactions = () => {
  const { recentTransactions } = useExchange();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'SUI-KSH' | 'KSH-SUI'>('all');
  
  // Apply filters
  const filteredTransactions = recentTransactions.filter(transaction => {
    // Status filter
    if (statusFilter !== 'all' && transaction.status !== statusFilter) {
      return false;
    }
    
    // Type filter
    if (typeFilter !== 'all' && transaction.type !== typeFilter) {
      return false;
    }
    
    // Search by txHash or id
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        transaction.id.toLowerCase().includes(query) ||
        transaction.txHash.toLowerCase().includes(query) ||
        transaction.fromAddress.toLowerCase().includes(query) ||
        transaction.toAddress.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Status badge mapping
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'processing':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            Processing
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Failed
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
        <p className="text-gray-600">View and manage your exchange transactions.</p>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transaction ID or address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex space-x-4">
            <div className="w-48">
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | 'all')}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="w-48">
              <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'all' | 'SUI-KSH' | 'KSH-SUI')}
                className="input"
              >
                <option value="all">All Types</option>
                <option value="SUI-KSH">SUI to KSH</option>
                <option value="KSH-SUI">KSH to SUI</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.type}</div>
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
                      <div className="text-sm text-gray-500">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {transaction.txHash && (
                        <a
                          href={`https://explorer.sui.io/txblock/${transaction.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 inline-flex items-center"
                        >
                          <span className="mr-1">View</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No transactions found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;