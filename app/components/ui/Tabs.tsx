import React from "react";

export type TabKey = string;

type TabsProps = {
  value: TabKey;
  onChange: (value: TabKey) => void;
  items: { key: TabKey; label: string; icon?: React.ReactNode }[];
};

export function Tabs({ value, onChange, items }: TabsProps) {
  return (
    <div className="rounded-2xl shadow-sm" style={{ background: 'var(--color-surface)' }}>
      <div className="flex" style={{ borderBottom: '1px solid var(--color-border)' }}>
        {items.map((tab) => {
          const active = value === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className="flex items-center px-6 py-4 font-medium transition-colors"
              style={{
                color: active ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                borderBottom: active ? '2px solid var(--color-primary)' : '2px solid transparent',
                background: active ? 'var(--color-primary-weak)' : 'transparent'
              }}
            >
              {tab.icon ? <span className="mr-2">{tab.icon}</span> : null}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Tabs;