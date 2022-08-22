import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import Link from 'next/link'

interface ButtonProps {
  children?: React.ReactNode
  disabled?: boolean
  href?: string
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  text?: string
  variant?: 'default' | 'secondary' | 'tertiary'
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  href,
  onClick,
  size,
  text,
  variant,
}) => {
  const { color, spacing } = useContext(ThemeContext)

  let buttonColor: string
  switch (variant) {
    case 'secondary':
      buttonColor = color.grey[500]
      break
    case 'default':
    default:
      buttonColor = color.black
  }

  let boxShadow: string
  let buttonSize: number
  let buttonPadding: number
  let fontSize: number
  switch (size) {
    case 'sm':
      boxShadow = `4px 4px 8px ${color.grey[300]},
        -8px -8px 16px ${color.grey[100]}FF;`
      buttonPadding = spacing[3]
      buttonSize = 36
      fontSize = 14
      break
    case 'lg':
      boxShadow = `6px 6px 12px ${color.grey[300]},
        -12px -12px 24px ${color.grey[100]}ff;`
      buttonPadding = spacing[4]
      buttonSize = 72
      fontSize = 16
      break
    case 'md':
    default:
      boxShadow = `6px 6px 12px ${color.grey[300]},
        -12px -12px 24px -2px ${color.grey[100]}ff;`
      buttonPadding = spacing[4]
      buttonSize = 56
      fontSize = 16
  }

  const WrappingLink = href ? Link : React.Fragment

  return (
    <WrappingLink {...(href ? { passHref: true, href } : {})}>
      <a {...(!disabled ? { onClick } : { style: { cursor: 'default' } })}>
        <StyledButton
          boxShadow={boxShadow}
          color={buttonColor}
          disabled={disabled}
          fontSize={fontSize}
          padding={buttonPadding}
          size={buttonSize}
        >
          {children}
          {text}
        </StyledButton>
      </a>
    </WrappingLink>
  )
}

interface StyledButtonProps {
  boxShadow: string
  color: string
  disabled?: boolean
  fontSize: number
  padding: number
  size: number
}

const StyledButton = styled.button<StyledButtonProps>`
  align-items: center;
  background-color: ${(props) => props.theme.color.primary.main};
  border: 0;
  border-radius: 12px;
  box-shadow: ${(props) => props.boxShadow};
  color: ${(props) => (!props.disabled ? props.color : `${props.color}55`)};
  cursor: ${(props) => (!props.disabled ? 'pointer' : `default`)};
  display: flex;
  font-size: ${(props) => props.fontSize}px;
  font-weight: 700;
  height: ${(props) => props.size}px;
  justify-content: center;
  outline: none;
  padding-left: ${(props) => props.padding}px;
  padding-right: ${(props) => props.padding}px;
  pointer-events: ${(props) => (!props.disabled ? undefined : 'none')};
  width: 100%;
  &:hover {
    background-color: ${(props) => props.theme.color.grey[100]};
  }
`

export default Button
