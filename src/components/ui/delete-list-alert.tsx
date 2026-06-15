import { AlertDialog } from "@base-ui/react/alert-dialog";

export const DeleteListDialog = ({
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
      <AlertDialog.Backdrop className="fixed inset-0 bg-black/50 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
      <AlertDialog.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-md bg-blue-950 p-6 text-white shadow-xl transition-all outline-none data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
        <AlertDialog.Title className="text-lg font-bold">
          {title}
        </AlertDialog.Title>
        <AlertDialog.Description className="mt-2 text-sm text-blue-200">
          {subtitle}
        </AlertDialog.Description>
        <div className={"mt-6 flex justify-end gap-3"}>
          <AlertDialog.Close
            className={
              "cursor-pointer rounded-md border border-blue-400 px-4 py-2 text-sm font-medium text-blue-100 hover:bg-blue-900 focus:outline-none"
            }
          >
            Cancel
          </AlertDialog.Close>
          <button
            type={"button"}
            onClick={onDeleteHandler}
            className={
              "cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none"
            }
          >
            Delete
          </button>
        </div>
      </AlertDialog.Popup>
    </AlertDialog.Portal>
  );
};