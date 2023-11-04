import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../Context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();

    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            flexDir={"column"}
            alignItems={"center"}
            padding={3}
            background={"white"}
            width={{ base: "100%", md: "68%" }}
            borderRadius="1g"
            borderWidth={"1px"}
        >
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={ setFetchAgain} />
        </Box>
    );
};

export default ChatBox;
