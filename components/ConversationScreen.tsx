import { useRecipient } from "../hooks/useRecipient";
import { Conversation, IMessage } from "../types"
import styled from "@emotion/styled";
import RecipientAvatar from "./RecipientAvatar";
import { convertFirestoreTimestampToString, generateQueryMessages, transformMessage } from "../utils/generateQueryMessages";
import IconButton from "@mui/material/IconButton";
import AttachFileIcon from "@mui/icons-material/AttachFile"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { useCollection } from "react-firebase-hooks/firestore";

const StyledRecipientHeader = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top:0;
    display: flex;
    align-items: center;
    padding: 11px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`
const StyledHeaderInfo = styled.div`
    margin-left: 15px;
    flex-grow: 1;
    >h3 {
        margin-top: 0;
        margin-bottom: 3px;
        
    }

    >span {
        font-size: 14px;
        color: gray;
    }
    
    
`

const StyledH3 = styled.h3`
    word-break: break-all;
`
const StyledHeaderIcons = styled.div`
    display: flex;
`

const StyledMessageContainer = styled.div`
    padding:30px;
    background-color: #e5ded8;
    min-height: 90vh;
`
const ConversationScreen = ({conversation, messages}: {conversation:Conversation; messages:IMessage[] }) => {
  
  const [loggedInUser, _loading, _error] = useAuthState(auth);
    
  const conversationUsers = conversation.users;

  const {recipientEmail, recipient} = useRecipient(conversationUsers);

    const router = useRouter();

    const conversationId = router.query.id; // localhost:300/conversations/:id

    const queryGetMessages = generateQueryMessages(conversationId as string) 

    const [messagesSnapshot, messagesLoading, __error] = useCollection(queryGetMessages);


  const showMessages = () => {
    if(messagesLoading) {
        return messages.map((message, index) => <p key={index}>{JSON.stringify(message)})</p>)
    }
    // if frontend has finished loading messages, so now we have messagesSanpshot 
    if(messagesSnapshot) {
        return messagesSnapshot.docs.map((message, index) =><p key={index}>{JSON.stringify(transformMessage(message))}</p>)
    }

    return null;
  }

    return (
        <><StyledRecipientHeader>
            <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail} />
            <StyledHeaderInfo>
                <StyledH3>
                    {recipientEmail}
                </StyledH3>
                {recipient && <span>Last active: {convertFirestoreTimestampToString(recipient.lastSeen)}</span>}
            </StyledHeaderInfo>
            <StyledHeaderIcons>
                <IconButton>
                    <AttachFileIcon />
                </IconButton>
                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </StyledHeaderIcons>
        </StyledRecipientHeader>
        <StyledMessageContainer>
            {showMessages()}
        </StyledMessageContainer>

        {/* Enter new message  */}
        </>
  )
}

export default ConversationScreen