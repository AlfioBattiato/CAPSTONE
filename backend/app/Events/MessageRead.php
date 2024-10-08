<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class MessageRead implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $messageIds;
    public $chatId;
    public $userId;

    public function __construct($messageIds, $chatId)
    {
        $this->messageIds = $messageIds;
        $this->chatId = $chatId;
        $this->userId = auth()->id();
    }

    public function broadcastOn()
    {
        return new PrivateChannel('chat.' . $this->chatId);
    }

    public function broadcastWith()
{
    return [
        'messageIds' => $this->messageIds,
        'userId' => $this->userId,
        'chatId' => $this->chatId,
    ];
}
}
