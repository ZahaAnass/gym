import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, ShieldAlert, Users, Dumbbell, CreditCard, TrendingUp, BookOpen, Target, Megaphone } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const roles = auth.user?.roles || [];

    const menuItems = [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    ];

    if (roles.includes('admin')) {
        menuItems.push(
            { title: 'User Management', href: '/admin/users', icon: Users },
            { title: 'Unpaid List', href: '/admin/unpaid', icon: CreditCard },
            { title: 'Public Content', href: '/admin/content', icon: Megaphone }, // <-- Added
            { title: 'System Logs', href: '/admin/logs', icon: ShieldAlert }
        );
    }

    if (roles.includes('coach')) {
        menuItems.push(
            { title: 'My Clients', href: '/coach/clients', icon: Users },
            { title: 'Programs', href: '/coach/programs', icon: Dumbbell },
            { title: 'Class Planning', href: '/coach/sessions', icon: BookOpen }
        );
    }

    if (roles.includes('client')) {
        menuItems.push(
            { title: 'Progress', href: '/client/progress', icon: TrendingUp },
            { title: 'My Goals', href: '/client/goals', icon: Target },
            { title: 'Payments', href: '/client/payments', icon: CreditCard }
        );
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu><SidebarMenuItem><SidebarMenuButton size="lg" asChild><Link href="/dashboard"><AppLogo /></Link></SidebarMenuButton></SidebarMenuItem></SidebarMenu>
            </SidebarHeader>
            <SidebarContent><NavMain items={menuItems} /></SidebarContent>
            <SidebarFooter><NavUser /></SidebarFooter>
        </Sidebar>
    );
}
