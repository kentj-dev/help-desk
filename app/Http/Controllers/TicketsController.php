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

class TicketsController extends Controller
{
    public function index(Request $request)
    {
        $ticketId = $request->query('ticketId');
        $filterBy = $request->query('filterBy');

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

        if ($filterBy) {
            $ticketQuery->where('status', $filterBy);
        }

        $tickets = $ticketQuery
            ->orderByDesc(DB::raw('COALESCE(latest_replies.latest_reply_at, tickets.created_at)'))
            ->get();

        $selectedTicket = null;
        if ($ticketId) {
            $selectedTicket = Tickets::with(['replies.owner', 'owner', 'in_charge', 'modeOfAddressings', 'assignedTos'])
                ->find($ticketId);
        }

        $modeOfAddressings = ModeOfAddressing::select('id', 'sort_order', 'mode')->orderBy('sort_order')->get();

        $statusCounts = Tickets::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $users = User::select('id', 'name', 'email')->get();

        return Inertia::render('tickets/index', [
            'tickets' => $tickets,
            'selectedTicket' => $selectedTicket,
            'modeOfAddressings' => $modeOfAddressings,
            'statusCounts' => $statusCounts,
            'users' => $users
        ]);
    }

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

        return redirect()->to('/?ticketId=' . $ticket->id)->with('success', 'Ticket created successfully.');
    }
}
