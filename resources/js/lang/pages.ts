import type { AppLanguage } from '@/lang';

const pages = {
    en: {
        notifications: {
            dashboard: 'Dashboard', notifications: 'Notifications', head: 'Notifications',
            subtitle: 'Stay updated on your gym activities, payments, and AI programs.',
            markAll: 'Mark all as read', inbox: 'Inbox', new: 'New',
            caughtUp: "You're all caught up!", noNew: 'No new notifications to show right now.',
            systemNotification: 'System Notification', defaultMessage: 'You have a new update in your portal.',
            viewDetails: 'View details', markRead: 'Mark as read', justNow: 'Just now',
        },
        clientGoals: {
            dashboard: 'Dashboard', myGoals: 'My Goals', head: 'My Goals & AI Advice', title: 'Personal Objectives', subtitle: 'Set targets, track your progress, and get AI-powered coaching strategies.', totalGoals: 'Total Goals', inProgress: 'In Progress', achieved: 'Achieved', noGoals: 'No goals set yet', noGoalsSub: 'Create your first fitness objective to start tracking your progress and unlock AI coaching.', deadline: 'Deadline', current: 'Current', target: 'Target', strategyPlan: 'Gemini Strategy Plan', logProgress: 'Log Progress', analyzing: 'Analyzing...', refreshStrategy: 'Refresh Strategy', getStrategy: 'Get AI Strategy', createGoal: 'Create New Goal', createGoalSub: 'Define a measurable target.', goalDesc: 'Goal Description', numericTarget: 'Numeric Target Value', numericHint: "Must be a number. We'll track your progress against this.", targetDate: 'Target Date', saveObjective: 'Save Objective', progressPrompt: 'Enter your new current progress value:', deleteConfirm: 'Are you sure you want to delete this goal?'
        },
        clientProgress: {
            myProgress: 'My Progress', head: 'Progress Analytics', title: 'My Analytics Dashboard', currentWeight: 'Current Weight', attendanceRate: 'Attendance Rate', activeGoals: 'Active Goals', bioTrends: 'Biometric Trends', noAssessments: 'No assessment data available yet.', coachGoals: 'Coach-Assigned Goals', noCoachGoals: 'Your coach has not assigned any goals yet.', achieved: 'Achieved', targetDate: 'Target Date', qualitative: 'Qualitative Goal (Behavioral)', aiStrategy: 'AI Strategy:'
        },
    },
    fr: {
        notifications: {
            dashboard: 'Tableau', notifications: 'Notifications', head: 'Notifications',
            subtitle: 'Restez informe de vos activites, paiements et programmes IA.',
            markAll: 'Tout marquer comme lu', inbox: 'Boite de reception', new: 'Nouveau',
            caughtUp: 'Vous etes a jour !', noNew: 'Aucune nouvelle notification pour le moment.',
            systemNotification: 'Notification systeme', defaultMessage: 'Vous avez une nouvelle mise a jour sur votre portail.',
            viewDetails: 'Voir les details', markRead: 'Marquer comme lu', justNow: 'A l instant',
        },
        clientGoals: {
            dashboard: 'Tableau', myGoals: 'Mes objectifs', head: 'Mes objectifs & conseils IA', title: 'Objectifs personnels', subtitle: 'Definissez vos cibles, suivez votre progression et obtenez des strategies IA.', totalGoals: 'Total objectifs', inProgress: 'En cours', achieved: 'Atteints', noGoals: 'Aucun objectif pour le moment', noGoalsSub: 'Creez votre premier objectif fitness pour suivre votre progression.', deadline: 'Echeance', current: 'Actuel', target: 'Cible', strategyPlan: 'Plan de strategie Gemini', logProgress: 'Enregistrer progression', analyzing: 'Analyse...', refreshStrategy: 'Actualiser strategie', getStrategy: 'Obtenir strategie IA', createGoal: 'Creer un objectif', createGoalSub: 'Definissez un objectif mesurable.', goalDesc: "Description de l'objectif", numericTarget: 'Valeur cible numerique', numericHint: 'Doit etre un nombre. Nous suivrons votre progression.', targetDate: 'Date cible', saveObjective: "Enregistrer l'objectif", progressPrompt: 'Entrez votre nouvelle valeur de progression:', deleteConfirm: 'Confirmer la suppression de cet objectif ?'
        },
        clientProgress: {
            myProgress: 'Ma progression', head: 'Analytique progression', title: 'Mon tableau analytique', currentWeight: 'Poids actuel', attendanceRate: 'Taux de presence', activeGoals: 'Objectifs actifs', bioTrends: 'Tendances biometrie', noAssessments: "Aucune donnee d'evaluation disponible.", coachGoals: 'Objectifs attribues par le coach', noCoachGoals: "Votre coach n'a assigne aucun objectif.", achieved: 'Atteint', targetDate: 'Date cible', qualitative: 'Objectif qualitatif (comportemental)', aiStrategy: 'Strategie IA :'
        },
    },
    ar: {
        notifications: {
            dashboard: 'لوحة التحكم', notifications: 'الاشعارات', head: 'الاشعارات',
            subtitle: 'ابق على اطلاع بانشطتك، مدفوعاتك، وبرامج الذكاء الاصطناعي.',
            markAll: 'تحديد الكل كمقروء', inbox: 'صندوق الاشعارات', new: 'جديد',
            caughtUp: 'لا توجد اشعارات جديدة!', noNew: 'لا توجد اشعارات جديدة حاليا.',
            systemNotification: 'اشعار النظام', defaultMessage: 'لديك تحديث جديد في حسابك.',
            viewDetails: 'عرض التفاصيل', markRead: 'تحديد كمقروء', justNow: 'الان',
        },
        clientGoals: {
            dashboard: 'لوحة التحكم', myGoals: 'اهدافي', head: 'اهدافي ونصائح الذكاء الاصطناعي', title: 'اهدافي الشخصية', subtitle: 'حدد اهدافك وتابع تقدمك واحصل على استراتيجيات تدريب بالذكاء الاصطناعي.', totalGoals: 'اجمالي الاهداف', inProgress: 'قيد التقدم', achieved: 'تم تحقيقه', noGoals: 'لا توجد اهداف بعد', noGoalsSub: 'انشئ هدفك الاول لتتبع تقدمك والحصول على توجيه الذكاء الاصطناعي.', deadline: 'الموعد النهائي', current: 'الحالي', target: 'الهدف', strategyPlan: 'خطة Gemini الاستراتيجية', logProgress: 'تسجيل التقدم', analyzing: 'جاري التحليل...', refreshStrategy: 'تحديث الاستراتيجية', getStrategy: 'الحصول على استراتيجية AI', createGoal: 'انشاء هدف جديد', createGoalSub: 'حدد هدفا قابلا للقياس.', goalDesc: 'وصف الهدف', numericTarget: 'القيمة الرقمية المستهدفة', numericHint: 'يجب ان تكون رقما. سنقيس التقدم بناء عليها.', targetDate: 'تاريخ الهدف', saveObjective: 'حفظ الهدف', progressPrompt: 'ادخل قيمة تقدمك الحالية الجديدة:', deleteConfirm: 'هل تريد حذف هذا الهدف؟'
        },
        clientProgress: {
            myProgress: 'تقدمي', head: 'تحليلات التقدم', title: 'لوحة تحليلاتي', currentWeight: 'الوزن الحالي', attendanceRate: 'نسبة الحضور', activeGoals: 'اهداف نشطة', bioTrends: 'اتجاهات القياسات الحيوية', noAssessments: 'لا توجد بيانات تقييم بعد.', coachGoals: 'اهداف يحددها المدرب', noCoachGoals: 'لم يقم مدربك بتعيين اهداف بعد.', achieved: 'تم تحقيقه', targetDate: 'تاريخ الهدف', qualitative: 'هدف نوعي (سلوكي)', aiStrategy: 'استراتيجية الذكاء الاصطناعي:'
        },
    },
} as const;

export function getPageTranslations(language: AppLanguage) {
    return pages[language];
}

