<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NotificationsUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $userId;
    public $chatId;
    public $unreadCount;

    public function __construct($userId, $chatId, $unreadCount)
    {
        $this->userId = $userId;
        $this->chatId = $chatId;
        $this->unreadCount = $unreadCount;
    }

    public function broadcastOn()
    {
        return new Channel('global');
    }

    public function broadcastWith()
    {
        return [
            'user_id' => $this->userId,
            'chat_id' => $this->chatId,
            'unread_count' => $this->unreadCount,
        ];
    }
}
