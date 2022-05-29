import React from 'react';
import './styles/Avatar.less'

const Avatar = (props) => {

  const { src, size } = props;

  return (
    <div className="avatar-root" style={{width: size+'px'}}>
      <div className="img-box">
        <img src={src} alt="" />
      </div>
    </div>
  );
}

export default Avatar