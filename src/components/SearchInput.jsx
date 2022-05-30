import React from 'react';
import './styles/SearchInput.less';

const SearchInput = (props) => {

  const { value = "", onChange, onSearch } = props;

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      onSearch();
    }
  }

  return (
    <div className="search-input-root">
      <input type="text" className="search-input-box" value={value} onChange={onChange} onKeyUp={handleKeyUp} />
      <button className="search-input-btn" onClick={onSearch}>Search</button>
    </div>
  );
}

export default SearchInput