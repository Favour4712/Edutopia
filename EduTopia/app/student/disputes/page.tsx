"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";

const MOCK_DISPUTES = [
  {
    id: "DISPUTE#001",
    sessionId: "SESSION#123",
    tutorName: "Amina Farooq",
    subject: "Smart Contract Auditing",
    reason: "Missed audit checklist",
    status: "under-review" as const,
    amount: 0.55,
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "DISPUTE#002",
    sessionId: "SESSION#120",
    tutorName: "Marco Alvarez",
    subject: "Validator Operations",
    reason: "Validator setup stalled",
    status: "resolved" as const,
    amount: 0.4,
    outcome: "refunded",
    createdAt: new Date(Date.now() - 432000000),
  },
];

export default function DisputesPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "under-review":
        return <Clock className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "under-review":
        return "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100";
      case "resolved":
        return "bg-success/20 text-success";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-6">Disputes</h1>

      {MOCK_DISPUTES.length > 0 ? (
        <div className="space-y-4">
          {MOCK_DISPUTES.map((dispute) => (
            <Link key={dispute.id} href={`/dispute/${dispute.id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{dispute.subject}</h3>
                      <Badge className={getStatusColor(dispute.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(dispute.status)}
                          {dispute.status.replace("-", " ")}
                        </span>
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">
                      with {dispute.tutorName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Reason:</strong> {dispute.reason}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-primary">
                      {dispute.amount} ETH
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {dispute.createdAt.toLocaleDateString()}
                    </p>
                    {dispute.outcome && (
                      <p className="text-xs font-medium text-success mt-2">
                        {dispute.outcome === "refunded"
                          ? "Refunded"
                          : "Resolved"}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No disputes</p>
          <p className="text-sm text-muted-foreground">
            All your sessions have been completed without any disputes.
          </p>
        </Card>
      )}
    </div>
  );
}
