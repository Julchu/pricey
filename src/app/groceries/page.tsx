import { GroceryListAccordion } from "@/components/groceries/grocery-list-accordion";

const Groceries = async () => {
  return (
    <div className="flex h-full flex-col md:flex-row">
      <GroceryListAccordion />
    </div>
  );
};

export default Groceries;
