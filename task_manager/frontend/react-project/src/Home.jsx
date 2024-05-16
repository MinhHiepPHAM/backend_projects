import { Box, Button, Group, rem, useMantineColorScheme } from "@mantine/core";
import { HeaderMegaMenu } from "./HeaderMegaMenu";
import { useViewportSize } from "@mantine/hooks";

function Home() {
    const { height, width } = useViewportSize();
    return (
        <Box w={width} h={height}>
            <HeaderMegaMenu/>
        </Box>
    )
}

export default Home