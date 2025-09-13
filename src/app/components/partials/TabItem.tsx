

interface TabItemProps {
  value: string;
  setActiveTab(newValue: string): void;
  activeTab: string;
}

const TabItem = ({value, setActiveTab, activeTab}:TabItemProps) => {
  return (
    <button
      className={`tab-item ${value === activeTab ? 'tab-item-active' : ''}`}
      key={value as string}
      onClick={() => setActiveTab(value as string)}
    >
      {value}
    </button>
  )
}

export default TabItem;
