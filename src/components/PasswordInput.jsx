import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid'

const PasswordInput = (props) => {

  const { value, onChange } = props;

  const [show, setShow] = useState(false)

  return (
    <div className="password-input-root">
      <input type={show ? 'text' : 'password'} className="password-input" placeholder="Password" value={value} onChange={onChange} />
      <div className="password-input-icon" onClick={() => setShow(!show)}>
        { show ? <EyeIcon /> : <EyeOffIcon />}
      </div>
    </div>
  );
}

export default PasswordInput