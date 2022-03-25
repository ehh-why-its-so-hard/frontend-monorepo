import { useVegaWallet } from '@vegaprotocol/wallet';

interface VegaWalletButtonProps {
  setConnectDialog: (isOpen: boolean) => void;
}

export const VegaWalletButton = ({
  setConnectDialog,
}: VegaWalletButtonProps) => {
  const { disconnect, keypairs } = useVegaWallet();
  const isConnected = keypairs !== null;

  const handleClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      setConnectDialog(true);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="ml-auto inline-block text-ui sm:text-body-large"
    >
      {isConnected ? 'Disconnect Vega wallet' : 'Connect Vega wallet'}
    </button>
  );
};
