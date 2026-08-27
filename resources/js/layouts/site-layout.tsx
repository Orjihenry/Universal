import HeaderLayout from "./header-layout";
import FooterLayout from "./footer-layout";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <HeaderLayout />
            {children}
            <FooterLayout />
        </>
    );
}