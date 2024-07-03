export interface InputProps {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    handleSearchQueryChange: (e: any) => void;
}