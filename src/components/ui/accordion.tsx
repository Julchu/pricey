import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Accordion } from "radix-ui";
import {
  AccordionContentProps,
  AccordionHeaderProps,
  AccordionItemProps,
  AccordionTriggerProps,
} from "@radix-ui/react-accordion";

export const AccordionItem = ({
  children,
  className,
  ...props
}: AccordionItemProps) => {
  return (
    <Accordion.Item className={`focus-within:z-10 ${className} `} {...props}>
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
    className={`sticky top-0 z-1 flex w-full flex-row bg-blue-500 ${className} `}
    {...props}
  >
    {children}
  </Accordion.Header>
);

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
      className="ml-auto text-white transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
      aria-hidden
    />
  </Accordion.Trigger>
);

export const AccordionContent = ({
  children,
  className,
  ...props
}: AccordionContentProps) => (
  <Accordion.Content
    className={`bg-mauve2 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown ${className}`}
    {...props}
  >
    {children}
  </Accordion.Content>
);

export const AccordionSubheader = ({
  ingredientsLength,
  dateString,
}: {
  ingredientsLength: number;
  dateString: string;
}) => {
  return (
    <div className={"flex flex-row items-center px-4 pb-2 text-sm font-medium"}>
      <p>
        {ingredientsLength > 1 || ingredientsLength === 0
          ? `${ingredientsLength} ingredients`
          : "1 ingredient"}
        &nbsp;&mdash; {dateString}
      </p>
    </div>
  );
};