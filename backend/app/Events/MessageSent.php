<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Support\Facades\Log;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
        // Log::info('MessageSent Event Constructed', ['message' => $message]);
    }

    public function broadcastOn()
    {
        return new PrivateChannel('chat.' . $this->message->chat_id);
    }

    public function broadcastWith()
    {
        $user = $this->message->users->where('pivot.sender', true)->first();
        Log::info('MessageSent Event Broadcasting', [
            'id' => $this->message->id,
            'chat_id' => $this->message->chat_id,
            'message' => $this->message->message,
            'file_url' => $this->message->file_url,
            'send_at' => $this->message->send_at->toDateTimeString(),
            'sender_id' => $user->id,
        ]);

        return [
            'id' => $this->message->id,
            'chat_id' => $this->message->chat_id,
            'message' => $this->message->message,
            'file_url' => $this->message->file_url,
            'send_at' => $this->message->send_at->toDateTimeString(),
            'sender_id' => $user->id,
        ];
    }
}
