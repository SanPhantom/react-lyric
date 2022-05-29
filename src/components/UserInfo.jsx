import React, { useState, useEffect } from 'react';
import Avatar from './Avatar';
import Modal from './Modal';
import './styles/user-info.less';

const UserInfo = () => {

  const [modalOpen, setModalOpen] = useState(false);

  const toLogin = () => {
    console.log("123")
    setModalOpen(true);
  }

  useEffect(() => {
    console.log('modal open: ',modalOpen)
  }, [modalOpen])

  return (
    <div className="user-info-root" onClick={toLogin}>
      <Avatar src={""} size={42} />
      <span>点击登录</span>

      <Modal open={modalOpen}
        onClose={(v) => {setModalOpen(false)}}>
        <div className="login-form">
          <input type="text" />
        </div>
      </Modal>
    </div>
  );
}

export default UserInfo