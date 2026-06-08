import { GroceryListAccordion } from "@/components/groceries/grocery-list-accordion";

const Groceries = async () => {
  // TODO: current list setter; different from new list
  // Current list toggle (only 1 at a time) will be a checklist
  // TODO: rename checklists to existing/previous grocery lists
  return (
    <div className="flex w-full flex-col overflow-scroll rounded-md drop-shadow-lg">
      <GroceryListAccordion />
    </div>
  );
};

export default Groceries;