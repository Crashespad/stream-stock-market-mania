
interface MarketNavigationProps {
  marketSubTab: string;
  setMarketSubTab: (tab: string) => void;
}

export const MarketNavigation = ({ marketSubTab, setMarketSubTab }: MarketNavigationProps) => {
  return (
    <div className="flex justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-1 inline-flex">
        <button
          onClick={() => setMarketSubTab("streamers")}
          className={`px-6 py-2 rounded-md transition-all ${
            marketSubTab === "streamers"
              ? "bg-white/20 text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          Streamers
        </button>
        <button
          onClick={() => setMarketSubTab("funds")}
          className={`px-6 py-2 rounded-md transition-all ${
            marketSubTab === "funds"
              ? "bg-white/20 text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          Funds
        </button>
      </div>
    </div>
  );
};
