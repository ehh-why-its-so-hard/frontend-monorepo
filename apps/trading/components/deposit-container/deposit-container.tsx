import { useEVMBridgeConfigs, useEthereumConfig } from '@vegaprotocol/web3';

import { DepositForm } from './deposit-form';
import { type AssetERC20, useEnabledAssets } from '@vegaprotocol/assets';
import { useSquid } from './use-squid';
import { FallbackDepositForm } from './fallback-deposit-form';
import { useT } from '../../lib/use-t';
import { Networks, useEnvironment } from '@vegaprotocol/environment';

/**
 * Gets env vars, assets, and configs required for the deposit form
 */
export const DepositContainer = ({
  initialAssetId,
}: {
  initialAssetId?: string;
}) => {
  const t = useT();
  const { VEGA_ENV } = useEnvironment();
  const { config } = useEthereumConfig();
  const { configs } = useEVMBridgeConfigs();
  const { data: assets, loading } = useEnabledAssets();
  const { data: squid } = useSquid();

  if (!config) return null;
  if (!configs?.length) return null;

  const allConfigs = [config, ...configs];

  // Make sure asset is an existing enabled asset
  const asset = assets?.find((a) => a.id === initialAssetId);

  if (loading || !squid) {
    return <p>{t('Loading')}</p>;
  }

  // If we have squid initialized show the form which allows swaps
  if (VEGA_ENV === Networks.MAINNET && squid.initialized) {
    return (
      <DepositForm
        squid={squid}
        assets={assets as AssetERC20[]}
        initialAsset={asset as AssetERC20}
        configs={allConfigs}
      />
    );
  }

  // If for some reason squid cannto be initialized (api down for example)
  // use a form which doesn't require squid, but also doesn't allow swaps,
  // which is better than noting
  return (
    <FallbackDepositForm
      assets={assets as AssetERC20[]}
      initialAsset={asset as AssetERC20}
      configs={allConfigs}
    />
  );
};
