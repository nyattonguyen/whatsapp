import styled from "@emotion/styled"
import { Button } from "@mui/material"
import Head from "next/head"
import Image from "next/image"
import WhatsAppLogo from "../assets/logo.png"
import {useSignInWithGoogle} from 'react-firebase-hooks/auth'
import { auth } from "../config/firebase"


const StyledContainer = styled.div`
    height: 100vh;
    display: grid;
    place-items: center;
    background-color: whitesmoke;
`
const StyledLoginContainer = styled.div`

`

const StyledImageWrapper = styled.div`
    margin-bottom: 50px;

`
const login = () => {
    const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth);
    const signIn = () => {
        signInWithGoogle();
    }
    return (
    <StyledContainer>
        <Head>
            <title>Login</title>
        </Head>
        <StyledLoginContainer>
            <StyledImageWrapper>
                <Image src={WhatsAppLogo} alt="whatsapp logo" style={{width:200, height:200}} /> 
            </StyledImageWrapper>
            <Button variant="outlined" onClick={signIn}>
                Sign in with Google
            </Button>
        </StyledLoginContainer>
    </StyledContainer>
    )
}

export default login