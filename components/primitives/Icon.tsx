import React from 'react'
import styled from 'styled-components'

export interface IconProps {
  disabled?: boolean
  color?: string
  children?: React.ReactNode
  size?: number
}

const Icon: React.FC<IconProps> = ({
  children,
  disabled,
  color,
  size = 24,
}) => (
  <StyledIcon>
    {React.isValidElement(children) &&
      React.cloneElement(children, {
        disabled,
        color,
        size,
      })}
  </StyledIcon>
)

const StyledIcon = styled.div``

export default Icon
