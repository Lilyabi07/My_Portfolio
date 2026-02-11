import React from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  icon?: string; // FontAwesome icon class (e.g., 'fas fa-briefcase')
  title: string;
  message?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  customEmoji?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  actionButton,
  customEmoji
}) => {
  return (
    <div className="empty-state-container">
      <div className="empty-state-content">
        {customEmoji ? (
          <div className="empty-state-emoji">{customEmoji}</div>
        ) : icon ? (
          <div className="empty-state-icon">
            <i className={icon}></i>
          </div>
        ) : null}
        
        <h3 className="empty-state-title">{title}</h3>
        
        {message && <p className="empty-state-message">{message}</p>}
        
        {actionButton && (
          <button className="btn btn-primary mt-3" onClick={actionButton.onClick}>
            {actionButton.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
