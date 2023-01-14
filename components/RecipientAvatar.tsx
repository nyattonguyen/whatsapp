import Avatar from "@mui/material/Avatar"
import { useRecipient } from "../hooks/useRecipient";
import styled from "@emotion/styled"
type Props = ReturnType<typeof useRecipient>

const StyledAvatar = styled(Avatar)`
    margin: 5px 15px 5px;
`

function RecipientAvatar({recipient, recipientEmail}: Props) {
  return recipient?.photoUrl ? <StyledAvatar src={recipient.photoUrl}/> :<StyledAvatar>
    {recipientEmail && recipientEmail[0].toUpperCase()}
  </StyledAvatar>
}

export default RecipientAvatar