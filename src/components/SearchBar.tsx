import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-3xl mx-auto mb-12">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input
        className="pl-10 h-12 text-lg bg-white"
        placeholder="Search departments or people..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};