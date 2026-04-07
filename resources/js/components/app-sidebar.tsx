import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    ShieldAlert,
    Users,
    Dumbbell,
    CreditCard,
    TrendingUp,
    BookOpen,
    Target,
    Megaphone,
    Calendar,
    Send,
    BellRing
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const roles = auth.user?.roles || [];

    // Calculate unread notifications if you pass it via Inertia share, otherwise keep it simple
    const unreadCount = auth.user?.unreadNotificationsCount || 0;

    const menuItems = [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
        { title: 'Inbox Alerts', href: '/notifications', icon: BellRing, badge: unreadCount > 0 ? unreadCount : undefined },
    ];

    if (roles.includes('admin')) {
        menuItems.push(
            { title: 'User Directory', href: '/admin/users', icon: Users },
            { title: 'Financials', href: '/admin/unpaid', icon: CreditCard },
            { title: 'Broadcast Alerts', href: '/admin/notifications', icon: Send },
            { title: 'Landing Page CMS', href: '/admin/content', icon: Megaphone },
            { title: 'System Logs', href: '/admin/logs', icon: ShieldAlert }
        );
    }

    if (roles.includes('coach')) {
        menuItems.push(
            { title: 'My Clients', href: '/coach/clients', icon: Users },
            { title: 'AI Programs', href: '/coach/programs', icon: Dumbbell },
            { title: 'My Calendar', href: '/coach/schedule', icon: Calendar },
            { title: 'Session Notes', href: '/coach/sessions', icon: BookOpen }
        );
    }

    if (roles.includes('client')) {
        menuItems.push(
            { title: 'Progress & AI', href: '/client/progress', icon: TrendingUp },
            { title: 'My Schedule', href: '/client/schedule', icon: Calendar },
            { title: 'My Goals', href: '/client/goals', icon: Target },
            { title: 'Billing & Payments', href: '/client/payments', icon: CreditCard }
        );
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
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
