
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSortChange: (sortBy: string) => void;
  sortBy: string;
}

export const SearchBar = ({ onSearch, onSortChange, sortBy }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search streamers..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
        />
      </div>
      
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full sm:w-48 bg-white/10 border-white/20 text-white">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value="price-desc" className="text-white hover:bg-gray-700">Price (High to Low)</SelectItem>
          <SelectItem value="price-asc" className="text-white hover:bg-gray-700">Price (Low to High)</SelectItem>
          <SelectItem value="name-asc" className="text-white hover:bg-gray-700">Name (A to Z)</SelectItem>
          <SelectItem value="name-desc" className="text-white hover:bg-gray-700">Name (Z to A)</SelectItem>
          <SelectItem value="followers-desc" className="text-white hover:bg-gray-700">Most Followers</SelectItem>
          <SelectItem value="change-desc" className="text-white hover:bg-gray-700">Biggest Gainers</SelectItem>
          <SelectItem value="change-asc" className="text-white hover:bg-gray-700">Biggest Losers</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
