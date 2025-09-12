import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import {Image} from "@heroui/image";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  
  return (
    <HeroUINavbar
      maxWidth="2xl"
      position="sticky"
      className="bg-transparent backdrop-blur-md bg-opacity-60 rounded-lg shadow-lg lg:w-[80%] xl:w-[70%] mx-auto z-50 mt-0 sm:mt-4 dark:bg-[#18181b]"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
      <NavbarBrand className="gap-3 max-w-fit">
        <Link
        className="flex justify-start items-center"
        color="foreground"
        href="/"
        >
        <Image src={"./public/favicon.png"} alt="Chronos Logo" className="w-8 h-8 mr-2"/>
        <h1 className="font-bold text-inherit">CHRONOS</h1>
        </Link>
      </NavbarBrand>
      </NavbarContent>

      <NavbarContent
      className="hidden sm:flex basis-1/5 sm:basis-full"
      justify="end"
      >
      <ThemeSwitch />
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
      <ThemeSwitch />
      <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
      <div className="mx-4 mt-2 flex flex-col gap-2">
        {siteConfig.navMenuItems.map((item, index) => (
        <NavbarMenuItem key={`${item}-${index}`}>
          <Link
          color={
            index === 2
            ? "primary"
            : index === siteConfig.navMenuItems.length - 1
              ? "danger"
              : "foreground"
          }
          href="#"
          size="lg"
          >
          {item.label}
          </Link>
        </NavbarMenuItem>
        ))}
      </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};