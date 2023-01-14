import Head from "next/head"
import Silebar from "../../components/Silebar"
import styled from "@emotion/styled"

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