import { useCallback, useState } from 'react';
import { getAsset, getProductType, getQuoteName } from '@vegaprotocol/markets';
import type { OrderSubmissionBody } from '@vegaprotocol/wallet';
import { useVegaWallet } from '@vegaprotocol/wallet';

import type { Market } from '@vegaprotocol/markets';
import type { EstimatePositionQuery } from '@vegaprotocol/positions';
import { AccountBreakdownDialog } from '@vegaprotocol/accounts';

import {
  formatNumberPercentage,
  formatRange,
  formatValue,
} from '@vegaprotocol/utils';
import { marketMarginDataProvider } from '@vegaprotocol/accounts';
import { useDataProvider } from '@vegaprotocol/data-provider';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as Schema from '@vegaprotocol/types';

import {
  MARGIN_DIFF_TOOLTIP_TEXT,
  DEDUCTION_FROM_COLLATERAL_TOOLTIP_TEXT,
  TOTAL_MARGIN_AVAILABLE,
  LIQUIDATION_PRICE_ESTIMATE_TOOLTIP_TEXT,
  EST_TOTAL_MARGIN_TOOLTIP_TEXT,
  MARGIN_ACCOUNT_TOOLTIP_TEXT,
} from '../../constants';
import { useEstimateFees } from '../../hooks/use-estimate-fees';
import { KeyValue } from './key-value';
import {
  Accordion,
  AccordionChevron,
  AccordionPanel,
  Intent,
  ExternalLink,
  Pill,
  Tooltip,
} from '@vegaprotocol/ui-toolkit';
import classNames from 'classnames';
import BigNumber from 'bignumber.js';
import { FeesBreakdown } from '../fees-breakdown';
import { getTotalDiscountFactor, getDiscountedFee } from '../discounts';
import { useT, ns } from '../../use-t';
import { Trans } from 'react-i18next';

export const emptyValue = '-';

export interface DealTicketFeeDetailsProps {
  assetSymbol: string;
  order: OrderSubmissionBody['orderSubmission'];
  market: Market;
  isMarketInAuction?: boolean;
}

export const DealTicketFeeDetails = ({
  assetSymbol,
  order,
  market,
  isMarketInAuction,
}: DealTicketFeeDetailsProps) => {
  const t = useT();
  const feeEstimate = useEstimateFees(order, isMarketInAuction);
  const asset = getAsset(market);
  const { decimals: assetDecimals, quantum } = asset;

  const totalDiscountFactor = getTotalDiscountFactor(feeEstimate);
  const totalDiscountedFeeAmount =
    feeEstimate?.totalFeeAmount &&
    getDiscountedFee(
      feeEstimate.totalFeeAmount,
      feeEstimate.referralDiscountFactor,
      feeEstimate.volumeDiscountFactor
    ).discountedFee;

  return (
    <KeyValue
      label={
        <>
          {t('Fees')}
          {totalDiscountFactor ? (
            <Pill size="xxs" intent={Intent.Info} className="ml-1">
              -
              {formatNumberPercentage(
                new BigNumber(totalDiscountFactor).multipliedBy(100),
                2
              )}
            </Pill>
          ) : null}
        </>
      }
      value={
        totalDiscountedFeeAmount &&
        `~${formatValue(totalDiscountedFeeAmount, assetDecimals)}`
      }
      formattedValue={
        totalDiscountedFeeAmount &&
        `~${formatValue(totalDiscountedFeeAmount, assetDecimals, quantum)}`
      }
      labelDescription={
        <div className="flex flex-col gap-2">
          <p>
            {t(
              'An estimate of the most you would be expected to pay in fees, in the market\'s settlement asset {{assetSymbol}}. Fees estimated are "taker" fees and will only be payable if the order trades aggressively. Rebate equal to the maker portion will be paid to the trader if the order trades passively.',
              { assetSymbol }
            )}
          </p>
          <FeesBreakdown
            totalFeeAmount={feeEstimate?.totalFeeAmount}
            referralDiscountFactor={feeEstimate?.referralDiscountFactor}
            volumeDiscountFactor={feeEstimate?.volumeDiscountFactor}
            fees={feeEstimate?.fees}
            feeFactors={market.fees.factors}
            symbol={assetSymbol}
            decimals={assetDecimals}
          />
        </div>
      }
      symbol={assetSymbol}
    />
  );
};

export interface DealTicketMarginDetailsProps {
  generalAccountBalance?: string;
  marginAccountBalance?: string;
  market: Market;
  onMarketClick?: (marketId: string, metaKey?: boolean) => void;
  assetSymbol: string;
  positionEstimate: EstimatePositionQuery['estimatePosition'];
  side: Schema.Side;
}

export const DealTicketMarginDetails = ({
  marginAccountBalance,
  generalAccountBalance,
  assetSymbol,
  market,
  onMarketClick,
  positionEstimate,
  side,
}: DealTicketMarginDetailsProps) => {
  const t = useT();
  const [breakdownDialog, setBreakdownDialog] = useState(false);
  const { pubKey: partyId } = useVegaWallet();
  const { data: currentMargins } = useDataProvider({
    dataProvider: marketMarginDataProvider,
    variables: { marketId: market.id, partyId: partyId || '' },
    skip: !partyId,
  });
  const liquidationEstimate = positionEstimate?.liquidation;
  const marginEstimate = positionEstimate?.margin;
  const totalBalance =
    BigInt(generalAccountBalance || '0') + BigInt(marginAccountBalance || '0');
  const asset = getAsset(market);
  const { decimals: assetDecimals, quantum } = asset;
  let marginRequiredBestCase: string | undefined = undefined;
  let marginRequiredWorstCase: string | undefined = undefined;
  if (marginEstimate) {
    if (currentMargins) {
      marginRequiredBestCase = (
        BigInt(marginEstimate.bestCase.initialLevel) -
        BigInt(currentMargins.initialLevel)
      ).toString();
      if (marginRequiredBestCase.startsWith('-')) {
        marginRequiredBestCase = '0';
      }
      marginRequiredWorstCase = (
        BigInt(marginEstimate.worstCase.initialLevel) -
        BigInt(currentMargins.initialLevel)
      ).toString();
      if (marginRequiredWorstCase.startsWith('-')) {
        marginRequiredWorstCase = '0';
      }
    } else {
      marginRequiredBestCase = marginEstimate.bestCase.initialLevel;
      marginRequiredWorstCase = marginEstimate.worstCase.initialLevel;
    }
  }

  const totalMarginAvailable = (
    currentMargins
      ? totalBalance - BigInt(currentMargins.maintenanceLevel)
      : totalBalance
  ).toString();

  let deductionFromCollateral = null;
  let projectedMargin = null;
  if (marginAccountBalance) {
    const deductionFromCollateralBestCase =
      BigInt(marginEstimate?.bestCase.initialLevel ?? 0) -
      BigInt(marginAccountBalance);

    const deductionFromCollateralWorstCase =
      BigInt(marginEstimate?.worstCase.initialLevel ?? 0) -
      BigInt(marginAccountBalance);

    deductionFromCollateral = (
      <KeyValue
        indent
        label={t('Deduction from collateral')}
        value={formatRange(
          deductionFromCollateralBestCase > 0
            ? deductionFromCollateralBestCase.toString()
            : '0',
          deductionFromCollateralWorstCase > 0
            ? deductionFromCollateralWorstCase.toString()
            : '0',
          assetDecimals
        )}
        formattedValue={formatValue(
          deductionFromCollateralWorstCase > 0
            ? deductionFromCollateralWorstCase.toString()
            : '0',
          assetDecimals,
          quantum
        )}
        symbol={assetSymbol}
        labelDescription={t(
          'DEDUCTION_FROM_COLLATERAL_TOOLTIP_TEXT',
          DEDUCTION_FROM_COLLATERAL_TOOLTIP_TEXT,
          { assetSymbol }
        )}
      />
    );
    projectedMargin = (
      <KeyValue
        label={t('Projected margin')}
        value={formatRange(
          marginEstimate?.bestCase.initialLevel,
          marginEstimate?.worstCase.initialLevel,
          assetDecimals
        )}
        formattedValue={formatValue(
          marginEstimate?.worstCase.initialLevel,
          assetDecimals,
          quantum
        )}
        symbol={assetSymbol}
        labelDescription={t(
          'EST_TOTAL_MARGIN_TOOLTIP_TEXT',
          EST_TOTAL_MARGIN_TOOLTIP_TEXT
        )}
      />
    );
  }

  let liquidationPriceEstimate = emptyValue;
  let liquidationPriceEstimateRange = emptyValue;

  if (liquidationEstimate) {
    const liquidationEstimateBestCaseIncludingBuyOrders = BigInt(
      liquidationEstimate.bestCase.including_buy_orders.replace(/\..*/, '')
    );
    const liquidationEstimateBestCaseIncludingSellOrders = BigInt(
      liquidationEstimate.bestCase.including_sell_orders.replace(/\..*/, '')
    );
    const liquidationEstimateBestCase =
      side === Schema.Side.SIDE_BUY
        ? liquidationEstimateBestCaseIncludingBuyOrders
        : liquidationEstimateBestCaseIncludingSellOrders;

    const liquidationEstimateWorstCaseIncludingBuyOrders = BigInt(
      liquidationEstimate.worstCase.including_buy_orders.replace(/\..*/, '')
    );
    const liquidationEstimateWorstCaseIncludingSellOrders = BigInt(
      liquidationEstimate.worstCase.including_sell_orders.replace(/\..*/, '')
    );
    const liquidationEstimateWorstCase =
      side === Schema.Side.SIDE_BUY
        ? liquidationEstimateWorstCaseIncludingBuyOrders
        : liquidationEstimateWorstCaseIncludingSellOrders;

    liquidationPriceEstimate = formatValue(
      liquidationEstimateWorstCase.toString(),
      market.decimalPlaces,
      undefined,
      market.decimalPlaces
    );
    liquidationPriceEstimateRange = formatRange(
      (liquidationEstimateBestCase < liquidationEstimateWorstCase
        ? liquidationEstimateBestCase
        : liquidationEstimateWorstCase
      ).toString(),
      (liquidationEstimateBestCase > liquidationEstimateWorstCase
        ? liquidationEstimateBestCase
        : liquidationEstimateWorstCase
      ).toString(),
      market.decimalPlaces,
      undefined,
      market.decimalPlaces
    );
  }

  const onAccountBreakdownDialogClose = useCallback(
    () => setBreakdownDialog(false),
    []
  );

  const quoteName = getQuoteName(market);
  const productType = getProductType(market);

  return (
    <div className="flex flex-col w-full gap-2 pt-2">
      {/*
      TODO: remove this conditional check once the following PRs are deployed
      and the estimatePosition query is working for perps

      - https://github.com/vegaprotocol/vega/pull/10119
      - https://github.com/vegaprotocol/vega/pull/10122
      */}
      {productType === 'Future' && (
        <>
          <Accordion>
            <AccordionPanel
              itemId="margin"
              trigger={
                <AccordionPrimitive.Trigger
                  data-testid="accordion-toggle"
                  className={classNames(
                    'w-full',
                    'flex items-center gap-2 text-xs',
                    'group'
                  )}
                >
                  <div
                    data-testid={`deal-ticket-fee-margin-required`}
                    key={'value-dropdown'}
                    className="flex items-center justify-between w-full gap-2"
                  >
                    <div className="flex items-center text-left gap-1">
                      <Tooltip
                        description={t(
                          'MARGIN_DIFF_TOOLTIP_TEXT',
                          MARGIN_DIFF_TOOLTIP_TEXT,
                          { assetSymbol }
                        )}
                      >
                        <span className="text-muted">
                          {t('Margin required')}
                        </span>
                      </Tooltip>

                      <AccordionChevron size={10} />
                    </div>
                    <Tooltip
                      description={
                        formatRange(
                          marginRequiredBestCase,
                          marginRequiredWorstCase,
                          assetDecimals
                        ) ?? '-'
                      }
                    >
                      <div className="font-mono text-right">
                        {formatValue(
                          marginRequiredWorstCase,
                          assetDecimals,
                          quantum
                        )}{' '}
                        {assetSymbol || ''}
                      </div>
                    </Tooltip>
                  </div>
                </AccordionPrimitive.Trigger>
              }
            >
              <div className="flex flex-col w-full gap-2">
                <KeyValue
                  label={t('Total margin available')}
                  indent
                  value={formatValue(totalMarginAvailable, assetDecimals)}
                  formattedValue={formatValue(
                    totalMarginAvailable,
                    assetDecimals,
                    quantum
                  )}
                  symbol={assetSymbol}
                  labelDescription={t(
                    'TOTAL_MARGIN_AVAILABLE',
                    TOTAL_MARGIN_AVAILABLE,
                    {
                      generalAccountBalance: formatValue(
                        generalAccountBalance,
                        assetDecimals,
                        quantum
                      ),
                      marginAccountBalance: formatValue(
                        marginAccountBalance,
                        assetDecimals,
                        quantum
                      ),
                      marginMaintenance: formatValue(
                        currentMargins?.maintenanceLevel,
                        assetDecimals,
                        quantum
                      ),
                      assetSymbol,
                    }
                  )}
                />
                {deductionFromCollateral}
                <KeyValue
                  label={t('Current margin allocation')}
                  indent
                  onClick={
                    generalAccountBalance
                      ? () => setBreakdownDialog(true)
                      : undefined
                  }
                  value={formatValue(marginAccountBalance, assetDecimals)}
                  symbol={assetSymbol}
                  labelDescription={MARGIN_ACCOUNT_TOOLTIP_TEXT}
                  formattedValue={formatValue(
                    marginAccountBalance,
                    assetDecimals,
                    quantum
                  )}
                />
              </div>
            </AccordionPanel>
          </Accordion>
          {projectedMargin}
        </>
      )}
      <KeyValue
        label={t('Liquidation')}
        value={liquidationPriceEstimateRange}
        formattedValue={liquidationPriceEstimate}
        symbol={quoteName}
        labelDescription={
          <>
            <span>
              {t(
                'LIQUIDATION_PRICE_ESTIMATE_TOOLTIP_TEXT',
                LIQUIDATION_PRICE_ESTIMATE_TOOLTIP_TEXT
              )}
            </span>{' '}
            <span>
              <Trans
                defaults="For full details please see <0>liquidation price estimate documentation</0>."
                components={[
                  <ExternalLink
                    href={
                      'https://github.com/vegaprotocol/specs/blob/master/non-protocol-specs/0012-NP-LIPE-liquidation-price-estimate.md'
                    }
                  >
                    liquidation price estimate documentation
                  </ExternalLink>,
                ]}
                ns={ns}
              />
            </span>
          </>
        }
      />
      {partyId && (
        <AccountBreakdownDialog
          assetId={breakdownDialog ? asset.id : undefined}
          partyId={partyId}
          onMarketClick={onMarketClick}
          onClose={onAccountBreakdownDialogClose}
        />
      )}
    </div>
  );
};
