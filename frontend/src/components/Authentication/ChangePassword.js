import React from "react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useState } from "react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const ChangePassword = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [otp, setOtp] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleClick = () => setShow(!show);

    const submitHandler = async () => {
        setLoading(true);
        if (!email) {
            toast({
                title: "Please fill all the required fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                "/api/user/sendotp",
                {
                    email,
                },
                config
            );
            // console.log(data);

            toast({
                title: `OTP sent to ${email}`,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        } catch (error) {
            toast({
                title: "Couldn't send OTP",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    const changeHandler = async () => {
        setLoading(true);
        if (!email || !otp || !password) {
            toast({
                title: "Please fill all the required fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                "/api/user/changepassword",
                {
                    email,
                    otp,
                    password,
                },
                config
            );
            // console.log(data);

            toast({
                title: "Password updated successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        } catch (error) {
            toast({
                title: "Couldn't update password",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    return (
        <VStack spacing={"5px"} color={"black"} h={"55vh"}>
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} value={email || ""} />
                {/* value={email}  */}
            </FormControl>

            <Button colorScheme={"blue"} width={"100%"} style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}>
                Send OTP
            </Button>

            <FormControl id="changepassword" isRequired>
                <FormLabel>OTP</FormLabel>
                <Input placeholder="Enter OTP to verify" onChange={(e) => setOtp(e.target.value)} value={otp || ""} />
                {/* value={email}  */}
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>New Password</FormLabel>
                <InputGroup size={"md"}>
                    <Input type={show ? "text" : "password"} placeholder="Enter new password" onChange={(e) => setPassword(e.target.value)} value={password || ""} />
                    {/* value={ password} */}
                    <InputRightElement width={"4.5rem"}>
                        <Button h={"1.75rem"} size={"sm"} onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button colorScheme={"blue"} width={"30%"} style={{ marginTop: 10 }} onClick={changeHandler} isLoading={loading}>
                Submit
            </Button>
        </VStack>
    );
};

export default ChangePassword;
