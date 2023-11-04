import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, FormControl, IconButton, Input, Spinner, Text, Tooltip, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import "./styles.css";
import io from "socket.io-client";
import Lottie from "lottie-react";
import animationData from "../animations/typing.json";

const ENDPOINT = "https://letschitchat.onrender.com";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    // const [file, setFile] = useState();
    const toast = useToast();

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

    /* const onFileChange = (e) => {
        // console.log(e.target.files[0]);
        setFile(e.target.files[0]);
        // setMessages(e.target.files[0].name);
    }; */

    const fecthMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setLoading(true);
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

            // console.log(messages);
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error occured",
                description: "Failed to load the messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);

    useEffect(() => {
        fecthMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    // console.log(notification, "----------");
    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                // Notification
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );

                // console.log(data);
                socket.emit("new message", data);

                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Error occured",
                    description: "Failed to send the message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        var timer = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timer && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timer);
    };
    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        fontSize={{ base: "28px", md: "30px" }}
                        paddingBottom={3}
                        px={2}
                        width={"100%"}
                        fontFamily={"Work sans"}
                    >
                        <IconButton display={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")} />
                        {!selectedChat?.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                {<UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fecthMessages={fecthMessages} />}
                            </>
                        )}
                    </Text>

                    <Box display={"flex"} flexDir={"column"} justifyContent={"flex-end"} padding={3} background={"#E8E8E8"} width={"100%"} height={"100%"} borderRadius={"1g"} overflowY={"hidden"}>
                        {loading ? (
                            <Spinner size={"xl"} width={20} height={20} alignSelf="center" margin={"auto"} />
                        ) : (
                            <div className="messages">
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <FormControl onKeyDown={sendMessage} isRequired marginTop={3}>
                            {isTyping ? (
                                <div>
                                    <Lottie style={{ width: 70, marginBottom: 15, marginLeft: 0 }} animationData={animationData} loop={true} />
                                </div>
                            ) : (
                                <></>
                            )}
                            <Input variant={"filled"} width={"100%"} bg="#E0E0E0" placeholder="Enter a message..." onChange={typingHandler} value={newMessage || ""} />
                        </FormControl>
                    </Box>
                    {/* File Send */}
                    {/* <Box>
                        <label htmlFor="fileinput">
                            <Tooltip label="Send file">
                                <AttachmentIcon boxSize={5} color={"green.600"} cursor={"pointer"} />
                            </Tooltip>
                        </label>
                        <input type={"file"} id="fileinput" style={{ display: "none" }} onChange={(e) => onFileChange(e)} />
                    </Box> */}
                </>
            ) : (
                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} height={"100%"}>
                    <Text fontSize={"3xl"} paddingBottom={3} fontFamily={"Work sans"}>
                        Click On a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    );
};

export default SingleChat;
