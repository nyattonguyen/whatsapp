import Head from "next/head"
import Silebar from "../../components/Silebar"
import styled from "@emotion/styled"
import { async } from "@firebase/util"
import { GetServerSideProps } from "next"
import { doc, getDoc } from "firebase/firestore"

const StyledContainer = styled.div`
    display: flex;
`

const Conversation = () => {
  return (
    <StyledContainer>
        <Head>
            <title>Conversation with Recipient</title>
        </Head>
        <Silebar />
        <h1>Message</h1>
    </StyledContainer>
  )
}

export default Conversation

export const getServerSideProps: GetServerSideProps <any, {id: string}> = async context => {
  const conversationId = context.params?.id

  const conversationRef = doc(db, 'conversations', conversationId as string )
  const conversationSnapshot = await getDoc(conversationRef);
}