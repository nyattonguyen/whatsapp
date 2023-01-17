import Head from "next/head"
import Silebar from "../../components/Silebar"
import styled from "@emotion/styled"
import { async } from "@firebase/util"
import { GetServerSideProps } from "next"
import { doc, getDoc } from "firebase/firestore"
import { Conversation } from "../../types"
import { auth, db } from "../../config/firebase"
import { getRecipientEmail } from "../../utils/getRecipientEmail"
import { useAuthState } from "react-firebase-hooks/auth"

const StyledContainer = styled.div`
    display: flex;
`

interface Props {
  conversation: Conversation
}
const Conversation = ({conversation}: Props) => {
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  return (
    <StyledContainer>
        <Head>
            <title>Conversation with {getRecipientEmail(conversation.users,loggedInUser)}</title>
        </Head>
        <Silebar />
        <h1>Message</h1>
    </StyledContainer>
  )
}

export default Conversation

export const getServerSideProps: GetServerSideProps <Props, {id: string}> = async context => {
  const conversationId = context.params?.id

  const conversationRef = doc(db, 'conversations', conversationId as string )
  const conversationSnapshot = await getDoc(conversationRef);

  return {
    props: {
      conversation: conversationSnapshot.data() as Conversation
    }
  }
}