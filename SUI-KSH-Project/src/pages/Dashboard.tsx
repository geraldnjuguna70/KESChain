import React, { useState } from 'react';
import { TrendingUp, BarChart3, AlertCircle, RefreshCw } from 'lucide-react';
import { useExchange } from '../context/ExchangeContext';
import { fetchHistoricalRates } from '../services/exchangeRateService';
import { ExchangePair } from '../types';

// Dashboard component to display the exchange dashboard
const Dashboard = () => {
  const { exchangeRates, liquidityPools, recentTransactions } = useExchange();
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const [selectedPair, setSelectedPair] = useState<ExchangePair>('SUI-KSH');
  const [historicalData, setHistoricalData] = useState<{timestamp: Date, rate: number}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load historical data
  React.useEffect(() => {
    const loadHistoricalData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchHistoricalRates(selectedPair, timeframe);
        setHistoricalData(data);
      } catch (error) {
        console.error('Failed to fetch historical rates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHistoricalData();
  }, [selectedPair, timeframe]);
  
  // Calculate stats
  const completedTransactions = recentTransactions.filter(tx => tx.status === 'completed');

  // Transaction success rate
  const successRate = recentTransactions.length > 0
    ? (completedTransactions.length / recentTransactions.length) * 100
    : 0;
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Monitor exchange rates, liquidity pools, and transaction statistics.</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Current SUI-KSH Rate</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {exchangeRates['SUI-KSH'].rate.toFixed(2)} KSH
              </h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mr-4">
              <BarChart3 className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">SUI Pool Size</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {liquidityPools.sui.balance.toLocaleString()} SUI
              </h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4">
              <BarChart3 className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">KSH Pool Size</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {liquidityPools.ksh.balance.toLocaleString()} KSH
              </h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <RefreshCw className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Success Rate</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {successRate.toFixed(1)}%
              </h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Historical Rate Chart</h2>
          <div className="flex space-x-2">
            <div>
              <select
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value as ExchangePair)}
                className="input py-1 text-sm"
              >
                <option value="SUI-KSH">SUI-KSH</option>
                <option value="KSH-SUI">KSH-SUI</option>
              </select>
            </div>
            <div>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as 'day' | 'week' | 'month')}
                className="input py-1 text-sm"
              >
                <option value="day">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        ) : (
          <div className="h-64 relative">
            {/* This would be replaced with an actual chart component */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-500 text-sm bg-gray-50 px-4 py-2 rounded-lg">
                Chart visualization would be implemented here with a charting library
              </div>
            </div>
            
            {/* Mock chart data visualization */}
            <div className="absolute inset-0">
              <div className="h-full flex items-end">
                {historicalData.map((dataPoint, index) => (
                  <div 
                    key={index} 
                    className="flex-1 bg-primary/20 hover:bg-primary/30 transition-colors" 
                    style={{ 
                      height: `${Math.min(
                        Math.max(
                          ((dataPoint.rate - (selectedPair === 'SUI-KSH' ? 145 : 0.005)) / 
                          (selectedPair === 'SUI-KSH' ? 155 - 145 : 0.008 - 0.005)) * 100, 
                          5
                        ), 
                        100
                      )}%` 
                    }}
                    title={`${new Date(dataPoint.timestamp).toLocaleString()}: ${dataPoint.rate.toFixed(
                      selectedPair === 'SUI-KSH' ? 2 : 6
                    )}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-500">Start Rate</p>
            <p className="text-sm font-medium">
              {historicalData.length > 0 ? historicalData[0].rate.toFixed(selectedPair === 'SUI-KSH' ? 2 : 6) : '-'}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-500">End Rate</p>
            <p className="text-sm font-medium">
              {historicalData.length > 0 ? historicalData[historicalData.length - 1].rate.toFixed(selectedPair === 'SUI-KSH' ? 2 : 6) : '-'}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-500">High</p>
            <p className="text-sm font-medium">
              {historicalData.length > 0 
                ? Math.max(...historicalData.map(d => d.rate)).toFixed(selectedPair === 'SUI-KSH' ? 2 : 6) 
                : '-'}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-500">Low</p>
            <p className="text-sm font-medium">
              {historicalData.length > 0 
                ? Math.min(...historicalData.map(d => d.rate)).toFixed(selectedPair === 'SUI-KSH' ? 2 : 6) 
                : '-'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Liquidity Pools Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SUI Liquidity Pool</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Total Liquidity</span>
                <span className="text-sm font-medium">{liquidityPools.sui.balance.toLocaleString()} SUI</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Available</span>
                <span className="text-sm font-medium">{liquidityPools.sui.available.toLocaleString()} SUI ({((liquidityPools.sui.available / liquidityPools.sui.balance) * 100).toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(liquidityPools.sui.available / liquidityPools.sui.balance) * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Reserved</span>
                <span className="text-sm font-medium">{liquidityPools.sui.reserved.toLocaleString()} SUI ({((liquidityPools.sui.reserved / liquidityPools.sui.balance) * 100).toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(liquidityPools.sui.reserved / liquidityPools.sui.balance) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">KSH Liquidity Pool</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Total Liquidity</span>
                <span className="text-sm font-medium">{liquidityPools.ksh.balance.toLocaleString()} KSH</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-secondary h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Available</span>
                <span className="text-sm font-medium">{liquidityPools.ksh.available.toLocaleString()} KSH ({((liquidityPools.ksh.available / liquidityPools.ksh.balance) * 100).toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(liquidityPools.ksh.available / liquidityPools.ksh.balance) * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Reserved</span>
                <span className="text-sm font-medium">{liquidityPools.ksh.reserved.toLocaleString()} KSH ({((liquidityPools.ksh.reserved / liquidityPools.ksh.balance) * 100).toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(liquidityPools.ksh.reserved / liquidityPools.ksh.balance) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Information Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">About Liquidity Pools</h3>
            <p className="text-sm text-blue-700 mt-1">
              Liquidity pools ensure that exchanges can happen instantly at any time. The available funds can be used for new exchanges, while reserved funds are allocated to pending transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;