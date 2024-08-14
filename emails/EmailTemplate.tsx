import {Html,Head,Font,Preview,Heading,Row,Section,Text,Button} from 
'@react-email/components'

interface EmailTemplateProps {
    username: string;
    verifyCode: string;
}

export default function EmailTemplate({username,verifyCode}: EmailTemplateProps){
    return(
        <Html lang='en'> 
            <Head>
                <Font 
                fontFamily ='Open Sans'
                fallbackFontFamily="Verdana"
                 />
            </Head>
            <Preview>
                Here&aspo;s your verification code: {verifyCode}
            </Preview>
                <Section>
                    <Heading>Welcome, {username}!</Heading>
                    <Text>
                        Thank you for signing up for our newsletter. Please use the following one-time password (OTP) to confirm your email address.
                    </Text>
                    <Row>
                        <Text>OTP: {verifyCode}</Text>
                    </Row>
                    <Row>
                        <Button href='https://example.com/confirm-email'>Confirm Email</Button>
                    </Row>
                </Section>
        </Html>
    )
}
