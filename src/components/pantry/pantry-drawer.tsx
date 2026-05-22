"use client";

import { useEffect, useRef } from "react";
import { Drawer } from "@base-ui/react/drawer";
import { usePantryStore } from "@/providers/pantry-store-provider";
import { useShallow } from "zustand/react/shallow";
import { PantryItem } from "@/utils/interfaces";

const SYNC_DEBOUNCE_MS = 1500;

export const PantryDrawer = () => {
  const {
    pantryItems,
    isPantryOpen,
    setPantryOpen,
    removeItem,
    clearPantry,
    syncPantry,
  } = usePantryStore(
    useShallow(
      ({
        pantryItems,
        isPantryOpen,
        setPantryOpen,
        removeItem,
        clearPantry,
        syncPantry,
      }) => ({
        pantryItems,
        isPantryOpen,
        setPantryOpen,
        removeItem,
        clearPantry,
        syncPantry,
      }),
    ),
  );

  // Debounced DB sync — fires 1.5s after any change to pantryItems
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    // Skip the initial mount (don't sync the seeded server data back)
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }

    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);

    syncTimerRef.current = setTimeout(() => {
      syncPantry(pantryItems);
    }, SYNC_DEBOUNCE_MS);

    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [pantryItems, syncPantry]);

  return (
    <Drawer.Root open={isPantryOpen} onOpenChange={setPantryOpen}>
      <Drawer.Portal>
        <Drawer.Backdrop
          className={
            "fixed inset-0 min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.2] [--bleed:3rem] data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:opacity-0 data-swiping:duration-0 supports-[-webkit-touch-callout:none]:absolute dark:[--backdrop-opacity:0.7]"
          }
        />
        <Drawer.Viewport
          className={
            "fixed inset-0 flex items-stretch justify-end p-(--viewport-padding) [--viewport-padding:0px] supports-[-webkit-touch-callout:none]:[--viewport-padding:0.625rem]"
          }
        >
          <Drawer.Popup
            className={
              "-mr-[3rem] h-full w-[calc(20rem+3rem)] max-w-[calc(100vw-3rem+3rem)] [transform:translateX(var(--drawer-swipe-movement-x))] touch-auto overflow-y-auto overscroll-contain bg-white p-6 pr-[calc(1.5rem+3rem)] text-neutral-950 shadow-[0.25rem_0.25rem_0] shadow-black/12 transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] outline-none [--bleed:3rem] data-ending-style:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-swiping:select-none supports-[-webkit-touch-callout:none]:mr-0 supports-[-webkit-touch-callout:none]:w-[20rem] supports-[-webkit-touch-callout:none]:max-w-[calc(100vw-3rem)] supports-[-webkit-touch-callout:none]:border supports-[-webkit-touch-callout:none]:pr-6 supports-[-webkit-touch-callout:none]:[--bleed:0px] dark:border-white dark:bg-neutral-950 dark:text-white dark:shadow-none"
            }
          >
            <Drawer.Content className={"mx-auto w-full max-w-[32rem]"}>
              <Drawer.Title className={"mb-1 text-base font-bold"}>
                Pantry
              </Drawer.Title>
              <Drawer.Description
                className={
                  "mb-6 text-sm text-neutral-600 dark:text-neutral-400"
                }
              >
                {pantryItems.length === 0
                  ? "Your pantry is empty."
                  : `${pantryItems.length} item${pantryItems.length !== 1 ? "s" : ""}`}
              </Drawer.Description>

              <PantryItemList items={pantryItems} onRemove={removeItem} />

              {pantryItems.length > 0 && (
                <button type="button" onClick={clearPantry}>
                  Clear all
                </button>
              )}

              <div className="flex justify-end gap-3">
                <Drawer.Close
                  className={
                    "flex cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-xl font-bold tracking-widest text-white"
                    // "hover:not-data-disabled:bg-neutral-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 active:not-data-disabled:bg-neutral-200 disabled:border-neutral-500 disabled:text-neutral-500 data-disabled:border-neutral-500 data-disabled:text-neutral-500 dark:border-white dark:bg-neutral-950 dark:text-white dark:hover:not-data-disabled:bg-neutral-800 dark:focus-visible:outline-white dark:active:not-data-disabled:bg-neutral-700 dark:data-disabled:border-neutral-400 dark:data-disabled:text-neutral-400"
                  }
                >
                  Close
                </Drawer.Close>
              </div>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

const PantryItemList = ({
  items,
  onRemove,
}: {
  items: PantryItem[];
  onRemove: (name: string) => void;
}) => {
  if (items.length === 0) return null;

  return (
    <ul>
      {items.map((item) => (
        <li key={item.name}>
          <span>
            {item.name}
            {item.quantity != null ? ` × ${item.quantity}` : ""}
            {item.unit ? ` ${item.unit}` : ""}
          </span>
          <button type="button" onClick={() => onRemove(item.name)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
};