import { Box, Spinner } from "@chakra-ui/react";
import React from "react";

const Loader = ({ scaleFactor = 1 }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      m={"auto"}
      alignItems="center"
      mt={"4"}
    >
      <Spinner size={"xl"} color="blue.500" />
    </Box>
  );
};

export default Loader;
