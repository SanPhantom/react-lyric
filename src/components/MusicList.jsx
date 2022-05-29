import React from 'react';

const MusicList = (props) => {

  const { list, itemRender } = props;

  return (
    <div className="music-list-root">
      { list && list.map((item, index) => {
        return itemRender(item, index);
      }) }
    </div>
  );
}

export default MusicList