// Secured from the vulnerability of _blank, used in /about
export const openInNewTab = (url?: string): void => {
  if (!url) return;
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
  return;
};

export const onClickUrl =
  (url?: string): (() => void) =>
  () => {
    if (!url) return;
    openInNewTab(url);
  };
