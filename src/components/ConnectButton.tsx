/* eslint-disable react/require-default-props */
import { Button } from '@chakra-ui/react';
import { useMoralis } from 'react-moralis';
import { FC, useEffect } from 'react';

export const ConnectButton: FC<{ type?: 'closable' | 'actionable' }> = ({
    type = 'closable',
    children,
}) => {
    const { logout, enableWeb3, isWeb3Enabled, isWeb3EnableLoading } = useMoralis();

    useEffect(() => {
        if (!isWeb3Enabled && !isWeb3EnableLoading) {
            enableWeb3({
                chainId: 80001,
            });
        }
    }, []);

    if (isWeb3Enabled && type === 'closable')
        return (
            <Button colorScheme="pink" variant="solid" onClick={() => logout()}>
                Disconnect
            </Button>
        );

    if (isWeb3Enabled && type === 'actionable') return <>{children}</>;

    return (
        <Button
            colorScheme="pink"
            variant="solid"
            onClick={() =>
                enableWeb3({
                    chainId: 80001,
                })
            }
        >
            Connect wallet
        </Button>
    );
};

export default ConnectButton;
