<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

// We add "ShouldQueue" so sending the email doesn't freeze the website while loading!
class SystemBroadcast extends Notification implements ShouldQueue
{
    use Queueable;

    public $title;
    public $message;
    public $type;
    public $actionUrl;
    public $actionText;

    public function __construct($title, $message, $type = 'info', $actionUrl = null, $actionText = null)
    {
        $this->title = $title;
        $this->message = $message;
        $this->type = $type;
        $this->actionUrl = $actionUrl;
        $this->actionText = $actionText;
    }

    /**
     * Get the notification's delivery channels.
     * Now it sends to BOTH the database (Bell Icon) AND real Email!
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Generate the beautiful Email Template
     */
    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject('AI Gym Notification: ' . $this->title)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line($this->message);

        // If we provided a button (like "Pay Now"), add it to the email
        if ($this->actionUrl && $this->actionText) {
            $mail->action($this->actionText, $this->actionUrl);
        }

        $mail->line('Thank you for being part of AI Gym!');

        return $mail;
    }

    /**
     * Save to the database (for the React Bell Icon)
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => $this->title,
            'message' => $this->message,
            'type' => $this->type,
            'action_url' => $this->actionUrl,
            'action_text' => $this->actionText,
        ];
    }
}
