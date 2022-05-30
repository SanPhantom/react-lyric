import React, { useEffect, useState, useRef } from 'react';
import './styles/SearchInput.less'

const VerifyInput = (props) => {

  const { value, onSearch, onChange } = props;

  const [ verifyLoading, setVerifyLoading ] = useState(false);
  const [second, setSecond] = useState(10);
  const timer = useRef(null);

  const getVerifyCode = () => {
    setVerifyLoading(true);
  }

  useEffect(() => {
    if (verifyLoading) {
      timer.current = window.setInterval(() => {
        setSecond(second => second - 1);
      }, 1000);
    }
  }, [verifyLoading])

  useEffect(() => {
    if (second === 0 && timer.current) {
      clearInterval(timer.current);
      setVerifyLoading(false);
      setSecond(10)
      timer.current = null;
    }
  }, [second])

  return (
    <div className="verify-input-root">
      <input type="text" className="verify-input-box" value={value} onChange={onChange} placeholder="Verification Code" maxLength="6" />
      <button className="verify-input-btn" disabled={verifyLoading} onClick={getVerifyCode}>{ !verifyLoading ? "获取验证码" : `重新获取(${second}s)`}</button>
    </div>
  );
}

export default VerifyInput