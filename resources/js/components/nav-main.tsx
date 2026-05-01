import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';

export function NavMain({ items = [] }: { items: any[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        {item.disabled ? (
                            /* 🔒 DISABLED STATE: No Link, just a disabled button */
                            <SidebarMenuButton
                                disabled
                                tooltip={{ children: item.title }}
                                className="opacity-50 cursor-not-allowed"
                            >
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                                {item.badge && (
                                    <span className="ml-auto bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </SidebarMenuButton>
                        ) : (
                            /* 🟢 ACTIVE STATE: Uses Inertia Link */
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl(item.href)}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    {item.badge && (
                                        <span className="ml-auto bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
