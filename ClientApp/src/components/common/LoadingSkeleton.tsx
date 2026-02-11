import React from 'react';
import './LoadingSkeleton.css';

interface LoadingSkeletonProps {
  type?: 'card' | 'text' | 'title' | 'list' | 'image';
  count?: number;
  height?: string;
  width?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'card',
  count = 1,
  height = '100px',
  width = '100%'
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-text" style={{ height: '20px', marginBottom: '10px' }}></div>
            <div className="skeleton-text" style={{ height: '16px', marginBottom: '8px', width: '80%' }}></div>
            <div className="skeleton-text" style={{ height: '16px', width: '60%' }}></div>
          </div>
        );
      case 'title':
        return <div className="skeleton-text" style={{ height: '36px', width, marginBottom: '16px' }}></div>;
      case 'text':
        return <div className="skeleton-text" style={{ height, width, marginBottom: '8px' }}></div>;
      case 'image':
        return <div className="skeleton-image" style={{ height, width }}></div>;
      case 'list':
        return (
          <div className="skeleton-list">
            <div className="skeleton-text" style={{ height: '16px', marginBottom: '12px' }}></div>
            <div className="skeleton-text" style={{ height: '16px', marginBottom: '12px', width: '90%' }}></div>
            <div className="skeleton-text" style={{ height: '16px', marginBottom: '12px', width: '85%' }}></div>
          </div>
        );
      default:
        return <div className="skeleton-text" style={{ height, width }}></div>;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ marginBottom: type === 'card' ? '20px' : '0' }}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};

export default LoadingSkeleton;
