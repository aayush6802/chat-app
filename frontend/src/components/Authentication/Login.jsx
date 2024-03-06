import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { API_URL, ChatState } from "../../context/ChatProvider";

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginformData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const { user, setUser } = ChatState();
  const handleSubmit = async () => {
    setLoading(true);
    if (!loginformData.email || !loginformData.password) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
      return;
    } else {
      try {
        const res = await axios.post(
          API_URL + "/api/user/login",
          { ...loginformData },
          {
            headers: {
              "Content-type": "application/json",
            },
          }
        );

        toast({
          title: "Logged In Successfully!!",
          status: "sucess",
          duration: 2500,
          isClosable: true,
          position: "bottom",
        });
        setUser(localStorage.setItem("userInfo", JSON.stringify(res.data)));
        setLoading(false);
        window.location.reload();
        // console.log(res.data);
      } catch (err) {
        // console.log(err.response.data.message);
        if (err)
          toast({
            title: "Error",
            description: err.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/chats");
    }
  }, [user]);

  return (
    <VStack>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Email"
          name="email"
          value={loginformData.email}
          onChange={(e) =>
            setLoginFormData((prev) => {
              return { ...prev, email: e.target.value };
            })
          }
          focusBorderColor="pink.400"
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            name="password"
            value={loginformData.password}
            onChange={(e) =>
              setLoginFormData((prev) => {
                return { ...prev, password: e.target.value };
              })
            }
            focusBorderColor="pink.400"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {!show ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Box
        w="100%"
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-around"}
      >
        <Button
          className="hover-effect"
          variant="solid"
          w="75%"
          bg
          // bgColor={"#c98690"}
          bgColor={"pink.300"}
          color={"white"}
          mt={"10px"}
          onClick={handleSubmit}
          _hover={{ backgroundColor: "pink.200", color: "gray.500" }}
          borderRadius={"20px"}
          isLoading={loading}
        >
          Login
        </Button>
        {/* <Tooltip
          hasArrow
          label="Get Guest User Credentials"
          borderRadius={"20px"}
          bgColor={"gray"}
        >
          <IconButton
            mt={"10px"}
            borderRadius={"50%"}
            colorScheme="red"
            icon={<PersonIcon />}
            onClick={() => {
              setLoginFormData({
                email: "guestuser@gmail.com",
                password: "guestuser",
              });
            }}
          />
        </Tooltip> */}
      </Box>
    </VStack>
  );
};

export default Login;
