import Link from 'next/link';

import { ArrowRightIcon, Heart, Sparkles, Calendar } from 'lucide-react';

import {
  CtaButton,
  FeatureCard,
  FeatureGrid,
  FeatureShowcase,
  FeatureShowcaseIconContainer,
  Hero,
  Pill,
} from '@kit/ui/marketing';
import { Trans } from '@kit/ui/trans';

import { withI18n } from '~/lib/i18n/with-i18n';

function Home() {
  return (
    <div className={'mt-4 flex flex-col space-y-24 py-14'}>
      <div className={'container mx-auto'}>
        <Hero
          pill={
            <Pill label={'✨ New'}>
              <span>Beautiful digital invitations made simple</span>
            </Pill>
          }
          title={
            <>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Create stunning invitations</span>
              <span>that wow your guests</span>
            </>
          }
          subtitle={
            <span className="text-xl leading-relaxed">
              Design beautiful digital invitations, track RSVPs in real-time, and make every event unforgettable. 
              Perfect for weddings, birthdays, and corporate events.
            </span>
          }
          cta={<MainCallToActionButton />}
          image={
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-3xl" />
              <div className="relative rounded-3xl border border-gray-200 shadow-2xl dark:border-gray-800 dark:shadow-purple-500/10 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 min-h-[400px] flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border">
                      <div className="h-3 bg-purple-200 dark:bg-purple-700 rounded mb-2"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded mb-1"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                      <div className="mt-3 h-6 bg-purple-500 rounded text-xs text-white flex items-center justify-center">RSVP</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border">
                      <div className="h-3 bg-pink-200 dark:bg-pink-700 rounded mb-2"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded mb-1"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                      <div className="mt-3 h-6 bg-pink-500 rounded text-xs text-white flex items-center justify-center">Invite</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Beautiful invitation templates with real-time RSVP tracking
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </div>

      <div className={'container mx-auto'}>
        <div
          className={'flex flex-col space-y-16 xl:space-y-32 2xl:space-y-36'}
        >
          <FeatureShowcase
            heading={
              <>
                <b className="font-semibold dark:text-white">
                  Everything you need for perfect events
                </b>
                .{' '}
                <span className="text-muted-foreground font-normal">
                  From invitation design to guest management, we&apos;ve got you covered with elegant tools that make hosting effortless.
                </span>
              </>
            }
            icon={
              <FeatureShowcaseIconContainer>
                <Heart className="h-5 text-pink-500" />
                <span>Made with love</span>
              </FeatureShowcaseIconContainer>
            }
          >
            <FeatureGrid>
              <FeatureCard
                className={'relative col-span-2 overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'}
                label={'Beautiful Templates'}
                description={`Choose from our curated collection of elegant invitation templates. Perfect for weddings, birthdays, and corporate events.`}
              />

              <FeatureCard
                className={
                  'relative col-span-2 w-full overflow-hidden lg:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
                }
                label={'Real-time RSVP'}
                description={`Track guest responses instantly with our smart RSVP system. No more chasing confirmations.`}
              />

              <FeatureCard
                className={'relative col-span-2 overflow-hidden lg:col-span-1 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'}
                label={'Easy Sharing'}
                description={`Share via QR codes, social media, or direct links. Your guests can RSVP from anywhere, anytime.`}
              />

              <FeatureCard
                className={'relative col-span-2 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20'}
                label={'Guest Management'}
                description={`Organize your guest list, track dietary preferences, and manage plus-ones with ease. Everything in one place.`}
              />
            </FeatureGrid>
          </FeatureShowcase>

          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">
                Perfect for every occasion
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Whether you&apos;re planning an intimate gathering or a grand celebration, 
                our platform adapts to your needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center space-y-4 p-6 rounded-2xl bg-gradient-to-b from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Weddings</h3>
                <p className="text-muted-foreground text-center">
                  Romantic templates and elegant RSVP tracking for your special day
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4 p-6 rounded-2xl bg-gradient-to-b from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Celebrations</h3>
                <p className="text-muted-foreground text-center">
                  Fun and festive designs for birthdays, anniversaries, and parties
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4 p-6 rounded-2xl bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Corporate Events</h3>
                <p className="text-muted-foreground text-center">
                  Professional templates for meetings, conferences, and team events
                </p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-3xl p-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">
                Ready to create your first invitation?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of hosts who trust Invella to make their events memorable. 
                Start creating beautiful invitations today.
              </p>
            </div>
            <MainCallToActionButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withI18n(Home);

function MainCallToActionButton() {
  return (
    <div className={'flex space-x-4'}>
      <CtaButton>
        <Link href={'/auth/sign-up'}>
          <span className={'flex items-center space-x-0.5'}>
            <span>
              <Trans i18nKey={'common:getStarted'} />
            </span>

            <ArrowRightIcon
              className={
                'animate-in fade-in slide-in-from-left-8 h-4' +
                ' zoom-in fill-mode-both delay-1000 duration-1000'
              }
            />
          </span>
        </Link>
      </CtaButton>

      <CtaButton variant={'link'}>
        <Link href={'/contact'}>
          <Trans i18nKey={'common:contactUs'} />
        </Link>
      </CtaButton>
    </div>
  );
}
