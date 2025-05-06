import React from 'react';
import { FaSearch } from 'react-icons/fa';

const Search = ({ searchItem, setSearchTerm }) => {
    return (
        <div className="relative  w-fit m-auto p-2">
            {/* Wrapper with relative positioning */}
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {/* Search icon positioned inside the input */}
            <input
                type="text"
                placeholder="Search for a movie"
                value={searchItem}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                /* Input with padding to avoid overlapping the icon */
            />
        </div>
    );
};

export default Search;