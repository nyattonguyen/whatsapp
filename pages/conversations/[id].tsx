import Head from "next/head";
import Silebar from "../../components/Silebar";
import styled from "@emotion/styled";
import { async } from "@firebase/util";
import { GetServerSideProps } from "next";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { Conversation, IMessage } from "../../types";
import { auth, db } from "../../config/firebase";
import { getRecipientEmail } from "../../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  generateQueryMessages,
  transformMessage,
} from "../../utils/generateQueryMessages";
import ConversationScreen from "../../components/ConversationScreen";

const StyledContainer = styled.div`
  display: flex;
`;

const StyledConversationContainer = styled.div`
  flex-grow: 1;
  overflow: scroll;
  height: 100vh;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;  
  scrollbar-width: none;  
`

interface Props {
  conversation: Conversation;
  messages: IMessage[];
}
const Conversation = ({ conversation, messages }: Props) => {
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  return (
    <StyledContainer>
      <Head>
        <title>
          Conversation with{" "}
          {getRecipientEmail(conversation.users, loggedInUser)}
        </title>
      </Head>
      <Silebar />
      
      <StyledConversationContainer>
        <ConversationScreen conversation={conversation} messages={messages} />
      </StyledConversationContainer>
    </StyledContainer>
  );
};

export default Conversation;

export const getServerSideProps: GetServerSideProps<
  Props,
  { id: string }
> = async (context) => {
  const conversationId = context.params?.id;

  //get conversation, to know who we are chatting with
  const conversationRef = doc(db, "conversations", conversationId as string);
  const conversationSnapshot = await getDoc(conversationRef);

  // get all messages between logged in user and recipient in this conversation
  const queryMessages = generateQueryMessages(conversationId);

  const messagesSnapshot = await getDocs(queryMessages);

  const messages = messagesSnapshot.docs.map((messageDoc) =>
    transformMessage(messageDoc) 
  );
  console.log("aaaaaa",messages)
  return {
    props: {
      conversation: conversationSnapshot.data() as Conversation,
      messages,
    },
  };
};
