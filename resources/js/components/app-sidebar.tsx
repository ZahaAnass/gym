import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid, ShieldAlert, Users, Dumbbell, CreditCard, TrendingUp, BookOpen, Target, Megaphone, Calendar, Send, BellRing
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useAppLanguage } from '@/hooks/use-app-language';
import { getDictionary } from '@/lang';

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const { language, isRTL } = useAppLanguage();
    const t = getDictionary(language).sidebar;
    const roles = auth.user?.roles || [];

    // 🔥 Grab the subscription status from the backend (defaults to true for admins/coaches)
    const hasActiveSub = auth.user?.has_active_subscription ?? true;

    const hasRole = (roleName: string) => {
        return roles.some((role: any) => role.name === roleName || role === roleName);
    };

    const unreadCount = auth.user?.unreadNotificationsCount || 0;

    // 🔥 FIXED: Added disabled state to Dashboard and Notifications
    const menuItems: Array<{
        title: string;
        href: string;
        icon: any;
        disabled?: boolean;
        badge?: number;
    }> = [
        { title: t.dashboard, href: '/dashboard', icon: LayoutGrid, disabled: !hasActiveSub },
        { title: t.inboxAlerts, href: '/notifications', icon: BellRing, badge: unreadCount > 0 ? unreadCount : undefined, disabled: !hasActiveSub },
    ];

    if (hasRole('admin')) {
        menuItems.push(
            { title: t.userDirectory, href: '/admin/users', icon: Users },
            { title: t.financials, href: '/admin/unpaid', icon: CreditCard },
            { title: t.broadcastAlerts, href: '/admin/notifications', icon: Send },
            { title: t.landingCms, href: '/admin/content', icon: Megaphone },
            { title: t.systemLogs, href: '/admin/logs', icon: ShieldAlert }
        );
    }

    if (hasRole('coach')) {
        menuItems.push(
            { title: t.myClients, href: '/coach/clients', icon: Users },
            { title: t.aiPrograms, href: '/coach/programs', icon: Dumbbell },
            { title: t.myCalendar, href: '/coach/schedule', icon: Calendar },
            { title: t.sessionNotes, href: '/coach/sessions', icon: BookOpen }
        );
    }

    if (hasRole('client')) {
        menuItems.push(
            { title: t.progressAi, href: '/client/progress', icon: TrendingUp, disabled: !hasActiveSub },
            { title: t.mySchedule, href: '/client/schedule', icon: Calendar, disabled: !hasActiveSub },
            { title: t.myPrograms, href: '/client/programs', icon: Dumbbell, disabled: !hasActiveSub },
            { title: t.myGoals, href: '/client/goals', icon: Target, disabled: !hasActiveSub },
            // 🟢 The billing page is NEVER disabled so they can always pay!
            { badge: undefined, disabled: false, title: t.billingPayments, href: '/client/payments', icon: CreditCard }
        );
    }

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            side="left"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            {/* We don't disable the logo link here, because clicking it redirects to dashboard,
                                and your backend middleware will auto-redirect unpaid users back to billing! */}
                            <Link href="/dashboard"><AppLogo /></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={menuItems} sectionTitle={t.section} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
