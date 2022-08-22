import React, { createContext, useContext, useEffect, useState } from 'react'
import Notify from 'bnc-notify'
import { API as NotifyAPI } from 'bnc-notify'

interface INotifyContext {
  notify?: NotifyAPI
}

export const NotifyContext = createContext<INotifyContext>({})

interface NotifyProps {
  children: React.ReactNode
}

export const NotifyProvider: React.FC<NotifyProps> = ({ children }) => {
  const [notify, setNotify] = useState<undefined | NotifyAPI>()

  useEffect(() => {
    if (!notify) {
      const _notify = Notify({
        dappId: '8f45ed6e-93e2-4c7f-93ed-1543ed162f43',
        networkId: 1,
        desktopPosition: 'topRight',
      })

      setNotify(_notify)
    }
  }, [notify])

  return (
    <NotifyContext.Provider value={{ notify }}>
      {children}
    </NotifyContext.Provider>
  )
}
export default NotifyProvider

export const NotifyConsumer = NotifyContext.Consumer
export const useNotify = () => useContext(NotifyContext)
