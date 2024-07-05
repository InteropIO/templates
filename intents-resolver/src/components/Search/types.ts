export interface SearchProps {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    handleSearchQueryChange: (e: any) => void;
}