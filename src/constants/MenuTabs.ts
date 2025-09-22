import { AppIcons } from "./AppIcons";
import { MenuTab } from "../models/MenuTabs.model";

export const MENU_TABS: MenuTab[] = [
  {
    name: "Home",
    label: "Home",
    icon: AppIcons.House,
  },
  {
    name: "Details",
    label: "Details",
    icon: AppIcons.FolderClock,
  },
  {
    name: "Profile",
    label: "Profile",
    icon: AppIcons.UserRound,
  },
];
