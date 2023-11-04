import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Box px={2} py={1} borderRadius="3g" m={1} mb={2} fontSize={12} backgroundColor="green" color={"white"} cursor={"pointer"} onClick={handleFunction}>
            {user?.name}
            <CloseIcon pl={2} fontSize="md" />
        </Box>
    );
};

export default UserBadgeItem;
