import { FC } from 'react'
import styled, { keyframes } from 'styled-components'
import { grey } from 'theme/colors'

const Avatar = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  height: 80px;
  width: 80px;
  border-radius: 99999px;
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
  border: 2px solid #e2d6cf;
  background-color: #f0e9e7;
  position: relative;
  z-index: 2;
  box-shadow: inset 4px 4px 8px ${grey[300]}, inset -6px -6px 12px ${grey[100]};
`

const RainbowLight = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

const AvatarAccentA = styled.div`
  background: linear-gradient(
    45deg,
    rgba(63, 218, 216, 1) 0%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 99999px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: 1;
`
const AvatarAccentB = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 99999px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: 1;
`

const AvatarWrapper = styled.div`
  display: flex;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  height: 80px;
  width: 80px;
  border-radius: 99999px;
  margin-bottom: 20px;
`

const EmojiBack = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
`
const EmojiFront = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  transform: scale(-1, 1);
`

const DoubleEmoji: FC<{ emoji: string }> = ({ emoji }) => {
  const [emoji1, emoji2] = Array.from(emoji)
  return (
    <>
      <EmojiBack>{emoji1}</EmojiBack>
      <EmojiFront>{emoji2}</EmojiFront>
    </>
  )
}

type Props = {
  emoji: string
  token: string
  exponential?: boolean
  showHighlight?: boolean
}

const PoolIcon: FC<Props> = ({
  emoji,
  token,
  showHighlight = false,
  exponential = false,
}) => {
  const isDoubleEmoji = emoji.length === 2
  const hasHighlight = [
    'XMON/SNACK Uni-v2 LP',
    'Sudo INU Buy Wall LP',
    'Sudo INU High-Fee Trade Pool LP',
  ].includes(token)

  return (
    <AvatarWrapper>
      {showHighlight &&
        hasHighlight &&
        (exponential ? <AvatarAccentB /> : <AvatarAccentA />)}
      <Avatar>{!isDoubleEmoji ? <DoubleEmoji emoji={emoji} /> : emoji}</Avatar>
    </AvatarWrapper>
  )
}

export default PoolIcon
