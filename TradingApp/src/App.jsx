import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import './App.css';
import Navbar from './component/Navbar';

const AppContent = () => {
  const widgetContainerRef = useRef(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (widgetContainerRef.current) {
        widgetContainerRef.current.innerHTML = "";
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loadTradingViewWidget = async () => {
      try {
        // Clean up previous widget
        if (widgetRef.current && widgetContainerRef.current) {
          widgetContainerRef.current.innerHTML = "";
        }

        // Load TradingView script if not already loaded
        if (!window.TradingView) {
          await new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/tv.js";
            script.async = true;
            script.onload = resolve;
            document.body.appendChild(script);
          });
        }

        // Create widget
        if (window.TradingView && widgetContainerRef.current) {
          widgetRef.current = new window.TradingView.widget({
            container_id: widgetContainerRef.current.id,
            width: "100%",
            height: 500,
            symbol: "SUI/KSH",
            interval: "D",
            timezone: "Etc/UTC",
            theme: theme,
            style: "1",
            locale: "en",
            toolbar_bg: theme === 'dark' ? '#1e222d' : '#f1f3f6',
            enable_publishing: false,
            allow_symbol_change: true,
            hide_side_toolbar: false,
          });
        }
      } catch (error) {
        console.error("Error loading TradingView widget:", error);
      }
    };

    loadTradingViewWidget();
  }, [mounted, theme]);

  if (!mounted) {
    return (
      <div className="loading-placeholder">
        <p>Loading chart...</p>
      </div>
    );
  }

  return (
    <div className={`app ${theme}`}>
      <Navbar />
      <main>
        <div id="tradingview-widget" ref={widgetContainerRef}></div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;