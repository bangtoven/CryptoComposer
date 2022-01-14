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
      showError: (error) => {
        console.log('error: ', error);
        window.error = error;

        var errorMessage = '';
        if (error.data && error.data.message) {
          errorMessage = error.data.message;
          const index = errorMessage.indexOf('revert');
          if (index) {
            errorMessage = errorMessage.slice(index + 7);
          }
        } else if (error.message) {
          errorMessage = error.message;
        } else {
          errorMessage = error.toString();
        }

        const duplicateHashErr = 'Someone else has already registered the same notes.';
        if (errorMessage.includes(duplicateHashErr)) {
          errorMessage = duplicateHashErr;
        }

        setAlertStates({
          title: 'Error!',
          body: errorMessage,
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
          style={{ color: 'white', backgroundColor: theme.darkBlue }}
          variant="primary"
          onClick={() => {
            if (ButtonAction != null) {
              ButtonAction();
            }
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
          <Button
            style={{ borderColor: theme.lightBlue, color: theme.darkBlue, backgroundColor: 'transparent' }}
            onClick={handleClose}
          >
            Close
          </Button>
          <ActionableButton />
        </Modal.Footer>
      </Modal>
    </AlertContext.Provider>
  );
};
