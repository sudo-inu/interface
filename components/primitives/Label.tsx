import React from 'react'
import styled from 'styled-components'

interface LabelProps {
  text?: string
  align?: string
}

const Label: React.FC<LabelProps> = ({ text, align }) => (
  <StyledLabel align={align}>{text}</StyledLabel>
)

const StyledLabel = styled.div<LabelProps>`
  color: ${(props) => props.theme.color.grey[400]};
  text-align: ${(props) => (props.align ? props.align : 'left')};
`

export default Label
