'use client';

import { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Mail, 
  MessageCircle, 
  QrCode,
  Facebook,
  Twitter,
  Check,
  Download
} from 'lucide-react';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@kit/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';
import { Badge } from '@kit/ui/badge';
import { toast } from 'sonner';

interface ShareInvitationProps {
  invitationId: string;
  invitationTitle: string;
  invitationUrl?: string;
  trigger?: React.ReactNode;
}

export function ShareInvitation({
  invitationId,
  invitationTitle,
  invitationUrl = `${window.location.origin}/invite/${invitationId}`,
  trigger,
}: ShareInvitationProps) {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Generate QR code URL (using a free service)
  const generateQRCode = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(invitationUrl)}`;
    setQrCodeUrl(qrUrl);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`You're invited: ${invitationTitle}`);
    const body = encodeURIComponent(
      `You're invited to ${invitationTitle}!\n\nView the invitation and RSVP here:\n${invitationUrl}\n\nHope to see you there!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaSMS = () => {
    const message = encodeURIComponent(
      `You're invited to ${invitationTitle}! RSVP here: ${invitationUrl}`
    );
    window.open(`sms:?body=${message}`);
  };

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(
      `You're invited to ${invitationTitle}! View the invitation and RSVP here: ${invitationUrl}`
    );
    window.open(`https://wa.me/?text=${message}`);
  };

  const shareViaFacebook = () => {
    const url = encodeURIComponent(invitationUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(`You're invited to ${invitationTitle}!`);
    const url = encodeURIComponent(invitationUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `invitation-${invitationId}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Share2 className="mr-2 h-4 w-4" />
      Share
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Invitation</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="qr" onClick={generateQRCode}>QR Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Invitation Link</label>
              <div className="flex space-x-2">
                <Input 
                  value={invitationUrl} 
                  readOnly 
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this link with your guests so they can view the invitation and RSVP
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={shareViaEmail}
                className="justify-start"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={shareViaSMS}
                className="justify-start"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                SMS
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="social" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Share on Social Media</label>
              <p className="text-xs text-muted-foreground">
                Share your invitation on social platforms
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                onClick={shareViaWhatsApp}
                className="justify-start"
              >
                <MessageCircle className="mr-2 h-4 w-4 text-green-600" />
                WhatsApp
              </Button>
              <Button 
                variant="outline" 
                onClick={shareViaFacebook}
                className="justify-start"
              >
                <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              <Button 
                variant="outline" 
                onClick={shareViaTwitter}
                className="justify-start"
              >
                <Twitter className="mr-2 h-4 w-4 text-blue-400" />
                Twitter
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="qr" className="space-y-4">
            <div className="text-center space-y-4">
              <div>
                <label className="text-sm font-medium">QR Code</label>
                <p className="text-xs text-muted-foreground mt-1">
                  Guests can scan this code to access the invitation
                </p>
              </div>
              
              {qrCodeUrl ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-lg border">
                      <img 
                        src={qrCodeUrl} 
                        alt="Invitation QR Code"
                        className="w-48 h-48"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={downloadQRCode}
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download QR Code
                    </Button>
                    
                    <Badge variant="secondary" className="text-xs">
                      Print this code on physical invitations
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center py-8">
                  <Button onClick={generateQRCode} variant="outline">
                    <QrCode className="mr-2 h-4 w-4" />
                    Generate QR Code
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}