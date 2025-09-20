import { useEffect } from "react";

export function useScrollToItem(
  selectedItemId: string | number | null,
  activeMenu: string,
) {
  useEffect(() => {
    if (selectedItemId && activeMenu) {
      const itemElement = document.getElementById(
        `menu-item-${selectedItemId}`,
      );
      if (itemElement) {
        itemElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedItemId, activeMenu]);
}
