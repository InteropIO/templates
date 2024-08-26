import React from "react";
import { ButtonIcon, Input } from "@interopio/components-react";
import { SearchProps } from "./types";

const Search = ({ searchQuery, setSearchQuery, handleSearchQueryChange }: SearchProps) => {
    return (
        <div className="column-wrapper">
            <ButtonIcon icon="search" size="24" className="io-btn-icon io-btn-icon-size-24 input-search-icon"/>
            <Input placeholder="Filter apps" value={searchQuery} onChange={handleSearchQueryChange} />
            <ButtonIcon icon="close" size="24" onClick={() => setSearchQuery("")} className="io-btn-icon io-btn-icon-size-24 input-close-icon"/>
        </div>
    );
};

export default Search;
