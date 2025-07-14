<?php

namespace App\Http\Controllers;

use App\Models\Tickets;
use App\Models\ModeOfAddressing;
use App\Models\ModeOfAddressingTicket;
use App\Models\User;
use App\Models\AssignedTo;
use App\Models\Replies;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Inertia\Response as InertiaResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Attributes\RoleAccess;

class TicketsController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $ticketId = $request->query('ticket');
        $filterBy = $request->query('filterBy');

        // start of Ticket Query Setup
        $ticketQuery = Tickets::with(['replies.owner', 'owner', 'in_charge', 'modeOfAddressings', 'assignedTos'])
            ->leftJoinSub(
                DB::table('replies')
                    ->select('ticket_id', DB::raw('MAX(created_at) as latest_reply_at'))
                    ->groupBy('ticket_id'),
                'latest_replies',
                'tickets.id',
                '=',
                'latest_replies.ticket_id'
            )
            ->select('tickets.*', 'latest_replies.latest_reply_at');

        // start of Ticket Visibility Filter (Non-Superstaff)
        if (!$user->isSuperStaff()) {
            $ticketQuery->where(function ($query) use ($user) {
                $query->where('ticket_owner_id', $user->id)
                    ->orWhereHas('assignedTos', function ($q) use ($user) {
                        $q->where('assigned_to_id', $user->id);
                    });
            });
        }
        // end of Ticket Visibility Filter (Non-Superstaff)

        // start of Ticket Status Filter
        if ($filterBy) {
            $ticketQuery->where('status', $filterBy);
        }
        // end of Ticket Status Filter

        $tickets = $ticketQuery
            ->orderByRaw("FIELD(status, 'open', 'on-going', 'resolved', 'rejected')")
            ->orderByDesc(DB::raw('COALESCE(latest_replies.latest_reply_at, tickets.created_at)'))
            ->get();
        // end of Ticket Query Setup

        // start of Selected Ticket Fetch (with visibility check)
        $selectedTicket = null;
        if ($ticketId) {
            $selectedTicketQuery = Tickets::with(['replies.owner', 'replies.replies.owner', 'replies.replies.replies.owner', 'owner', 'in_charge', 'modeOfAddressings', 'assignedTos']);

            if (!$user->isSuperStaff()) {
                $selectedTicketQuery->where(function ($query) use ($user) {
                    $query->where('ticket_owner_id', $user->id)
                        ->orWhereHas('assignedTos', function ($q) use ($user) {
                            $q->where('assigned_to_id', $user->id);
                        });
                });
            }

            $selectedTicket = $selectedTicketQuery->find($ticketId);
        }
        // end of Selected Ticket Fetch (with visibility check)

        // start of Mode of Addressing Fetch
        $modeOfAddressings = ModeOfAddressing::select('id', 'sort_order', 'mode')->orderBy('sort_order')->get();
        // end of Mode of Addressing Fetch

        // start of Status Counts Grouping (scoped by user if not superstaff)
        $statusCountsQuery = Tickets::select('status', DB::raw('count(*) as count'));

        if (!$user->isSuperStaff()) {
            $statusCountsQuery->where(function ($query) use ($user) {
                $query->where('ticket_owner_id', $user->id)
                    ->orWhereHas('assignedTos', function ($q) use ($user) {
                        $q->where('assigned_to_id', $user->id);
                    });
            });
        }

        $statusCounts = $statusCountsQuery->groupBy('status')->pluck('count', 'status');
        // end of Status Counts Grouping

        // start of Users List (for assigning/tags/etc.)
        $users = User::whereHas('roles', function ($query) {
            $query->where('for_admin', true);
        })
        ->select('id', 'name', 'email')
        ->get();
        // end of Users List

        return Inertia::render('tickets/index', [
            'tickets' => $tickets,
            'selectedTicket' => $selectedTicket,
            'modeOfAddressings' => $modeOfAddressings,
            'statusCounts' => $statusCounts,
            'users' => $users
        ]);
    }

    #[RoleAccess('/a/tickets', 'can_update')]
    public function updateClientType(Request $request)
    {
        $validated = $request->validate([
            'ticketId' => 'required|uuid|exists:tickets,id',
            'clientType' => 'required|string|in:student,parent,hei_personnel,other_stakeholders',
        ]);

        $ticket = Tickets::findOrFail($validated['ticketId']);
        $ticket->client_type = $validated['clientType'];
        $ticket->save();

        return redirect()->back()->with('success', 'Ticket updated successfully.');
    }

    #[RoleAccess('/a/tickets', 'can_update')]
    public function updateModeOfAddressing(Request $request)
    {
        $validated = $request->validate([
            'ticketId' => 'required|uuid|exists:tickets,id',
            'modeId' => 'required|uuid|exists:mode_of_addressings,id',
            'checked' => 'required|boolean',
        ]);


        if ($validated['checked']) {
            ModeOfAddressingTicket::firstOrCreate([
                'ticket_id' => $validated['ticketId'],
                'mode_of_addressing_id' => $validated['modeId'],
            ], [
                'added_by' => auth()->id(),
            ]);
        } else {
            ModeOfAddressingTicket::where('ticket_id', $validated['ticketId'])
                ->where('mode_of_addressing_id', $validated['modeId'])
                ->forceDelete();
        }

        return redirect()->back()->with('success', 'Ticket updated successfully.');
    }

    #[RoleAccess('/a/tickets', 'can_assign')]
    public function updateAssignedTo(Request $request)
    {
        $validated = $request->validate([
            'ticketId' => 'required|uuid|exists:tickets,id',
            'userId' => 'required|uuid|exists:users,id',
            'checked' => 'required|boolean',
        ]);

        if ($validated['checked']) {
            AssignedTo::firstOrCreate([
                'ticket_id' => $validated['ticketId'],
                'assigned_to_id' => $validated['userId'],
            ], [
                'assigned_by_id' => auth()->id(),
            ]);
        } else {
            AssignedTo::where('ticket_id', $validated['ticketId'])
                ->where('assigned_to_id', $validated['userId'])
                ->forceDelete();
        }

        return redirect()->back()->with('success', 'Ticket updated successfully.');
    }

    #[RoleAccess('/a/tickets', 'can_update')]
    public function updateStatus(Request $request)
    {
        $validated = $request->validate([
            'ticketId' => 'required|uuid|exists:tickets,id',
            'status' => 'required|string|in:open,resolved,rejected',
        ]);

        $ticket = Tickets::findOrFail($validated['ticketId']);
        $ticket->status = $validated['status'];
        $ticket->save();

        return redirect()->back()->with('success', 'Ticket updated successfully.');
    }

    public function addReply(Request $request)
    {
        $validated = $request->validate([
            'ticketId' => 'required|uuid|exists:tickets,id',
            'details' => 'required|string',
        ]);

        Replies::create([
            'ticket_id' => $validated['ticketId'],
            'reply_owner_id' => auth()->id(),
            'details' => $validated['details'],
        ]);

        $ticket = Tickets::findOrFail($validated['ticketId']);

        if ($ticket->status === 'open') {
            $ticket->status = 'on-going';
            $ticket->save();
        }

        return redirect()->back()->with('success', 'Reply added and ticket marked as on-going.');
    }

    public function addChildReply(Request $request)
    {
        $ticketId = $request->route('ticketId');
        $replyId = $request->route('replyId');

        $validated = $request->validate([
            'details' => 'required|string',
         ]);

        Replies::create([
            'ticket_id' => $ticketId,
            'reply_id' => $replyId,
            'reply_owner_id' => auth()->id(),
            'details' => $validated['details'],
        ]);

        $ticket = Tickets::findOrFail($ticketId);

        if ($ticket->status === 'open') {
            $ticket->status = 'on-going';
            $ticket->save();
        }

        return redirect()->back()->with('success', 'Reply added and ticket marked as on-going.');
    }

    public function createTicket(Request $request)
    {
        return Inertia::render('tickets/create-ticket');
    }

    public function submitCreateTicket(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'details' => 'required|string',
        ]);

        $ticketNumber = implode('-', [
            rand(100, 999),
            rand(100, 999),
            rand(100, 999),
        ]);

        $ticket = Tickets::create([
            'ticket_number'    => $ticketNumber,
            'title'            => $validated['title'],
            'details'          => $validated['details'],
            'ticket_owner_id'  => auth()->id(),
            'created_at'       => now(),
            'updated_at'       => now(),
        ]);

        return redirect()->to('/a/tickets/?ticket=' . $ticket->id)->with('success', 'Ticket created successfully.');
    }
}
