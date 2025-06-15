
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Edit } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface StreamersTableProps {
  streamers: Tables<'streamers'>[];
  isLoading: boolean;
  userRole: string;
  onEditStreamer: (streamer: Tables<'streamers'>) => void;
}

export const StreamersTable = ({
  streamers,
  isLoading,
  userRole,
  onEditStreamer,
}: StreamersTableProps) => {
  const canManageAllStreamers = userRole === 'admin' || userRole === 'mod';

  return (
    <Card>
      <CardContent className="p-0">
        {isLoading && streamers.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Followers</TableHead>
                <TableHead>Avg Viewers</TableHead>
                <TableHead>Status</TableHead>
                {canManageAllStreamers && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {streamers.map((streamer) => (
                <TableRow key={streamer.id}>
                  <TableCell className="font-medium">{streamer.name}</TableCell>
                  <TableCell className="capitalize">{streamer.platform}</TableCell>
                  <TableCell>${streamer.price.toFixed(2)}</TableCell>
                  <TableCell>{streamer.followers.toLocaleString()}</TableCell>
                  <TableCell>{streamer.avg_viewers.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      streamer.is_live 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {streamer.is_live ? 'Live' : 'Offline'}
                    </span>
                  </TableCell>
                  {canManageAllStreamers && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditStreamer(streamer)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
