import { NavbarMenuItem } from "@heroui/navbar";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "CHRONOS",
  description: "Faça a gestão dos seus eventos de forma simples e eficiente.",
  navItems: [],
  navMenuItems: [
    { label: "Calendário", href: "/calendar" },
  ]
};