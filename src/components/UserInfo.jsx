import React, { useState, useEffect } from 'react';
import Avatar from './Avatar';
import Modal from './Modal';
import PasswordInput from './PasswordInput';
import { ArrowSmRightIcon } from '@heroicons/react/solid'
import './styles/user-info.less';
import VerifyInput from './VerifyInput';
import { login, loginStatus } from '../services/user';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserId, updateUserInfo } from '../store/user/userAction';

const UserInfo = () => {

  const { id, userInfo } = useSelector(store => store.user);
  const reduxDispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [loginType, setLoginType] = useState(false);

  const [loginData, setLoginData] = useState({
    phone: '',
    password: '',
    captcha: '',
  })

  const toLogin = () => {
    if (!id) {
      setModalOpen(true);
    }
  }

  const loginUser = (e) => {
    e.stopPropagation();
    login(loginData).then(res => {
      if (res.code === 200) {
        localStorage.setItem('musicCookie', res.cookie);
        const { avatarUrl, nickname, userId  } = res.profile;
        reduxDispatch(updateUserInfo({avatarUrl, nickname, userId}));
        reduxDispatch(updateUserId(userId));
        setModalOpen(false);
      }
    })
  }

  const fetchLoginStatus = () => {
    loginStatus().then(res => {
      if (res.data.code === 200) {
        const { avatarUrl, nickname, userId  } = res.data.profile;
        reduxDispatch(updateUserInfo({avatarUrl, nickname, userId}));
        reduxDispatch(updateUserId(userId));
      }
    })
  }

  useEffect(() => {
    if (!modalOpen) {
      setLoginData({
        phone: '',
        password: '',
        captcha: '',
      })
    }
  }, [modalOpen])

  useEffect(() => {
    setTimeout(() => {
      fetchLoginStatus();
    }, 0)
  }, [])

  return (
    <div className="user-info-root" >
      <div className="user-info" onClick={toLogin}>
        <Avatar src={id && userInfo.avatarUrl} size={48} />
        <span className="login-text">{id ? userInfo.nickname : "????????????"}</span>
      </div>


      <Modal open={modalOpen}
        title="Login"
        onClose={(v) => { setModalOpen(false) }}>
        <div className="login-root">
          <input type="text"
            className="login-phone login-input"
            placeholder="Phone"
            value={loginData.phone}
            onChange={(e) => {
              setLoginData({
                ...loginData,
                phone: e.target.value
              })
            }} />
          {
            !loginType ?
              <PasswordInput value={loginData.password}
                onChange={(e) => {
                  setLoginData({
                    ...loginData,
                    password: e.target.value
                  })
                }} />
              : <VerifyInput />
          }
          <div className="login-btn-group">
            <p className="login-type" onClick={() => setLoginType(!loginType)}>{!loginType ? '???????????????' : '????????????'}</p>
            <button className="login-btn" onClick={loginUser}>
              Entry To
              <i><ArrowSmRightIcon /></i>
            </button>
          </div>

        </div>
      </Modal>
    </div>
  );
}

export default UserInfo