import {
  FormGroup,
  Input,
  TradingInputError,
  TradingCheckbox,
  TextArea,
  Button,
  Intent,
  VegaIcon,
  VegaIconNames,
} from '@vegaprotocol/ui-toolkit';
import { URL_REGEX, isValidVegaPublicKey } from '@vegaprotocol/utils';

import { type useReferralSetTransaction } from '../../lib/hooks/use-referral-set-transaction';
import { useT } from '../../lib/use-t';
import { useForm, Controller } from 'react-hook-form';
import {
  type CreateReferralSet,
  type UpdateReferralSet,
} from '@vegaprotocol/wallet';
import { TxStatus, type Status } from '@vegaprotocol/wallet-react';
import { cn } from '@vegaprotocol/ui-toolkit';
import { useLayoutEffect, useState } from 'react';

export type FormFields = {
  id: string;
  name: string;
  url: string;
  avatarUrl: string;
  private: boolean;
  allowList: string;
};

export enum TransactionType {
  CreateReferralSet = 'CreateReferralSet',
  UpdateReferralSet = 'UpdateReferralSet',
  /** A special case when a referral set has been created before team */
  UpgradeFromReferralSet = 'UpgradeFromReferralSet',
}

const prepareTransaction = (
  type: TransactionType,
  fields: FormFields
): CreateReferralSet | UpdateReferralSet => {
  switch (type) {
    case TransactionType.CreateReferralSet:
      return {
        createReferralSet: {
          isTeam: true,
          team: {
            name: fields.name.trim(),
            teamUrl: fields.url,
            avatarUrl: fields.avatarUrl,
            closed: fields.private,
            allowList: fields.private
              ? parseAllowListText(fields.allowList)
              : [],
          },
        },
      };
    case TransactionType.UpdateReferralSet:
    case TransactionType.UpgradeFromReferralSet:
      return {
        updateReferralSet: {
          id: fields.id,
          isTeam: true,
          team: {
            name: fields.name.trim(),
            teamUrl: fields.url,
            avatarUrl: fields.avatarUrl,
            closed: fields.private,
            allowList: fields.private
              ? parseAllowListText(fields.allowList)
              : [],
          },
        },
      };
  }
};

export const TeamForm = ({
  type,
  status,
  err,
  isCreatingSoloTeam,
  onSubmit,
  defaultValues,
}: {
  type: TransactionType;
  status: ReturnType<typeof useReferralSetTransaction>['status'];
  err: ReturnType<typeof useReferralSetTransaction>['err'];
  isCreatingSoloTeam: boolean;
  onSubmit: ReturnType<typeof useReferralSetTransaction>['onSubmit'];
  defaultValues?: FormFields;
}) => {
  const t = useT();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      private: isCreatingSoloTeam,
      ...defaultValues,
    },
  });

  const isPrivate = watch('private');

  const sendTransaction = (fields: FormFields) => {
    onSubmit(prepareTransaction(type, fields));
  };

  return (
    <form onSubmit={handleSubmit(sendTransaction)}>
      <input type="hidden" {...register('id')} />
      <FormGroup label={t('Team name')} labelFor="name">
        <Input
          {...register('name', {
            required: t('Required'),
            validate: {
              notEmpty: (value) => {
                if (/^\s*$/.test(value)) {
                  return t('Team name cannot be empty');
                }
                return true;
              },
            },
          })}
          data-testid="team-name-input"
        />
        {errors.name?.message && (
          <TradingInputError forInput="name" data-testid="team-name-error">
            {errors.name.message}
          </TradingInputError>
        )}
      </FormGroup>
      <FormGroup
        label={t('URL')}
        labelFor="url"
        labelDescription={t(
          'Provide a link so users can learn more about your team'
        )}
      >
        <Input
          {...register('url', {
            pattern: { value: URL_REGEX, message: t('Invalid URL') },
          })}
          data-testid="team-url-input"
        />
        {errors.url?.message && (
          <TradingInputError forInput="url" data-testid="team-url-error">
            {errors.url.message}
          </TradingInputError>
        )}
      </FormGroup>
      <FormGroup
        label={t('Avatar URL')}
        labelFor="avatarUrl"
        labelDescription={t('Provide a URL to a hosted image')}
      >
        <Input
          {...register('avatarUrl', {
            pattern: {
              value: URL_REGEX,
              message: t('Invalid image URL'),
            },
          })}
          data-testid="avatar-url-input"
        />
        {errors.avatarUrl?.message && (
          <TradingInputError
            forInput="avatarUrl"
            data-testid="avatar-url-error"
          >
            {errors.avatarUrl.message}
          </TradingInputError>
        )}
      </FormGroup>
      {
        // allow changing to private/public if editing, but don't show these options if making a solo team
        (type === TransactionType.UpdateReferralSet || !isCreatingSoloTeam) && (
          <>
            <FormGroup
              label={t('Make team private')}
              labelFor="private"
              hideLabel={true}
            >
              <Controller
                name="private"
                control={control}
                render={({ field }) => {
                  return (
                    <TradingCheckbox
                      label={t('Make team private')}
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                      }}
                      data-testid="team-private-checkbox"
                    />
                  );
                }}
              />
            </FormGroup>
            {isPrivate && (
              <FormGroup
                label={t('Public key allow list')}
                labelFor="allowList"
                labelDescription={t(
                  'Use a comma separated list to allow only specific public keys to join the team'
                )}
              >
                <TextArea
                  {...register('allowList', {
                    validate: {
                      allowList: (value) => {
                        const publicKeys = parseAllowListText(value);
                        if (
                          publicKeys.every((pk) => isValidVegaPublicKey(pk))
                        ) {
                          return true;
                        }
                        return t('Invalid public key found in allow list');
                      },
                    },
                  })}
                  data-testid="team-allow-list-textarea"
                />
                {errors.allowList?.message && (
                  <TradingInputError
                    forInput="avatarUrl"
                    data-testid="team-allow-list-error"
                  >
                    {errors.allowList.message}
                  </TradingInputError>
                )}
              </FormGroup>
            )}
          </>
        )
      }
      {err && (
        <p className="text-intent-danger text-xs mb-4 first-letter:capitalize">
          {err}
        </p>
      )}
      <SubmitButton type={type} status={status} />
    </form>
  );
};

const SubmitButton = ({
  type,
  status,
}: {
  type?: TransactionType;
  status: Status;
}) => {
  const t = useT();
  const disabled = status === TxStatus.Pending || status === TxStatus.Requested;

  let text = t('Create a team');
  if (type === TransactionType.UpdateReferralSet) {
    text = t('Update');
  }
  if (type === TransactionType.UpgradeFromReferralSet) {
    text = t('Upgrade');
  }

  let confirmedText = t('Created');
  if (type === TransactionType.UpdateReferralSet) {
    confirmedText = t('Updated');
  }
  if (type === TransactionType.UpgradeFromReferralSet) {
    confirmedText = t('Upgraded');
  }

  if (status === TxStatus.Requested) {
    text = t('Confirm in wallet...');
  } else if (status === TxStatus.Pending) {
    text = t('Confirming transaction...');
  }

  const [showConfirmed, setShowConfirmed] = useState<boolean>(false);

  useLayoutEffect(() => {
    let to: ReturnType<typeof setTimeout>;
    if (status === TxStatus.Confirmed && !showConfirmed) {
      to = setTimeout(() => {
        setShowConfirmed(true);
      }, 100);
    }
    return () => {
      clearTimeout(to);
    };
  }, [showConfirmed, status]);

  const confirmed = (
    <span
      className={cn('text-sm transition-opacity opacity-0', {
        'opacity-100': showConfirmed,
      })}
    >
      <VegaIcon
        name={VegaIconNames.TICK}
        size={18}
        className="text-green-500"
      />{' '}
      {confirmedText}
    </span>
  );

  return (
    <div className="flex gap-2 items-baseline">
      <Button
        type="submit"
        intent={Intent.Primary}
        disabled={disabled}
        data-testid="team-form-submit-button"
      >
        {text}
      </Button>
      {status === TxStatus.Confirmed && confirmed}
    </div>
  );
};

const parseAllowListText = (str: string = '') => {
  return str
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
};
