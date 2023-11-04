import { Box } from "@chakra-ui/layout";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import { useState, useEffect } from "react";

const ChatPage = () => {
    const { user } = ChatState();
    useEffect(() => {}, []);
    const [fetchAgain, setFetchAgain] = useState(false);
    // console.log(user);

    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box display={"flex"} justifyContent="space-between" width={"100%"} height={"91vh"} padding={"5px"}>
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    );
};

export default ChatPage;
