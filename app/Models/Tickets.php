<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Tickets extends Model
{
    use HasFactory;
    use Notifiable;
    use SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'ticket_number',
        'status',
        'title',
        'details',
        'ticket_owner_id',
        'ticket_in_charge_id',
        'date_received_by_in_charge',
    ];

    protected $hidden = [
        'deleted_at',
    ];

    public function replies()
    {
        return $this->hasMany(Replies::class, 'ticket_id')->orderBy('created_at', 'desc');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'ticket_owner_id');
    }

    public function in_charge()
    {
        return $this->belongsTo(User::class, 'ticket_in_charge_id');
    }

    public function modeOfAddressings()
    {
        return $this->hasMany(ModeOfAddressingTicket::class, 'ticket_id');
    }

    public function assignedTos()
    {
        return $this->hasMany(AssignedTo::class, 'ticket_id');
    }

    public static function booted()
    {
        static::creating(function ($table) {
            $table->id = (string) Str::uuid();
        });
    }
}
