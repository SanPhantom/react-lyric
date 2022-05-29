import React from 'react';
import './styles/Loading.less';

const Loading = (props) => {

  const { tip = 'loading...', noTip = false } = props;

  return (
    <div className="loading-root">
      <div className="breathing-lamp">
        <div className="breathing-box"></div>
        <div className="breathing-box"></div>
      </div>
      { !noTip && <span className="spin-text">{tip}</span>}
    </div>
  );
}

export default Loading