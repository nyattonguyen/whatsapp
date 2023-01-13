import styled from "@emotion/styled";
import Image from "next/image";
import WhatsAppLogo from "../assets/logo.png";
import {CircularProgress} from "@mui/material"

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
const StyledImageWrapper = styled.div`
  margin-bottom: 50px;
`;

const Loading = () => {
    
  return (
    <StyledContainer>
      <StyledImageWrapper>
        <Image
          src={WhatsAppLogo}
          alt="whatsapp logo"
          style={{ width: 200, height: 200 }}
        />
      </StyledImageWrapper>
        <CircularProgress />
    </StyledContainer>
  );
};

export default Loading;
