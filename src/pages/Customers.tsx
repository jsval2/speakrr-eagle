import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Phone, RefreshCw, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// Square logo SVG component
const SquareLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21 0H3C1.34315 0 0 1.34315 0 3V21C0 22.6569 1.34315 24 3 24H21C22.6569 24 24 22.6569 24 21V3C24 1.34315 22.6569 0 21 0ZM18 18H6C5.44772 18 5 17.5523 5 17V7C5 6.44772 5.44772 6 6 6H18C18.5523 6 19 6.44772 19 7V17C19 17.5523 18.5523 18 18 18Z" />
  </svg>
);

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  callCount: number;
  lastContact: string;
  squareSynced: boolean;
  squareCustomerId?: string;
  status: "active" | "pending" | "new";
}

// Sample customer data
const sampleCustomers: Customer[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    phone: "+1 (555) 234-5678",
    email: "sarah.j@email.com",
    callCount: 5,
    lastContact: "Today",
    squareSynced: true,
    squareCustomerId: "SQ-001234",
    status: "active",
  },
  {
    id: 2,
    name: "Mike Chen",
    phone: "+1 (555) 345-6789",
    email: "mike.chen@email.com",
    callCount: 3,
    lastContact: "Yesterday",
    squareSynced: true,
    squareCustomerId: "SQ-001235",
    status: "active",
  },
  {
    id: 3,
    name: "Emma Wilson",
    phone: "+1 (555) 456-7890",
    email: "emma.w@email.com",
    callCount: 2,
    lastContact: "2 days ago",
    squareSynced: false,
    status: "pending",
  },
  {
    id: 4,
    name: "James Rodriguez",
    phone: "+1 (555) 567-8901",
    email: "j.rodriguez@email.com",
    callCount: 7,
    lastContact: "Today",
    squareSynced: true,
    squareCustomerId: "SQ-001236",
    status: "active",
  },
  {
    id: 5,
    name: "Lisa Park",
    phone: "+1 (555) 678-9012",
    email: "lisa.park@email.com",
    callCount: 1,
    lastContact: "3 days ago",
    squareSynced: false,
    status: "new",
  },
  {
    id: 6,
    name: "David Thompson",
    phone: "+1 (555) 789-0123",
    email: "d.thompson@email.com",
    callCount: 4,
    lastContact: "Yesterday",
    squareSynced: true,
    squareCustomerId: "SQ-001237",
    status: "active",
  },
  {
    id: 7,
    name: "Amanda Foster",
    phone: "+1 (555) 890-1234",
    email: "amanda.f@email.com",
    callCount: 2,
    lastContact: "4 days ago",
    squareSynced: true,
    squareCustomerId: "SQ-001238",
    status: "active",
  },
  {
    id: 8,
    name: "Robert Kim",
    phone: "+1 (555) 901-2345",
    email: "robert.kim@email.com",
    callCount: 1,
    lastContact: "Today",
    squareSynced: false,
    status: "new",
  },
  {
    id: 9,
    name: "Jennifer Martinez",
    phone: "+1 (555) 012-3456",
    email: "j.martinez@email.com",
    callCount: 6,
    lastContact: "Yesterday",
    squareSynced: true,
    squareCustomerId: "SQ-001239",
    status: "active",
  },
  {
    id: 10,
    name: "William Brown",
    phone: "+1 (555) 123-4567",
    email: "w.brown@email.com",
    callCount: 3,
    lastContact: "5 days ago",
    squareSynced: false,
    status: "pending",
  },
];

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers] = useState<Customer[]>(sampleCustomers);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const syncedCount = customers.filter((c) => c.squareSynced).length;
  const pendingCount = customers.filter((c) => !c.squareSynced).length;

  return (
    <DashboardLayout>
      <PageHeader
        title="Customers"
        description="Manage customers and sync with Square POS"
      >
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Sync with Square
        </Button>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Customers
          </p>
          <p className="text-2xl font-semibold mt-1">{customers.length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <div className="flex items-center gap-2">
            <SquareLogo className="h-4 w-4 text-[#006AFF]" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Synced with Square
            </p>
          </div>
          <p className="text-2xl font-semibold mt-1 text-[#006AFF]">{syncedCount}</p>
        </div>
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Pending Sync
          </p>
          <p className="text-2xl font-semibold mt-1 text-warning">{pendingCount}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-card rounded-lg border border-border/50 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-medium">Customer</TableHead>
              <TableHead className="font-medium">Phone</TableHead>
              <TableHead className="font-medium text-center">Calls</TableHead>
              <TableHead className="font-medium">Last Contact</TableHead>
              <TableHead className="font-medium">Sync Status</TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-muted/30">
                <TableCell>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono text-sm">{customer.phone}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="font-mono">
                    {customer.callCount}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {customer.lastContact}
                  </span>
                </TableCell>
                <TableCell>
                  {customer.squareSynced ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-[#006AFF]/10 border border-[#006AFF]/30 rounded">
                        <SquareLogo className="h-3 w-3 text-[#006AFF]" />
                        <span className="text-xs font-medium text-[#006AFF]">
                          Synced
                        </span>
                      </div>
                      {customer.squareCustomerId && (
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {customer.squareCustomerId}
                        </span>
                      )}
                    </div>
                  ) : (
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        customer.status === "new"
                          ? "border-success/50 text-success"
                          : "border-warning/50 text-warning"
                      )}
                    >
                      {customer.status === "new" ? "New" : "Pending"}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No customers found matching your search.</p>
          </div>
        )}
      </div>

      {/* Square Integration Info */}
      <div className="mt-6 p-4 bg-[#006AFF]/5 border border-[#006AFF]/20 rounded-lg">
        <div className="flex items-start gap-3">
          <SquareLogo className="h-5 w-5 text-[#006AFF] mt-0.5" />
          <div>
            <p className="text-sm font-medium">Square POS Integration</p>
            <p className="text-xs text-muted-foreground mt-1">
              Customer records are automatically synced with your Square account. New customers
              from phone calls will be added to Square after verification.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
