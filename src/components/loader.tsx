import {Flex, Spin} from "antd";
import React from "react";

const Loader = () => {
    return (
        <Flex
            align="center"
            justify="center"
            style={{width: "100%", height: "100%"}}
        >
            <Spin size="large"/>
        </Flex>
    );
};

export default Loader;
