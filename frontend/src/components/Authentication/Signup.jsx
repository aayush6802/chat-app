import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import CloseIcon from "@mui/icons-material/Close";
import { useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveImageToCloudinary } from "../../config/saveImageToCloudinary.js";
import addImageIcon from "../../assets/addImageIcon.png";

import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { API_URL, ChatState } from "../../context/ChatProvider.jsx";

const Signup = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [triggerReload, setTriggerReload] = useState(false);
  const [signupformData, setSignupFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: "",
  });
  const { user, setUser } = ChatState();
  const toast = useToast();

  const passwordChecker = () => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(signupformData.password);
  };
  const emailValidator = () => {
    const regex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    return regex.test(signupformData.email);
  };

  const postDetails = async (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select a profile picture",
        description: "We've created your account for you.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpg"
    ) {
      try {
        const picUrl = await saveImageToCloudinary(pics);
        setSignupFormData((prev) => ({ ...prev, pic: picUrl }));
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    } else {
      toast({
        title: "Invalid Image Format",
        description: "Only JPEG and PNG files are allowed",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const clearUploadedPic = () => {
    setSignupFormData((prev) => {
      return { ...prev, pic: "" };
    });
  };

  const handleChange = (e) => {
    setSignupFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (
      !signupformData.name ||
      !signupformData.email ||
      !signupformData.password ||
      !signupformData.confirmPassword
    ) {
      toast({
        title: "Please fill all fields",
        description: "All fields are required",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom-right",
      });
      setLoading(false);
      return;
    }
    if (signupformData.password !== signupformData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom-right",
      });
      setLoading(false);
      return;
    }
    if (!passwordChecker(signupformData.password)) {
      toast({
        title:
          "Password must contain \natleast 6 characters, \n min 1 uppercase, \n min 1 lowercase, \n min 1 number and \n min 1 special character",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom-right",
      });
      setLoading(false);
      return;
    }
    if (!emailValidator()) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      // console.log(signupformData);
      const res = await axios.post(
        API_URL + "/api/user/register",
        {
          name: signupformData.name,
          email: signupformData.email,
          password: signupformData.password,
          pic: signupformData.pic,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      toast({
        title: "Resgistered Succesfully!!",
        status: "sucess",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });

      navigate("/verify-email");
      // console.log(res.data);
      setLoading(false);
    } catch (err) {
      // console.log(err);
      toast({
        title: "Error",
        description: err.response.data.message,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    if (user?.isVerified) {
      navigate("/chats");
    } else {
      navigate("/verify-email");
    }
  }, [user]);

  return (
    <VStack>
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Name"
          onChange={handleChange}
          value={signupformData.name}
          name="name"
          focusBorderColor="pink.400"
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Email"
          onChange={handleChange}
          value={signupformData.email}
          name="email"
          focusBorderColor="pink.400"
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={handleChange}
            value={signupformData.password}
            name="password"
            focusBorderColor="pink.400"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {!show ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={handleChange}
            value={signupformData.confirmPassword}
            name="confirmPassword"
            focusBorderColor="pink.400"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {!show ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>
          Add Profile picture
          {signupformData.pic ? (
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <p>{"Uploaded"}</p>
              <IconButton
                colorScheme="red"
                aria-label="Search database"
                size={"20px"}
                icon={<CloseIcon />}
                onClick={clearUploadedPic}
              />
            </div>
          ) : (
            <img src={addImageIcon} alt="" />
          )}
        </FormLabel>

        <Input
          // visibility={"hidden"}
          display={"none"}
          type="file"
          accept="image/*"
          placeholder="Choose Image"
          border={"none"}
          outline={"none"}
          onChange={(e) => postDetails(e.target.files[0])}
          disabled={signupformData.pic ? true : false}
        />
        {/* {signupformData.pic ? (
          <IconButton
            colorScheme="blue"
            aria-label="Search database"
            icon={<SearchIcon />}
          />
        ) : null} */}
      </FormControl>
      <Button
        className="hover-effect"
        variant="solid"
        w="75%"
        bg
        bgColor={"pink.300"}
        color={"white"}
        mt={"10px"}
        _hover={{ backgroundColor: "pink.200", color: "gray.500" }}
        onClick={handleSubmit}
        borderRadius={"20px"}
        isLoading={loading}
      >
        Signup
      </Button>
    </VStack>
  );
};

export default Signup;
