import React from 'react';

const Tabs = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex border-b border-(--border-subtle) ${className}`}>
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`
            relative px-4 py-3 text-sm font-medium transition-all duration-200
            ${activeTab === tab.value 
              ? 'text-(--accent-400)' 
              : 'text-(--text-muted) hover:text-(--text-secondary)'
            }
          `}
        >
          {tab.label}
          {activeTab === tab.value && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-(--accent-500) to-(--accent-400)" />
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
