import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import AppLayoutTemplate from "@/layouts/app/app-header-layout";
import { SharedData } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { CirclePlus, ThumbsDown, ThumbsUp } from "lucide-react";
export default function Welcome() {
  const { isClientRoute } = usePage<SharedData>().props;

  return (
    <>
      <AppLayoutTemplate isClientRoute={isClientRoute}>
        <Head title="Home" />
        <div className="px-4 py-6">
          <div className="pb-2">
            <Button variant={"success"}>
              <CirclePlus />
              Create Ticket
            </Button>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 w-80">
              <div className="text-sm text-gray-500">Filter</div>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-400 border text-xs font-semibold rounded px-2 py-0.5 text-black">
                  Open (2)
                </span>
                <span className="bg-blue-500 text-xs font-semibold rounded px-2 py-0.5 text-white">
                  On-Going (2)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-green-700 text-xs font-semibold rounded px-2 py-0.5 text-white">
                  Resolved (2)
                </span>
                <span className="bg-red-600 text-xs font-semibold rounded px-2 py-0.5 text-white">
                  Rejected (2)
                </span>
              </div>
              <div className="text-sm text-gray-500">Tickets</div>

              <div className="p-2 rounded-md shadow-sm border border-gray-200 flex flex-col gap-2">
                <div className="bg-[#2A5298] rounded-md hover:bg-[#19335e] transition-all cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-200 text-xs font-semibold px-2 pt-2">
                      TICKET #123-456-789
                    </span>
                    <span className="text-sm text-white font-medium px-2">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum...
                    </span>
                    <Separator className="bg-gray-300" />
                    <div className="flex justify-between items-center px-2 pt-1 pb-2">
                      <span className="text-gray-200 text-xs font-semibold break-all whitespace-pre-line">
                        Kent Jamila &bull; kentjamila@gmail.com
                      </span>
                      <span className="bg-white text-xs font-semibold rounded px-1 py-0 text-blue-500">
                        On-Going
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-200 rounded-md hover:bg-gray-300 transition-all cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-600 text-xs font-semibold px-2 pt-2">
                      TICKET #123-456-790
                    </span>
                    <span className="text-sm text-gray-800 font-medium px-2">
                      Contrary to popular belief, Lorem Ipsum is not simply
                      random text. It has roots in a piece of classical...
                    </span>
                    <Separator className="bg-gray-300" />
                    <div className="flex justify-between items-center px-2 pt-1 pb-2">
                      <span className="text-gray-600 text-xs font-semibold break-all whitespace-pre-line">
                        Cyron Rael &bull; cyronrael@gmail.com
                      </span>
                      <span className="bg-yellow-400 text-xs font-semibold rounded px-1 py-0 text-black">
                        Open
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-1 ">
              <div className="text-sm text-gray-500">Details</div>
              <div className="flex flex-col justify-between p-3 rounded-md shadow-sm border border-gray-200 min-h-100">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-500 text-xs font-semibold rounded px-2 py-1 text-white">
                          On-Going
                        </span>
                        <span className="font-bold">I am a title</span>
                      </div>
                      <span className="text-gray-500 text-xs font-semibold">
                        Kent Jamila &bull; kentjamila@gmail.com
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs font-semibold">
                      July 8, 2025 - 11:33 AM
                    </span>
                  </div>
                  <Separator className="bg-gray-300" />
                  <span>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500 text-xs font-medium cursor-pointer hover:underline">
                      Attachment 1,
                    </span>
                    <span className="text-blue-500 text-xs font-medium cursor-pointer hover:underline">
                      Attachment 2
                    </span>
                  </div>
                  <Separator className="bg-gray-300" />
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 font-medium px-1 flex items-center gap-2">
                      <div className="cursor-pointer hover:underline">Edit</div>
                      <div>&bull;</div>
                      <div className="cursor-pointer hover:underline">
                        Delete
                      </div>
                      <div>&bull;</div>
                      <div className="cursor-pointer hover:underline">
                        Reply
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 font-medium px-1">
                      123-456-790
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-md shadow-sm border border-gray-200">
                Reply field
              </div>
            </div>
            <div className="flex flex-col gap-2 w-40">
              <div className="text-sm text-gray-500">Mode of Addressing</div>
              <div className="flex flex-col gap-2 justify-between p-3 rounded-md shadow-sm border border-gray-200">
                <div className="flex items-start gap-3">
                  <Checkbox id="e-mail-checkbox" />
                  <Label htmlFor="e-mail-checkbox" className="text-xs">
                    E-mail to HEI
                  </Label>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox id="conference-checkbox" />
                  <Label htmlFor="conference-checkbox" className="text-xs">
                    Conference w/ Complainant & Defendant
                  </Label>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox id="regional-memo-checkbox" />
                  <Label htmlFor="regional-memo-checkbox" className="text-xs">
                    Regional Memo
                  </Label>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox id="letter-to-checkbox" />
                  <Label htmlFor="letter-to-checkbox" className="text-xs">
                    Letter to HEI
                  </Label>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox id="contacted-checkbox" />
                  <Label htmlFor="contacted-checkbox" className="text-xs">
                    CHEDRO phoned HEI
                  </Label>
                </div>
              </div>
              <div className="text-sm text-gray-500">Status</div>
              <div className="flex flex-col gap-2 justify-between p-3 rounded-md shadow-sm border border-gray-200">
                <Button
                  className="cursor-pointer"
                  variant={"success"}
                  size={"sm"}
                >
                  <ThumbsUp />
                  Resolve
                </Button>
                <Button
                  className="cursor-pointer"
                  variant={"danger"}
                  size={"sm"}
                >
                  <ThumbsDown />
                  Reject
                </Button>
              </div>
              {/* <div className="text-sm text-gray-500">Tags</div>
              <div className="flex flex-col gap-2 justify-between p-3 rounded-md shadow-sm border border-gray-200">
                Tag 1
              </div> */}
            </div>
          </div>
        </div>
      </AppLayoutTemplate>
    </>
  );
}
