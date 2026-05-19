import { AlertDialog } from "radix-ui";

export const DeleteList = ({
  title,
  subtitle,
  onDeleteHandler,
}: {
  title: string;
  subtitle?: string;
  onDeleteHandler: () => void;
}) => {
  return (
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 bg-black/50" />
      <AlertDialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-md bg-blue-500 p-6 text-white shadow-xl outline-none">
        <AlertDialog.Title className="text-lg font-bold">
          {title}
        </AlertDialog.Title>
        <AlertDialog.Description className="mt-2 text-sm text-blue-200">
          {subtitle}
        </AlertDialog.Description>
        <div className={"mt-6 flex justify-end gap-3"}>
          <AlertDialog.Cancel asChild>
            <button
              type={"button"}
              className={
                "cursor-pointer rounded-md border border-blue-400 px-4 py-2 text-sm font-medium text-blue-100 hover:bg-blue-900 focus:outline-none"
              }
            >
              Cancel
            </button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <button
              type={"button"}
              onClick={onDeleteHandler}
              className={
                "cursor-rounded cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-red-500 hover:text-white focus:outline-none"
              }
            >
              Delete
            </button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  );
};