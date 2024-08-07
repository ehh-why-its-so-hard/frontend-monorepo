import locators from '../locators';

export const Settings = ({ className }: { className?: string }) => {
  return (
    <svg
      data-testid={locators.settingsIcon}
      className={className}
      width="22"
      height="21"
      viewBox="0 0 22 21"
      fill="none"
    >
      <path
        d="M8.60349 2.9185L8.85329 2.77412V2.48561V0.5H13.5233V2.47061V2.75912L13.7731 2.9035L16.4497 4.45054L16.7007 4.59558L16.9512 4.4499L18.6696 3.45083L20.9969 7.49619L19.277 8.49613L19.0283 8.64072V8.92838V12.0116V12.2993L19.277 12.4439L20.9969 13.4438L18.6699 17.4887L16.95 16.5021L16.7009 16.3592L16.4519 16.5024L13.7589 18.0518L13.5083 18.196V18.4852V20.47H8.83829V18.4852V18.196L8.58764 18.0518L5.8947 16.5024L5.64572 16.3592L5.39656 16.5021L3.67668 17.4887L1.3497 13.4438L3.0696 12.4439L3.31829 12.2993V12.0116V8.92838V8.64072L3.0696 8.49613L1.34946 7.49605L3.69218 3.45096L5.43077 4.46177L5.68134 4.60745L5.93229 4.46241L8.60349 2.9185Z"
        stroke="currentColor"
        strokeMiterlimit="10"
      />
      <path
        d="M11.1658 5.50535L15.4658 7.99154V12.9635L11.1658 15.4496L6.86578 12.9635V7.99154L11.1658 5.50535Z"
        stroke="currentColor"
        strokeMiterlimit="10"
      />
    </svg>
  );
};
