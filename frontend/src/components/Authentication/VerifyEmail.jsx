import React, { useEffect } from "react";
import { API_URL } from "../../context/ChatProvider";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button, Container, Text, useToast } from "@chakra-ui/react";
import Lottie from "lottie-react";
import emailAnim from "../../assets/email-animation.json";

const VerifyEmail = () => {
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const emailToken = searchParams.get("emailToken");
  const toast = useToast();
  useEffect(() => {
    if (emailToken) {
      const verifyEmail = async () => {
        try {
          const res = await axios.post(`${API_URL}/api/user/verify-email`, {
            emailToken,
          });
          if (res.status === 200) {
            toast({
              title: "Email Verified",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            navigate("/");
            return;
          }
        } catch (error) {
          // console.log(error);
          toast({
            title: "Email Verification Failed",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
      };
      verifyEmail();
    }
  }, []);
  return (
    <Container width={"100vw"} centerContent>
      <Lottie
        animationData={emailAnim}
        loop={true}
        style={{
          width: "20%",
        }}
      />
      <Text fontSize={"xx-large"} fontWeight={"700"} color={"blue.700"}>
        Verify Email
      </Text>
      <Text fontSize={"larger"} mt={"20px"} color={"blue.900"}>
        Please check your email or spam folder for the verification link.
      </Text>
      <Button
        onClick={() => {
          navigate("/");
        }}
      >
        <Text color={"blue.700"}>Back to Login</Text>
      </Button>
    </Container>
  );
};

export default VerifyEmail;
