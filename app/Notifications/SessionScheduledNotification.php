<?php

namespace App\Notifications;

use App\Models\Session;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SessionScheduledNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $session;

    /**
     * Create a new notification instance.
     */
    public function __construct(Session $session)
    {
        $this->session = $session;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        // We can add 'database' here later if you want in-app bell notifications too!
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $coachName = $this->session->coach->name ?? 'Your Coach';
        $date = $this->session->scheduled_at->format('l, F jS, Y');
        $time = $this->session->scheduled_at->format('g:i A');
        $programName = $this->session->program ? $this->session->program->title : 'Custom Session';

        return (new MailMessage)
            ->subject('New Training Session Scheduled: '.$this->session->title)
            ->greeting('Hello '.$notifiable->name.'!')
            ->line("{$coachName} has just scheduled a new training session for you.")
            ->line('**Session Details:**')
            ->line('- **Program:** '.$programName)
            ->line('- **Topic:** '.$this->session->title)
            ->line('- **Date:** '.$date)
            ->line('- **Time:** '.$time)
            ->line('- **Duration:** '.$this->session->duration_minutes.' minutes')
            ->action('View My Schedule', url('/client/schedule'))
            ->line('Make sure to arrive 5 minutes early. Let\'s crush those goals!');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'session_id' => $this->session->id,
            'title' => $this->session->title,
            'message' => 'New session scheduled for '.$this->session->scheduled_at->format('M d'),
        ];
    }
}
