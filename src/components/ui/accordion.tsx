import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Accordion } from "@base-ui/react/accordion";
import React, { ComponentPropsWithoutRef, useEffect, useState } from "react";

type AccordionItemProps = ComponentPropsWithoutRef<typeof Accordion.Item>;
type AccordionHeaderProps = ComponentPropsWithoutRef<typeof Accordion.Header>;
type AccordionTriggerProps = ComponentPropsWithoutRef<typeof Accordion.Trigger>;
type AccordionPanelProps = ComponentPropsWithoutRef<typeof Accordion.Panel>;

export const AccordionItem = ({
  children,
  className,
  ...props
}: AccordionItemProps) => {
  return (
    <Accordion.Item className={`focus-within:z-1 ${className}`} {...props}>
      {children}
    </Accordion.Item>
  );
};

export const AccordionHeader = ({
  children,
  className,
  ...props
}: AccordionHeaderProps) => (
  <Accordion.Header
    className={`sticky top-0 z-1 flex w-full flex-row bg-blue-500 ${className}`}
    {...props}
  >
    {children}
  </Accordion.Header>
);

// TODO: fix accordion trigger to wrap entire header
export const AccordionTrigger = ({
  children,
  className,
  ...props
}: AccordionTriggerProps) => (
  <Accordion.Trigger
    className={`group flex h-[45px] cursor-pointer items-center justify-between px-5 leading-none font-medium text-white outline-none ${className}`}
    {...props}
  >
    {children}
    <ChevronDownIcon
      className="ml-auto text-white transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[panel-open]:rotate-180"
      aria-hidden
    />
  </Accordion.Trigger>
);

export const AccordionContent = ({
  children,
  className,
  ...props
}: AccordionPanelProps) => (
  <Accordion.Panel
    className={`bg-mauve2 data-[closed]:animate-accordion-slide-up data-[open]:animate-accordion-slide-down overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </Accordion.Panel>
);

export const AccordionSubheader = ({
  ingredientsLength,
  createdAt,
  updatedAt,
}: {
  ingredientsLength: number;
  createdAt?: Date;
  updatedAt?: Date;
}) => {
  // Need to use a useEffect to address hydration issues if only using string
  const [dateString, setDateString] = useState<string | undefined>(undefined);

  useEffect(() => {
    setDateString(
      new Intl.DateTimeFormat(navigator.language, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(
        updatedAt !== createdAt
          ? updatedAt
          : createdAt
            ? createdAt
            : new Date(),
      ),
    );
  }, [createdAt, updatedAt]);

  return (
    <div
      className={
        "flex flex-col gap-2 px-4 pb-2 text-sm font-medium text-gray-300 sm:flex-row"
      }
    >
      <p>
        {ingredientsLength > 1 || ingredientsLength === 0
          ? `${ingredientsLength} ingredients`
          : "1 ingredient"}
      </p>
      <p className={"hidden sm:flex"}>&mdash;</p>
      <p className={""}>
        {updatedAt !== createdAt ? "Updated" : "Created"} {dateString}
      </p>
    </div>
  );
};