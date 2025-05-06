import React, { useState, useEffect, Suspense, lazy } from 'react';

// Basic Loading Component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    Loading...
    <div className="spinner"></div>
  </div>
);

// 1. Basic Loading with useState
const BasicLoading = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setData("Loaded Data");
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) return <LoadingSpinner />;
  return <div>{data}</div>;
};

// 2. Progressive Loading Component
const ProgressiveLoading = () => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoaded(true);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (!isLoaded) {
    return (
      <div className="progressive-loading">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <p>{progress}% loaded</p>
      </div>
    );
  }

  return <div>Content Loaded!</div>;
};

// 3. Lazy Loaded Component with Suspense
const LazyLoadedComponent = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        default: () => <div>This component was lazy loaded!</div>
      });
    }, 2000);
  });
});

// 4. Skeleton Loading Component
const SkeletonLoading = () => (
  <div className="skeleton">
    <div className="skeleton-header"></div>
    <div className="skeleton-text"></div>
    <div className="skeleton-text"></div>
    <div className="skeleton-text"></div>
  </div>
);

// 5. Error Boundary for Loading
class LoadingErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Error loading component!</div>;
    }
    return this.props.children;
  }
}

// 6. Advanced Lazy Loading with Preload
const AdvancedLazyComponent = lazy(() => import('./HeavyComponent'));
const preloadComponent = () => {
  const componentPromise = import('./HeavyComponent');
  return componentPromise;
};

// Main Component combining all examples
const LoadingExamples = () => {
  const [showLazy, setShowLazy] = useState(false);

  const handlePreload = () => {
    preloadComponent(); // Start preloading
  };

  const handleShow = () => {
    setShowLazy(true);
  };

  return (
    <div className="loading-examples">
      <h2>Loading Pattern Examples</h2>

      <section>
        <h3>1. Basic Loading</h3>
        <BasicLoading />
      </section>

      <section>
        <h3>2. Progressive Loading</h3>
        <ProgressiveLoading />
      </section>

      <section>
        <h3>3. Lazy Loading with Suspense</h3>
        <LoadingErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            {showLazy && <LazyLoadedComponent />}
            <button 
              onMouseEnter={handlePreload} 
              onClick={handleShow}
            >
              Show Lazy Component
            </button>
          </Suspense>
        </LoadingErrorBoundary>
      </section>

      <section>
        <h3>4. Skeleton Loading</h3>
        <SkeletonLoading />
      </section>
    </div>
  );
};

export default LoadingExamples;