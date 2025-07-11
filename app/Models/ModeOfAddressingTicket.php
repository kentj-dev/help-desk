<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class ModeOfAddressingTicket extends Model
{
    use HasFactory;
    use Notifiable;
    use SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'mode_of_addressing_id',
        'ticket_id',
        'added_by',
    ];

    protected $hidden = [
        'deleted_at',
    ];

    public function modesOfAddressing()
    {
        return $this->belongsToMany(ModeOfAddressing::class, 'mode_of_addressing_ticket');
    }

    public function tickets()
    {
        return $this->belongsToMany(Tickets::class, 'mode_of_addressing_ticket');
    }

    public static function booted()
    {
        static::creating(function ($table) {
            $table->id = (string) Str::uuid();
        });
    }
}
