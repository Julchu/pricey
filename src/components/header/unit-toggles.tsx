import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { LiquidType, MassType } from "@/utils/interfaces"; // <UnitToggle units={MassValues} value={mass} onValueChange={toggleMass} />;

// <UnitToggle units={MassValues} value={mass} onValueChange={toggleMass} />;
// <UnitToggle
//   units={VolumeValues}
//   value={liquidVolume}
//   onValueChange={toggleLiquidVolume}
// />;

export const UnitToggle = ({
  units,
  value,
  onValueChange,
}: {
  units: (MassType | LiquidType)[];
  value: MassType | LiquidType;
  onValueChange: (value: string) => void;
}) => {
  return (
    <ToggleGroup
      className={"flex justify-evenly gap-2 dark:border-white"}
      // ToggleGroup.value is string[] — wrap the single selected value in an array
      value={[value]}
      onValueChange={(values) => {
        // Prevent deselection: when the already-selected toggle is clicked,
        // ToggleGroup fires onValueChange([]) — ignore that and keep current value.
        if (values[0]) onValueChange(values[0]);
      }}
    >
      {units.map((unit) => (
        <Toggle
          key={unit}
          aria-label={unit}
          value={unit}
          className={
            "flex size-8 items-center justify-center rounded-md border-none bg-transparent select-none hover:not-data-disabled:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-neutral-950 active:not-data-disabled:not-data-pressed:bg-neutral-200 data-pressed:bg-neutral-950 data-pressed:text-white data-pressed:hover:not-data-disabled:bg-neutral-950 data-pressed:hover:not-data-disabled:text-white dark:text-white dark:hover:not-data-disabled:bg-neutral-800 dark:focus-visible:outline-white dark:active:not-data-disabled:not-data-pressed:bg-neutral-700 dark:data-pressed:bg-white dark:data-pressed:text-neutral-950 dark:data-pressed:hover:not-data-disabled:bg-white dark:data-pressed:hover:not-data-disabled:text-neutral-950"
          }
        >
          {unit}
        </Toggle>
      ))}
    </ToggleGroup>
  );
};