import { Box, rem, Group, useMantineTheme, Text, Button } from "@mantine/core";
import React from "react";

export const UserIcon: React.FC = () => {
    const theme = useMantineTheme();
    
    return (
        <Box
        sx={{
            paddingTop: theme.spacing.sm,
            borderTop: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
            }`,
        }}
        >
        <Group
            sx={{
            display: 'block',
            width: '100%',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
            }}
        >
            <Group>
            <Box sx={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                    NHSDLC Admin
                </Text>
                <Text color="dimmed" size="xs">
                    info@nhsdlc.com
                </Text>
            </Box>
            <Button color="red" variant="outline" sx={{
                '&:hover': {
                    backgroundColor: theme.colors.red[0],
                }
            }}>
                Logout
            </Button>
            </Group>
        </Group>
        </Box>
    );
}

export default UserIcon;