import { useCallback } from 'react'

import { useModal as _useModal } from 'context'

export const useModal = (modal: React.ReactNode, key?: string) => {
  const { onDismiss, onPresent } = _useModal()

  const handlePresent = useCallback(() => {
    onPresent(modal, key)
  }, [key, modal, onPresent])

  return [handlePresent, onDismiss]
}

export default useModal
