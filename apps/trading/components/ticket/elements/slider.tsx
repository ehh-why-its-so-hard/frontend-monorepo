import * as SliderPrimitives from '@radix-ui/react-slider';
import { cn } from '@vegaprotocol/ui-toolkit';
import { type ComponentProps } from 'react';

const markers = [0, 25, 50, 75, 100];

export const Slider = (props: ComponentProps<typeof SliderPrimitives.Root>) => {
  return (
    <div className="flex flex-col gap-0.5">
      <SliderPrimitives.Root
        {...props}
        className={cn(
          'relative flex items-center select-none touch-none w-full height-10 py-1.5',
          {
            'opacity-50': props.disabled,
          }
        )}
      >
        <SliderPrimitives.Track className="relative flex justify-between h-1 flex-1 rounded dark:bg-gs-300">
          <SliderPrimitives.Range className="absolute h-1 bg-suface-1-fg" />
          {markers.map((m) => {
            return (
              <button
                key={m}
                type="button"
                className={cn('relative -top-1 w-3 h-3 rounded-full', {
                  'bg-surface-0-fg':
                    props.value !== undefined && props.value[0] >= m,
                  'dark:bg-gs-200':
                    props.value === undefined || props.value[0] < m,
                })}
                disabled={props.disabled}
                onClick={() => {
                  props.onValueChange && props.onValueChange([m]);
                  props.onValueCommit && props.onValueCommit([m]);
                }}
              >
                <span className="sr-only">{m}%</span>
              </button>
            );
          })}
        </SliderPrimitives.Track>
        <SliderPrimitives.Thumb className="group cursor-pointer relative block w-5 h-5 border-2 bg-surface-0-fg rounded-full border-surface-1">
          <span className="group-active:block hidden absolute text-xs p-1 -top-1.5 -translate-y-full left-1/2 -translate-x-1/2 rounded bg-surface-1-fg text-surface-1">
            {props.value}
          </span>
        </SliderPrimitives.Thumb>
      </SliderPrimitives.Root>
      <div className="flex justify-between h-3">
        {markers.map((m, i) => {
          const isMiddle = i > 0 && i < markers.length - 1;
          return (
            <span key={m} className="w-3 relative">
              <button
                type="button"
                className={cn('absolute text-xs text-surface-1-fg-muted', {
                  'left-1/2 -translate-x-1/2': isMiddle,
                  'left-0': i === 0,
                  'right-0': i === markers.length - 1,
                })}
                disabled={props.disabled}
                onClick={() => {
                  props.onValueChange && props.onValueChange([m]);
                  props.onValueCommit && props.onValueCommit([m]);
                }}
              >
                {m}%
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
};
