
import styled from "@emotion/styled"
import { Avatar, Tooltip, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogContentText, DialogActions, Button } from "@mui/material"
import ChatIcon from "@mui/icons-material/Chat"
import MoreVerticalIcon from "@mui/icons-material/MoreVert"
import LogoutIcon from "@mui/icons-material/Logout"
import SearchIcon from "@mui/icons-material/Search"
import { auth, db } from "../config/firebase"
import { signOut } from "firebase/auth"
import { useAuthState } from "react-firebase-hooks/auth"
import { useState } from "react"
import * as EmailValidator from 'email-validator'
import { addDoc, collection, query, where } from "firebase/firestore"
import { useCollection } from 'react-firebase-hooks/firestore'
import { Conversation } from '../types'
import ConversationSelect from "./ConversationSelect"

const StyledContainer = styled.div`
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;
    border-right: 1px solid whitesmoke;
    background-color: #fff;
`

const StyledHeader =  styled.div`
    display:flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height:80px;
    border-bottom: 1px solid #ddd;
    position: sticky;
    top:0;
    background-color: white;
    z-index: 1;

`

const StyledSearch = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
    border-radius: 2px;
`
const StyledSearchInput = styled.input`
    outline: none;
    border: none;
    flex: 1;
`

const StyledSilebarButton = styled.button`
    width: 100%;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    color: #3070d5;
    font-weight: bold;
    height: 40px;
    background-color: white;
    cursor: pointer;
    
    :hover {
        background-color:#3467ba;
        color: white;
        opacity:0.8
    }


`

const StyledUserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity:0.8;
    }

`

const Silebar = () => {
    const [loggedInUser, _loading, _error] = useAuthState(auth);

    const [isOpenNewConversationDialog, setIsOpenNewConversationDialog] = useState(false);

    const [recipientEmail, setRecipientEmail] = useState('');

    const toggleNewConversationDialog = (isOpen: boolean) => {
        setIsOpenNewConversationDialog(isOpen);
        if(!isOpen) setRecipientEmail('');
    }

    const closeNewConversationDialog = () => {toggleNewConversationDialog(false)};

    const isInvitingSelf = recipientEmail === loggedInUser?.email;

    // check if conversation already exists between the current logged in user and recipient
	const queryGetConversationsForCurrentUser = query(
		collection(db, 'conversations'),
		where('users', 'array-contains', loggedInUser?.email)
	)
	const [conversationsSnapshot, __loading, __error] = useCollection(
		queryGetConversationsForCurrentUser
	)

	const isConversationAlreadyExists = (recipientEmail: string) =>
		conversationsSnapshot?.docs.find(conversation =>
			(conversation.data() as Conversation).users.includes(recipientEmail)
		)

    const createConversationDialog = async () => {
		if (!recipientEmail) return

		if (
			EmailValidator.validate(recipientEmail) &&
			!isInvitingSelf && !isConversationAlreadyExists(recipientEmail)
		) {
			// Add conversation user to db "conversations" collection
			// A conversation is between the currently logged in user and the user invited.

			await addDoc(collection(db, 'conversations'), {
				users: [loggedInUser?.email, recipientEmail]
			})
		}

		closeNewConversationDialog()
	}


    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.log("ERR: ", error)
        }
    }
    console.log(loggedInUser?.photoURL)

  return (
    <StyledContainer>
        <StyledHeader>
            <Tooltip title={loggedInUser?.email as string} placement="right">
                <StyledUserAvatar src={loggedInUser?.photoURL || ''} alt='' />
            </Tooltip>
            <div>
                <IconButton>
                    <ChatIcon/>
                </IconButton>
                <IconButton>
                    <MoreVerticalIcon/>
                </IconButton>
                <IconButton onClick={logout} >
                    <LogoutIcon/>
                </IconButton>
            </div>
        </StyledHeader>
        <StyledSearch>
            <SearchIcon />
            <StyledSearchInput placeholder="Search in conversations" />
        </StyledSearch>
        <StyledSilebarButton onClick={()=> toggleNewConversationDialog(true)} >
            START A NEW CONVERSATION
        </StyledSilebarButton>
        {conversationsSnapshot?.docs.map(conversation => (
				<ConversationSelect
					key={conversation.id}
					id={conversation.id}
					conversationUsers={(conversation.data() as Conversation).users}
				/>
			))}
        <Dialog open={isOpenNewConversationDialog} onClose={closeNewConversationDialog}>
        <DialogTitle>New Conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a Google email address for the user you wish to chat with
          </DialogContentText>
          <TextField
            autoFocus
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={recipientEmail}
            onChange={(e)=> setRecipientEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNewConversationDialog}>Cancel</Button>
          <Button disabled={!recipientEmail} onClick={createConversationDialog}>Create</Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  )
}

export default Silebar