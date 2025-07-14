<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Replies extends Model
{
    use HasFactory;
    use Notifiable;
    use SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'details',
        'reply_owner_id',
        'ticket_id',
        'reply_id'
    ];

    protected $hidden = [
        'deleted_at',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'reply_owner_id');
    }

    public function ticket()
    {
        return $this->belongsTo(Tickets::class, 'ticket_id');
    }

    public function parent()
    {
        return $this->belongsTo(Replies::class, 'reply_id');
    }

    public function replies()
    {
        return $this->hasMany(Replies::class, 'reply_id')->orderByDesc('updated_at');
    }

    public static function booted()
    {
        static::creating(function ($table) {
            $table->id = (string) Str::uuid();
        });
    }
}
