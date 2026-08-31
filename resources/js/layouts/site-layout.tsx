import SiteHeader from "@/components/site/site-header";
import SiteFooter from "@/components/site/site-footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="site-shell">
            <SiteHeader />
            {children}
            <SiteFooter />
        </div>
    );
}