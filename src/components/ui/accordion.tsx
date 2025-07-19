// TODO: test if can remove * as React
import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Accordion } from "radix-ui";
import {
  AccordionContentProps,
  AccordionItemProps,
  AccordionTriggerProps,
} from "@radix-ui/react-accordion";

export const AccordionItem = ({
  children,
  className,
  ...props
}: AccordionItemProps) => {
  return (
    <Accordion.Item
      className={`mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 ${className} `}
      {...props}
    >
      {children}
    </Accordion.Item>
  );
};

export const AccordionTrigger = ({
  children,
  className,
  ...props
}: AccordionTriggerProps) => (
  <Accordion.Header className="flex">
    <Accordion.Trigger
      className={`group shadow-mauve6 flex h-[45px] flex-1 cursor-default items-center justify-between bg-blue-500 px-5 text-[15px] leading-none font-medium text-white shadow-[0_1px_0] outline-none ${className}`}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className="text-violet10 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
        aria-hidden
      />
    </Accordion.Trigger>
  </Accordion.Header>
);

export const AccordionContent = ({
  children,
  className,
  ...props
}: AccordionContentProps) => (
  <Accordion.Content
    className={`bg-mauve2 text-mauve11 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown overflow-hidden text-[15px] ${className}`}
    {...props}
  >
    <div className="px-5 py-[15px]">{children}</div>
  </Accordion.Content>
);