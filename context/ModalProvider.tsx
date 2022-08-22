import React, { createContext, useCallback, useContext, useState } from 'react'
import styled from 'styled-components'

const StyledModalWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
`

const StyledModalBackdrop = styled.div`
  background-color: ${(props) => props.theme.color.grey[600]}aa;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

interface IModalContext {
  content?: React.ReactNode
  isOpen?: boolean
  onPresent: (content: React.ReactNode, key?: string) => void
  onDismiss: () => void
}

export const ModalContext = createContext<IModalContext>({
  onPresent: () => {},
  onDismiss: () => {},
})

export const ModalProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<React.ReactNode>()
  const [modalKey, setModalKey] = useState<string>()

  const handlePresent = useCallback(
    (modalContent: React.ReactNode, key?: string) => {
      setModalKey(key)
      setContent(modalContent)
      setIsOpen(true)
    },
    [setContent, setIsOpen, setModalKey]
  )

  const handleDismiss = useCallback(() => {
    if (!modalKey) return

    setContent(undefined)
    setIsOpen(false)
  }, [setContent, setIsOpen, modalKey])

  return (
    <ModalContext.Provider
      value={{
        content,
        isOpen,
        onPresent: handlePresent,
        onDismiss: handleDismiss,
      }}
    >
      {children}
      {isOpen && (
        <StyledModalWrapper>
          <StyledModalBackdrop onClick={handleDismiss} />
          {React.isValidElement(content) &&
            React.cloneElement(content, {
              onDismiss: handleDismiss,
            })}
        </StyledModalWrapper>
      )}
    </ModalContext.Provider>
  )
}

export default ModalProvider

export const ModalConsumer = ModalContext.Consumer
export const useModal = () => useContext(ModalContext)
