import React from 'react';
import './styles/SearchInput.less';

const SearchInput = (props) => {

  const { value = "", onChange, onSearch } = props;

  return (
    <div className="search-input-root">
      <input type="text" className="search-input-box" value={value} onChange={onChange} />
      <button className="search-input-btn" onClick={onSearch}>Search</button>
    </div>
  );
}

export default SearchInput