import { usePermissions } from '@/hooks/use-permissions';
import { ModeOfAddresing, Ticket } from '@/pages/tickets';
import { User } from '@/types';
import { router } from '@inertiajs/react';
import { LockKeyholeOpen, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface TicketsActionProps {
    selectedTicket: Ticket;
    modeOfAddressings: ModeOfAddresing[];
    users: User[];
}

export default function TicketsAction({ selectedTicket, modeOfAddressings, users }: TicketsActionProps) {
    const { canAssign, canUpdate } = usePermissions();

    const [isUpdatingClientType, setIsUpdatingClientType] = useState(false);
    const [isUpdatingModeOfAddressing, setIsUpdatingModeOfAddressing] = useState(false);
    const [isUpdatingAssignedTo, setIsUpdatingAssignedTo] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleClientTypeChange = (selected: string) => {
        setIsUpdatingClientType(true);
        const payload = {
            ticketId: selectedTicket?.id ?? '',
            clientType: selected,
        };

        const promise = new Promise<void>((resolve, reject) => {
            router.post(route('update.client-type'), payload, {
                preserveScroll: true,
                onSuccess: () => resolve(),
                onError: () => reject(),
            });
        });

        toast.promise(promise, {
            loading: 'Updating client type...',
            success: 'Client type updated!',
            error: 'Failed to update client type!',
            duration: 5000,
        });

        promise.finally(() => {
            setIsUpdatingClientType(false);
        });
    };

    const handleModeOfAddressingChange = (modeId: string, checked: boolean | string) => {
        setIsUpdatingModeOfAddressing(true);
        const payload = {
            ticketId: selectedTicket?.id ?? '',
            modeId: modeId,
            checked: checked,
        };

        const promise = new Promise<void>((resolve, reject) => {
            router.post(route('update.mode-of-addressing'), payload, {
                preserveScroll: true,
                onSuccess: () => resolve(),
                onError: () => reject(),
            });
        });

        toast.promise(promise, {
            loading: 'Updating mode of addressing...',
            success: 'Mode of addressing updated!',
            error: 'Failed to update mode of addressing!',
            duration: 5000,
        });

        promise.finally(() => {
            setIsUpdatingModeOfAddressing(false);
        });
    };

    const handleAssignedToChange = (userId: string, checked: boolean | string) => {
        setIsUpdatingAssignedTo(true);
        const payload = {
            ticketId: selectedTicket?.id ?? '',
            userId: userId,
            checked: checked,
        };

        const promise = new Promise<void>((resolve, reject) => {
            router.post(route('update.assigned-to'), payload, {
                preserveScroll: true,
                onSuccess: () => resolve(),
                onError: () => reject(),
            });
        });

        toast.promise(promise, {
            loading: 'Updating assigned to...',
            success: 'Assigned to updated!',
            error: 'Failed to update assigned to!',
            duration: 5000,
        });

        promise.finally(() => {
            setIsUpdatingAssignedTo(false);
        });
    };

    const handleStatusChange = (status: string) => {
        setIsUpdatingStatus(true);
        const payload = {
            ticketId: selectedTicket?.id ?? '',
            status: status,
        };

        const promise = new Promise<void>((resolve, reject) => {
            router.post(route('update.status'), payload, {
                preserveScroll: true,
                onSuccess: () => resolve(),
                onError: () => reject(),
            });
        });

        toast.promise(promise, {
            loading: 'Updating status...',
            success: 'Status updated!',
            error: 'Failed to update status!',
            duration: 5000,
        });

        promise.finally(() => {
            setIsUpdatingStatus(false);
        });
    };

    return (
        <div className="sticky-0 top-12 flex h-auto flex-col gap-2 overflow-hidden md:sticky md:h-[calc(100vh-6rem)]">
            {canUpdate(['/tickets', '/a/tickets']) && (
                <>
                    <div className="text-sm text-gray-500">Client Type</div>
                    <div className="flex flex-col justify-between gap-2 rounded-md border border-gray-200 p-3 shadow-sm">
                        <RadioGroup
                            defaultValue={selectedTicket.client_type}
                            onValueChange={(e) => {
                                handleClientTypeChange(e);
                            }}
                            disabled={isUpdatingClientType}
                        >
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="student" id="student-radio" />
                                <Label htmlFor="student-radio" className="text-xs">
                                    Student
                                </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="parent" id="parent-radio" />
                                <Label htmlFor="parent-radio" className="text-xs">
                                    Parent
                                </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="hei_personnel" id="hei-personnel-radio" />
                                <Label htmlFor="hei-personnel-radio" className="text-xs">
                                    HEI Personnel
                                </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="other_stakeholders" id="other-stakeholders-radio" />
                                <Label htmlFor="other-stakeholders-radio" className="text-xs">
                                    Other Stakeholders
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </>
            )}

            {canUpdate(['/tickets', '/a/tickets']) && (
                <>
                    <div className="text-sm text-gray-500">Mode of Addressing</div>
                    <div className="flex flex-col justify-between gap-2 rounded-md border border-gray-200 p-3 shadow-sm">
                        {modeOfAddressings.map((mode, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <Checkbox
                                    id={`mode-${idx}`}
                                    checked={selectedTicket.mode_of_addressings.some((m) => m.mode_of_addressing_id === mode.id)}
                                    onCheckedChange={(checked) => handleModeOfAddressingChange(mode.id, checked)}
                                    disabled={isUpdatingModeOfAddressing}
                                />
                                <Label htmlFor={`mode-${idx}`} className="text-xs">
                                    {mode.mode}
                                </Label>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {canAssign(['/tickets', '/a/tickets']) && (
                <>
                    <div className="text-sm text-gray-500">Assigned To</div>
                    <div className="flex flex-col justify-between gap-2 rounded-md border border-gray-200 p-3 shadow-sm">
                        <input
                            type="text"
                            placeholder="Search user..."
                            className="w-full border-b text-xs"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            id="search-assigned-to-input"
                        />
                        {filteredUsers.map((user, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <Checkbox
                                    id={`user-${idx}`}
                                    checked={selectedTicket.assigned_tos.some((m) => m.assigned_to_id === user.id)}
                                    onCheckedChange={(checked) => handleAssignedToChange(user.id, checked)}
                                    disabled={isUpdatingAssignedTo}
                                />
                                <Label htmlFor={`user-${idx}`} className="text-xs">
                                    {user.name}
                                </Label>
                            </div>
                        ))}
                        {filteredUsers.length === 0 && <span className="text-xs text-gray-500">No users found.</span>}
                    </div>
                </>
            )}

            {canUpdate(['/tickets', '/a/tickets']) && (
                <>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="flex flex-col justify-between gap-2 rounded-md border border-gray-200 p-3 shadow-sm">
                        {selectedTicket.status === 'rejected' || selectedTicket.status === 'resolved' ? (
                            <Button
                                className="cursor-pointer"
                                variant={'warning'}
                                size={'sm'}
                                onClick={() => handleStatusChange('open')}
                                disabled={isUpdatingStatus}
                            >
                                <LockKeyholeOpen />
                                Reopen
                            </Button>
                        ) : (
                            <>
                                <Button
                                    className="cursor-pointer"
                                    variant={'success'}
                                    size={'sm'}
                                    onClick={() => handleStatusChange('resolved')}
                                    disabled={isUpdatingStatus}
                                >
                                    <ThumbsUp />
                                    Resolve
                                </Button>
                                <Button
                                    className="cursor-pointer"
                                    variant={'danger'}
                                    size={'sm'}
                                    onClick={() => handleStatusChange('rejected')}
                                    disabled={isUpdatingStatus}
                                >
                                    <ThumbsDown />
                                    Reject
                                </Button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
