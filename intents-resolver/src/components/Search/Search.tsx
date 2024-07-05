import React, { CSSProperties } from "react";
import { ButtonIcon, Input } from "@interopio/components-react";
import { SearchProps } from "./types";

const Search = ({ searchQuery, setSearchQuery, handleSearchQueryChange }: SearchProps) => {
    const styles = {
        wrapper: {
            position: "relative",
        },
        input: {
            paddingLeft: "2.15em",
            paddingRight: "2.15em",
        },
        btnIcon: {
            position: "absolute",
            bottom: "0.15em",
        },
        btnIconRight: {
            right: 0,
        },
    };

    return (
        <div className="column-wrapper" style={{ position: "relative" }}>
            <ButtonIcon icon="search" size="24" style={styles.btnIcon as CSSProperties} />
            <Input placeholder="Filter apps" value={searchQuery} onChange={handleSearchQueryChange} style={styles.input as CSSProperties} />
            <ButtonIcon
                icon="close"
                size="24"
                onClick={() => setSearchQuery("")}
                style={{
                    ...(styles.btnIcon as CSSProperties),
                    ...(styles.btnIconRight as CSSProperties),
                }}
            />
        </div>
    );
};

export default Search;
