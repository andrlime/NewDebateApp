import { Box, rem, Group, useMantineTheme, Text, Button } from "@mantine/core";
import React from "react";

// redux
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/auth'
import { RootState } from '../store/reducers/reduce';
import Link from "next/link";

export const UserIcon: React.FC = () => {
    const theme = useMantineTheme();
    const loggedIn = useSelector((state: RootState) => state.auth.login);
    const username = useSelector((state: RootState) => state.auth.name);
    const email = useSelector((state: RootState) => state.auth.email);
    const dispatch = useDispatch();

    const logInOutButton = (
        <Button color={loggedIn ? "red" : "green"} variant="outline" sx={{
            '&:hover': {
                backgroundColor: loggedIn ? theme.colors.red[0] : theme.colors.green[0],
            }
        }} onClick={loggedIn ? () => dispatch(logout()) : () => {}}>
            {loggedIn ? "Logout" : "Login"}
        </Button>
    );
    
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

            {loggedIn ? 
            <Box sx={{ flex: 1 }}>
            <Text size="sm" weight={500}>
                {username}
            </Text>
            <Text color="dimmed" size="xs">
                {email}
            </Text>
            </Box> : ""}
            
            {loggedIn ? logInOutButton : 
                <Link href="/login">
                    {logInOutButton}
                </Link>
            }

            {!loggedIn ? 
            <Link href="/signup">
                <Button color="yellow" variant="outline" sx={{
                    '&:hover': {
                        backgroundColor: theme.colors.yellow[0],
                    }
                }}>
                    Sign Up
                </Button>
            </Link> : ""}
            
            </Group>
        </Group>
        </Box>
    );
}

export default UserIcon;