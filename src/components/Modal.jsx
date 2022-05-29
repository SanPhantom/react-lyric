import React from 'react';
import { XIcon } from '@heroicons/react/outline'
import './styles/modal.less';

const Modal = (props) => {

  const { open, title, children, onClose = (v) => {} } = props;

  const closeModal = (e) => {
    e.stopPropagation();
    if (onClose) {
      onClose(false);
    }
  }

  return (
    <div className="modal-root" style={{display: open ? 'block' : 'none'}}>
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title">{title || "Modal Title"}</div>
          <div className="modal-close" onClick={closeModal}>
            <XIcon />
          </div>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-active"></div>
      </div>
    </div>
  );
}

export default Modal