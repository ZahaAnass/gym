import { Head, Link, router, usePage } from "@inertiajs/react";
import { debounce } from "lodash";
import {
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Shield,
    Dumbbell,
    User as UserIcon,
    Users,
    Plus,
    Filter
} from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import DeleteDialog from "@/components/delete-dialog";
import InertiaPagination from "@/components/inertia-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppLanguage } from '@/hooks/use-app-language';
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/analytics' },
    { title: 'User Management', href: '/admin/users' },
];

export default function UsersIndex({ users, filters, coaches, stats }: any) {
    const { language, isRTL } = useAppLanguage();
    const t = {
        en: { head: 'User Management | Admin', title: 'Directory Management', subtitle: 'Manage platform access, roles, and client-coach assignments.', create: 'Create Account', search: 'Search by name or email...' },
        fr: { head: 'Gestion des utilisateurs | Admin', title: 'Gestion de l annuaire', subtitle: 'Gerez les acces, roles et affectations client-coach.', create: 'Creer un compte', search: 'Rechercher par nom ou email...' },
        ar: { head: 'ادارة المستخدمين | الادمن', title: 'ادارة الدليل', subtitle: 'ادارة صلاحيات المنصة والادوار وربط العملاء بالمدربين.', create: 'انشاء حساب', search: 'ابحث بالاسم او البريد...' },
    }[language];
    const { flash, auth } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
toast.success(flash.success);
}

        if (flash?.error) {
toast.error(flash.error);
}
    }, [flash]);

    // Debounced Search
    const handleSearch = useRef(debounce((q: string) => {
        router.get("/admin/users", { ...filters, search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    // Filter Handlers
    const handleRoleFilter = (role: string) => {
        router.get("/admin/users", { ...filters, role }, { preserveState: true, replace: true });
    };

    const handleCoachFilter = (coach_id: string) => {
        router.get("/admin/users", { ...filters, coach_id }, { preserveState: true, replace: true });
    };

    function deleteUser(id: number) {
        router.delete(`/admin/users/${id}`, { preserveScroll: true });
    }

    const getRoleBadge = (roles: any[]) => {
        if (!roles || roles.length === 0) {
return <Badge variant="outline">None</Badge>;
}

        const roleName = roles[0].name;

        if (roleName === 'admin') {
return <Badge className="bg-red-100 text-red-800 border-none dark:bg-red-500/10 dark:text-red-400"><Shield className="h-3 w-3 mr-1" /> Admin</Badge>;
}

        if (roleName === 'coach') {
return <Badge className="bg-lime-100 text-lime-800 border-none dark:bg-lime-500/10 dark:text-lime-400"><Dumbbell className="h-3 w-3 mr-1" /> Coach</Badge>;
}

        return <Badge className="bg-teal-100 text-teal-800 border-none dark:bg-teal-500/10 dark:text-teal-400"><UserIcon className="h-3 w-3 mr-1" /> Client</Badge>;
    };

    // Extract initials for avatars
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.head} />
            <div className="admin-page-container" dir={isRTL ? 'rtl' : 'ltr'}>

                {/* Header Section */}
                <div className="admin-page-header">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                            <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                            {t.title}
                        </h2>
                        <p className="admin-page-subtitle">{t.subtitle}</p>
                    </div>
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 rounded-xl">
                        <Link href="/admin/users/create">
                            <Plus className="mr-2 h-4 w-4"/> {t.create}
                        </Link>
                    </Button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm rounded-2xl">
                        <CardContent className="p-5 flex flex-col gap-1">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Users</span>
                            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.total}</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-teal-50/50 dark:bg-teal-500/5 border border-teal-100 dark:border-teal-500/10 shadow-sm rounded-2xl">
                        <CardContent className="p-5 flex flex-col gap-1">
                            <span className="text-sm font-medium text-teal-600 dark:text-teal-400">Active Clients</span>
                            <span className="text-3xl font-extrabold text-teal-700 dark:text-teal-300">{stats.clients}</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-lime-50/50 dark:bg-lime-500/5 border border-lime-100 dark:border-lime-500/10 shadow-sm rounded-2xl">
                        <CardContent className="p-5 flex flex-col gap-1">
                            <span className="text-sm font-medium text-lime-600 dark:text-lime-400">Certified Coaches</span>
                            <span className="text-3xl font-extrabold text-lime-700 dark:text-lime-300">{stats.coaches}</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-red-50/50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 shadow-sm rounded-2xl">
                        <CardContent className="p-5 flex flex-col gap-1">
                            <span className="text-sm font-medium text-red-600 dark:text-red-400">Administrators</span>
                            <span className="text-3xl font-extrabold text-red-700 dark:text-red-300">{stats.admins}</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Data Card */}
                <Card className="admin-surface overflow-hidden">

                    {/* Advanced Filter Toolbar */}
                    <div className="admin-toolbar flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Input
                                defaultValue={filters?.search ?? ""}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-10 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm h-11"
                                placeholder={t.search}
                            />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <Search size={18} />
                            </div>
                        </div>

                        <div className="flex w-full md:w-auto items-center gap-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mr-2 hidden md:flex">
                                <Filter size={16} /> Filters
                            </div>
                            <Select defaultValue={filters.role ?? "all"} onValueChange={handleRoleFilter}>
                                <SelectTrigger className="w-full md:w-[150px] bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl h-11">
                                    <SelectValue placeholder="Any Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Administrators</SelectItem>
                                    <SelectItem value="coach">Coaches</SelectItem>
                                    <SelectItem value="client">Clients</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select defaultValue={filters.coach_id ?? "all"} onValueChange={handleCoachFilter}>
                                <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl h-11">
                                    <SelectValue placeholder="Any Coach" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Assignments</SelectItem>
                                    <SelectItem value="unassigned">Unassigned Clients</SelectItem>
                                    {(Array.isArray(coaches) ? coaches : Object.values(coaches || {})).map((coach: any) => (
                                        <SelectItem key={coach.id} value={coach.id.toString()}>Coach: {coach.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow className="bg-slate-50/80 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 hover:bg-transparent">
                                        <TableHead className="pl-6 py-4 font-semibold text-slate-600 dark:text-slate-300">User Details</TableHead>
                                        <TableHead className="font-semibold text-slate-600 dark:text-slate-300">System Role</TableHead>
                                        <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Coach Assignment</TableHead>
                                        <TableHead className="text-right pr-6 font-semibold text-slate-600 dark:text-slate-300">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                    {users.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-16">
                                                <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                                                    <Search className="h-10 w-10 mb-3 opacity-20" />
                                                    <p className="text-base font-medium">No users match your criteria.</p>
                                                    <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.data.map((user: any) => (
                                            <TableRow key={user.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">

                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">
                                                            {getInitials(user.name)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-slate-900 dark:text-slate-100">{user.name}</span>
                                                            <span className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    {getRoleBadge(user.roles)}
                                                </TableCell>

                                                <TableCell>
                                                    {user.coach ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center">
                                                                <Dumbbell className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.coach.name}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-slate-400 dark:text-slate-600 italic">Not Assigned</span>
                                                    )}
                                                </TableCell>

                                                <TableCell className="text-right pr-6">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200 dark:hover:bg-zinc-800">
                                                                <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-200 dark:border-zinc-800 shadow-xl">
                                                            <DropdownMenuLabel className="text-xs uppercase text-slate-400 tracking-wider">Manage Account</DropdownMenuLabel>

                                                            <DropdownMenuItem asChild className="cursor-pointer">
                                                                <Link href={`/admin/users/${user.id}/edit`} className="w-full flex items-center">
                                                                    <Edit className="mr-2 h-4 w-4 text-slate-500" /> Edit Details
                                                                </Link>
                                                            </DropdownMenuItem>

                                                            <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />

                                                            {user.id !== auth.user.id ? (
                                                                <DeleteDialog
                                                                    title="Delete Account"
                                                                    description={`Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`}
                                                                    onConfirm={() => deleteUser(user.id)}
                                                                >
                                                                    <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-red-50 hover:text-red-900 text-red-600 dark:hover:bg-red-500/10 dark:text-red-400">
                                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                                                                    </div>
                                                                </DeleteDialog>
                                                            ) : (
                                                                <div className="relative flex items-center px-2 py-1.5 text-sm text-slate-300 dark:text-zinc-600 cursor-not-allowed" title="You cannot delete your own account.">
                                                                    <Shield className="mr-2 h-4 w-4" /> Active Admin
                                                                </div>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>

                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                <div className="mt-6">
                    <InertiaPagination data={users} />
                </div>

            </div>
        </AppLayout>
    );
}
