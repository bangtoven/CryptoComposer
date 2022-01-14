import { Button, Modal } from 'react-bootstrap';
import React, { createContext, useContext, useState } from 'react';
import theme from '../styles/theme';
import { useWeb3React } from '@web3-react/core';
import { etherscanUrl } from './utils/etherscanUrl';

const AlertContext = createContext({ alert: {} });
export const useAlert = () => {
  const { alert } = useContext(AlertContext);
  return alert;
};

export const AlertContextProvider = ({ children }) => {
  const { chainId } = useWeb3React();

  const [show, setShow] = useState(false);
  const [Title, setTitle] = useState('');
  const [Body, setBody] = useState('');
  const [ButtonTitle, setButtonTitle] = useState(null);
  const [ButtonAction, setButtonAction] = useState(null);

  const setAlertStates = ({ title, body, button, action }) => {
    setTitle(title ?? '');
    setBody(body ?? '');
    setButtonTitle(button);
    setButtonAction(() => action);
    setShow(true);
  };

  const contextValue = {
    alert: {
      show: (props) => setAlertStates(props),
      showTx: ({ title, body, txHash }) => {
        setAlertStates({
          title,
          body,
          button: 'Etherscan',
          action: () => {
            const url = etherscanUrl(chainId, txHash);
            if (url) {
              window.open(url);
            } else {
              alert('Unsupported chain');
            }
          },
        });
      },
    },
  };

  const handleClose = () => {
    setTitle('');
    setBody('');
    setButtonTitle(null);
    setButtonAction(null);
    setShow(false);
  };

  const ActionableButton = () => {
    if (ButtonTitle) {
      return (
        <Button
          variant="primary"
          onClick={() => {
            if (ButtonAction != null) {
              ButtonAction();
            }
            handleClose();
          }}
        >
          {ButtonTitle}
        </Button>
      );
    } else {
      return <></>;
    }
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton style={{ color: theme.darkBlue }}>
          <Modal.Title>{Title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: theme.darkBlue }}>{Body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <ActionableButton />
        </Modal.Footer>
      </Modal>
    </AlertContext.Provider>
  );
};

export const Alert = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onHide}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
