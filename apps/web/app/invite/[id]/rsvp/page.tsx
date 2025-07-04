'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { RadioGroup, RadioGroupItem } from '@kit/ui/radio-group';
import { Textarea } from '@kit/ui/textarea';
import { Alert, AlertDescription } from '@kit/ui/alert';
import { useGuestLookup, useSubmitRSVP } from '@kit/rsvp/hooks/use-rsvp-data';
import { CheckCircle, XCircle } from 'lucide-react';

interface RSVPPageProps {
  params: {
    id: string;
  };
}

export default function RSVPPage({ params }: RSVPPageProps) {
  const [guestCode, setGuestCode] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [rsvpData, setRSVPData] = useState({
    status: '',
    dietary_restrictions: '',
    plus_one_count: 0,
    plus_one_names: [] as string[],
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const { 
    data: guestData, 
    error: lookupError, 
    isLoading: isLookingUp 
  } = useGuestLookup(guestCode);

  const { 
    mutate: submitRSVP, 
    isPending: isSubmitting,
    error: submitError 
  } = useSubmitRSVP();

  const handleGuestLookup = () => {
    if (guestCode.trim()) {
      setShowForm(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guestData) return;

    submitRSVP({
      guest_id: guestData.id,
      status: rsvpData.status as 'attending' | 'not_attending',
      dietary_restrictions: rsvpData.dietary_restrictions || undefined,
      plus_one_count: rsvpData.plus_one_count,
      plus_one_names: rsvpData.plus_one_names.filter(name => name.trim()),
      message: rsvpData.message || undefined,
    }, {
      onSuccess: () => {
        setSubmitted(true);
      },
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
              <p className="text-muted-foreground mb-6">
                Your RSVP has been submitted successfully. We look forward to celebrating with you!
              </p>
              <Button onClick={() => router.push(`/invite/${params.id}`)}>
                Back to Invitation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">RSVP</h1>
          <p className="text-muted-foreground">
            Please enter your guest code to respond to this invitation
          </p>
        </div>

        {!showForm ? (
          <Card>
            <CardHeader>
              <CardTitle>Find Your Invitation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="guest-code">Guest Code</Label>
                  <Input
                    id="guest-code"
                    value={guestCode}
                    onChange={(e) => setGuestCode(e.target.value.toUpperCase())}
                    placeholder="Enter your guest code"
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Check your invitation or email for your unique guest code
                  </p>
                </div>

                <Button 
                  onClick={handleGuestLookup}
                  disabled={!guestCode.trim() || isLookingUp}
                  className="w-full"
                >
                  {isLookingUp ? 'Looking up...' : 'Continue'}
                </Button>

                {lookupError && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      Guest code not found. Please check your code and try again.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        ) : guestData ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Welcome, {guestData.name}!</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Will you be attending?</Label>
                    <RadioGroup
                      value={rsvpData.status}
                      onValueChange={(value) => setRSVPData(prev => ({...prev, status: value}))}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="attending" id="attending" />
                        <Label htmlFor="attending">Yes, I&apos;ll be there!</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not_attending" id="not_attending" />
                        <Label htmlFor="not_attending">Sorry, I can&apos;t make it</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {rsvpData.status === 'attending' && (
                    <>
                      <div>
                        <Label htmlFor="dietary">Dietary Restrictions</Label>
                        <Textarea
                          id="dietary"
                          value={rsvpData.dietary_restrictions}
                          onChange={(e) => setRSVPData(prev => ({...prev, dietary_restrictions: e.target.value}))}
                          placeholder="Any dietary restrictions or allergies we should know about?"
                          className="mt-1"
                        />
                      </div>

                      {guestData.plus_one_allowed && (
                        <div>
                          <Label htmlFor="plus-one">Number of Plus Ones (Max 2)</Label>
                          <Input
                            id="plus-one"
                            type="number"
                            min="0"
                            max="2"
                            value={rsvpData.plus_one_count}
                            onChange={(e) => setRSVPData(prev => ({...prev, plus_one_count: parseInt(e.target.value) || 0}))}
                            className="mt-1"
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={rsvpData.message}
                      onChange={(e) => setRSVPData(prev => ({...prev, message: e.target.value}))}
                      placeholder="Any special message for the host?"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={!rsvpData.status || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
              </Button>
            </div>

            {submitError && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to submit RSVP. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </form>
        ) : null}
      </div>
    </div>
  );
}