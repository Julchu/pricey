import { GroceryListAccordion } from "@/components/groceries/grocery-list-accordion";

const Groceries = async () => {
  return (
    <div className="flex w-full flex-col overflow-scroll rounded-md pb-4 md:flex-row">
      <GroceryListAccordion />
    </div>
  );
};

export default Groceries;