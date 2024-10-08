<?php

// App\Events\MessageDeleted.php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class MessageDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $chatId;
    public $messageId;
    public $wasUnreadByAnyUser;

    public function __construct($chatId, $messageId, $wasUnreadByAnyUser)
    {
        $this->chatId = $chatId;
        $this->messageId = $messageId;
        $this->wasUnreadByAnyUser = $wasUnreadByAnyUser;
    }

    public function broadcastOn()
    {
        return new Channel('global');
    }

    public function broadcastAs()
    {
        return 'message-deleted';
    }

    public function broadcastWith()
    {
        return [
            'chatId' => $this->chatId,
            'messageId' => $this->messageId,
            'wasUnreadByAnyUser' => $this->wasUnreadByAnyUser,
        ];
    }
}
