import React, { useCallback } from 'react'
import styled from 'styled-components'

import { AddIcon, RemoveIcon } from './icons'
import { IconButton } from './primitives'
import Input from './primitives/Input'

interface TokenInputProps {
  values: string[]
  symbol: string
  maxLines?: number
  onChange: (values: string[]) => void
}

const TokenInput: React.FC<TokenInputProps> = ({
  symbol,
  values,
  maxLines = 6,
  onChange,
}) => {
  const handleAddRow = useCallback(() => {
    onChange([...values, ''])
  }, [values, onChange])

  const handleRemoveRow = useCallback(
    (index: number) => {
      let newValues = values.slice()
      newValues.splice(index, 1)
      onChange(newValues)
    },
    [values, onChange]
  )

  const handleChange = useCallback(
    (index: number, event: React.FormEvent<HTMLInputElement>) => {
      onChange(
        values.map((row, i) => (i === index ? event.currentTarget.value : row))
      )
    },
    [values, onChange]
  )

  return (
    <StyledTokenInput>
      <InputLabel>{symbol}</InputLabel>
      {values.map((row, i) => (
        <Input
          key={i}
          style={i > 0 ? { marginTop: 8 } : {}}
          endAdornment={
            <StyledTokenAdornmentWrapper>
              {i < maxLines - 1 && (
                <div>
                  {i === values.length - 1 ? (
                    <IconButton onClick={handleAddRow}>
                      <AddIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleRemoveRow(i)}>
                      <RemoveIcon />
                    </IconButton>
                  )}
                </div>
              )}
            </StyledTokenAdornmentWrapper>
          }
          placeholder="0xYourSudoSwapPairAddress"
          value={row}
          onChange={(e) => handleChange(i, e)}
        />
      ))}
    </StyledTokenInput>
  )
}

const StyledTokenInput = styled.div``

const StyledTokenAdornmentWrapper = styled.div`
  align-items: center;
  display: flex;
`

const InputLabel = styled.div`
  align-items: center;
  color: ${(props) => props.theme.color.black};
  display: flex;
  font-size: 14px;
  font-weight: 500;
  height: 44px;
  justify-content: flex-start;
`

const StyledTokenSymbol = styled.span`
  color: ${(props) => props.theme.color.grey[600]};
  font-weight: 700;
`

export default TokenInput
