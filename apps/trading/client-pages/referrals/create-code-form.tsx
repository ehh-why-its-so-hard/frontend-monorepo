import { useVegaWallet, useDialogStore } from '@vegaprotocol/wallet-react';
import { useState } from 'react';
import {
  CopyWithTooltip,
  ExternalLink,
  Intent,
  Tooltip,
  AnchorButton,
  Button,
  Dialog,
  VegaIcon,
  VegaIconNames,
} from '@vegaprotocol/ui-toolkit';
import { addDecimalsFormatNumber } from '@vegaprotocol/utils';
import { DApp, TokenStaticLinks, useLinks } from '@vegaprotocol/environment';
import { ABOUT_REFERRAL_DOCS_LINK } from './constants';
import { useT } from '../../lib/use-t';
import { Link, Navigate } from 'react-router-dom';
import { Links, Routes } from '../../lib/links';
import { useReferralProgram } from './hooks/use-referral-program';
import { useReferralSetTransaction } from '../../lib/hooks/use-referral-set-transaction';
import { Trans } from 'react-i18next';
import {
  useFindReferralSet,
  useIsInReferralSet,
} from './hooks/use-find-referral-set';
import { TransactionSteps } from '../../components/transaction-dialog/transaction-steps';

export const CreateCodeContainer = () => {
  const t = useT();
  const { pubKey, isReadOnly } = useVegaWallet();
  const isInReferralSet = useIsInReferralSet(pubKey);
  const openWalletDialog = useDialogStore((store) => store.open);

  // Navigate to the index page when already in the referral set.
  if (isInReferralSet) {
    return <Navigate to={Routes.REFERRALS} />;
  }

  return (
    <div
      data-testid="referral-create-code-form"
      className="md:w-2/3 max-w-md mx-auto bg-surface-1 p-8 rounded-lg"
    >
      <h3 className="mb-4 text-2xl text-center calt">
        {t('Create a referral code')}
      </h3>
      <p className="mb-4 text-center text-base">
        {t(
          'Generate a referral code to share with your friends and access the commission benefits of the current program.'
        )}
      </p>

      <div className="w-full flex flex-col gap-4 items-stretch">
        {pubKey ? (
          <CreateCodeForm />
        ) : (
          <Button
            intent={Intent.Primary}
            disabled={isReadOnly}
            onClick={openWalletDialog}
          >
            {t('Connect wallet')}
          </Button>
        )}
      </div>
    </div>
  );
};

export const CreateCodeForm = () => {
  const t = useT();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [txDialogOpen, setTxDialogOpen] = useState(false);
  const { isReadOnly } = useVegaWallet();

  const { pubKey } = useVegaWallet();
  const { refetch } = useFindReferralSet(pubKey);
  const {
    err,
    code,
    status,
    result,
    reset: resetTx,
    onSubmit: submit,
  } = useReferralSetTransaction();

  const onSubmit = () => {
    setDialogOpen(false);
    setTxDialogOpen(true);
    submit({ createReferralSet: { isTeam: false } });
  };

  const reset = () => {
    resetTx();
    refetch();
    setTxDialogOpen(false);
  };

  return (
    <>
      <Tooltip
        description={t(
          'Create a simple referral code to enjoy the referrer commission outlined in the current referral program'
        )}
      >
        <span>
          <Button
            intent={Intent.Primary}
            disabled={isReadOnly}
            onClick={() => setDialogOpen(true)}
            className="w-full"
          >
            {t('Create a referral code')}
          </Button>
        </span>
      </Tooltip>
      <Tooltip
        description={
          <Trans
            i18nKey={
              'Make your referral code a Team to compete in Competitions with your friends, appear in leaderboards on the <0>Competitions Homepage</0>, and earn rewards'
            }
            components={[
              <Link
                key="homepage-link"
                to={Links.COMPETITIONS()}
                className="underline"
              >
                Competitions Homepage
              </Link>,
            ]}
          />
        }
      >
        <span>
          <AnchorButton
            intent={Intent.Primary}
            disabled={isReadOnly}
            className="w-full"
            href={Links.COMPETITIONS_CREATE_TEAM()}
          >
            {t('Create a team')}
          </AnchorButton>
        </span>
      </Tooltip>
      <p className="text-xs">
        <Link className="underline" to={Links.COMPETITIONS()}>
          {t('Go to competitions')}
        </Link>
      </p>

      <Dialog
        title={t('Create a referral code')}
        open={dialogOpen}
        onChange={() => setDialogOpen(false)}
      >
        <CreateCodeDialog
          onSubmit={onSubmit}
          onCancel={() => {
            setDialogOpen(false);
          }}
        />
      </Dialog>

      <Dialog
        open={txDialogOpen}
        onChange={(open) => {
          setTxDialogOpen(open);
        }}
        title={t('Create a referral code')}
      >
        <TransactionSteps
          status={status}
          result={result}
          error={err || undefined}
          reset={reset}
          confirmedLabel={
            code ? (
              <div className="flex flex-col justify-start items-start gap-0 w-full">
                <span>{t('Referral code created')}</span>

                <div className="flex gap-1 max-w-full overflow-hidden">
                  <span className="truncate">{code}</span>

                  <CopyWithTooltip text={code}>
                    <Button
                      size="xs"
                      icon={<VegaIcon name={VegaIconNames.COPY} />}
                    >
                      <span>{t('Copy')}</span>
                    </Button>
                  </CopyWithTooltip>
                </div>
              </div>
            ) : (
              t('Referral code created')
            )
          }
        />
      </Dialog>
    </>
  );
};

const CreateCodeDialog = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: () => void;
  onCancel: () => void;
}) => {
  const t = useT();
  const createLink = useLinks(DApp.Governance);
  const { pubKey } = useVegaWallet();
  const { refetch } = useFindReferralSet(pubKey);
  const { stakeAvailable: currentStakeAvailable, requiredStake } =
    useReferralSetTransaction();

  const { details: programDetails } = useReferralProgram();

  if (!pubKey || currentStakeAvailable == null || requiredStake == null) {
    return (
      <div className="flex flex-col gap-6">
        <p>{t('You must be connected to the Vega wallet.')}</p>
        <Button intent={Intent.Primary} onClick={onCancel}>
          {t('Close')}
        </Button>
      </div>
    );
  }

  if (currentStakeAvailable < requiredStake) {
    return (
      <div className="flex flex-col gap-6">
        <p>
          {t(
            'You need at least {{requiredStake}} VEGA staked to generate a referral code and participate in the referral program.',
            {
              requiredStake: addDecimalsFormatNumber(
                requiredStake.toString(),
                18
              ),
            }
          )}
        </p>
        <AnchorButton
          href={createLink(TokenStaticLinks.ASSOCIATE)}
          intent={Intent.Primary}
          target="_blank"
        >
          {t('Stake some $VEGA now')}
        </AnchorButton>
      </div>
    );
  }

  const YES_OR_NO = (
    <>
      <Button
        fill={true}
        intent={Intent.Primary}
        onClick={() => {
          onSubmit();
        }}
      >
        {t('Yes')}
      </Button>

      <Button
        fill={true}
        intent={Intent.Primary}
        onClick={() => {
          refetch();
          onCancel();
        }}
      >
        {t('No')}
      </Button>
    </>
  );

  const GENERATE = (
    <Button
      fill={true}
      intent={Intent.Primary}
      onClick={() => {
        onSubmit();
      }}
    >
      {t('Generate code')}
    </Button>
  );

  return (
    <>
      <div className="flex flex-col gap-6">
        <p>
          {!programDetails
            ? t(
                'There is currently no referral program active, are you sure you want to create a code?'
              )
            : t(
                'Generate a referral code to share with your friends and access the commission benefits of the current program.'
              )}
        </p>

        {!programDetails ? YES_OR_NO : GENERATE}

        <div className="flex justify-center text-sm gap-4">
          <ExternalLink href={ABOUT_REFERRAL_DOCS_LINK}>
            {t('About the referral program')}
          </ExternalLink>
        </div>
      </div>
    </>
  );
};
