import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid, ShieldAlert, Users, Dumbbell, CreditCard, TrendingUp, BookOpen, Target, Megaphone, Calendar, Send, BellRing
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const roles = auth.user?.roles || [];

    // 🔥 Grab the subscription status from the backend (defaults to true for admins/coaches)
    const hasActiveSub = auth.user?.has_active_subscription ?? true;

    const hasRole = (roleName: string) => {
        return roles.some((role: any) => role.name === roleName || role === roleName);
    };

    const unreadCount = auth.user?.unreadNotificationsCount || 0;

    // 🔥 FIXED: Added disabled state to Dashboard and Notifications
    const menuItems = [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid, disabled: !hasActiveSub },
        { title: 'Inbox Alerts', href: '/notifications', icon: BellRing, badge: unreadCount > 0 ? unreadCount : undefined, disabled: !hasActiveSub },
    ];

    if (hasRole('admin')) {
        menuItems.push(
            { title: 'User Directory', href: '/admin/users', icon: Users },
            { title: 'Financials', href: '/admin/unpaid', icon: CreditCard },
            { title: 'Broadcast Alerts', href: '/admin/notifications', icon: Send },
            { title: 'Landing Page CMS', href: '/admin/content', icon: Megaphone },
            { title: 'System Logs', href: '/admin/logs', icon: ShieldAlert }
        );
    }

    if (hasRole('coach')) {
        menuItems.push(
            { title: 'My Clients', href: '/coach/clients', icon: Users },
            { title: 'AI Programs', href: '/coach/programs', icon: Dumbbell },
            { title: 'My Calendar', href: '/coach/schedule', icon: Calendar },
            { title: 'Session Notes', href: '/coach/sessions', icon: BookOpen }
        );
    }

    if (hasRole('client')) {
        menuItems.push(
            { title: 'Progress & AI', href: '/client/progress', icon: TrendingUp, disabled: !hasActiveSub },
            { title: 'My Schedule', href: '/client/schedule', icon: Calendar, disabled: !hasActiveSub },
            { title: "My Programs", href: "/client/programs", icon: Dumbbell, disabled: !hasActiveSub },
            { title: 'My Goals', href: '/client/goals', icon: Target, disabled: !hasActiveSub },
            // 🟢 The billing page is NEVER disabled so they can always pay!
            { badge: undefined, disabled: false, title: 'Billing & Payments', href: '/client/payments', icon: CreditCard }
        );
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
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
                <NavMain items={menuItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
