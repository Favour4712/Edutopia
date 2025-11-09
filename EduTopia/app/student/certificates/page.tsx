"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2, ExternalLink } from "lucide-react"

const MOCK_CERTIFICATES = [
  {
    id: "1",
    subject: "Advanced Solidity Security",
    tutorName: "Amina Farooq",
    completedDate: "2025-10-20",
    tokenId: "NFT#1234",
    image: "/nft-certificate.jpg",
  },
  {
    id: "2",
    subject: "Designing zkRollup Circuits",
    tutorName: "Linh Tran",
    completedDate: "2025-09-15",
    tokenId: "NFT#5678",
    image: "/formal-certificate.png",
  },
]

export default function CertificatesPage() {
  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-6">My Certificates</h1>

      {MOCK_CERTIFICATES.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_CERTIFICATES.map((cert) => (
            <Card key={cert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-linear-to-br from-primary to-secondary p-4 text-white flex flex-col justify-between">
                <div>
                  <p className="text-sm opacity-90">Certificate of Completion</p>
                  <h3 className="text-xl font-bold">{cert.subject}</h3>
                </div>
                <div>
                  <p className="text-sm">by {cert.tutorName}</p>
                  <p className="text-xs opacity-75">{cert.completedDate}</p>
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-4">Token ID: {cert.tokenId}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No certificates yet</p>
          <p className="text-sm text-muted-foreground mb-4">Complete sessions to earn NFT certificates</p>
          <Button asChild className="bg-primary">
            <a href="/student/browse">Find a Tutor</a>
          </Button>
        </Card>
      )}
    </div>
  )
}
