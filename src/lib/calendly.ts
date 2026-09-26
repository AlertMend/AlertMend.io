/**
 * Demo booking links. One Calendly event for now; `utm_campaign` tells the
 * bookings apart (Calendly stores UTM params on each booking and shows them
 * in exports / webhooks). Campaign names: `<page>[-<audience>]-<cta>`.
 */
export const CALENDLY_BASE = 'https://calendly.com/hello-alertmend/30min'

export function calendlyUrl(campaign: string): string {
  const params = new URLSearchParams({
    utm_source: 'alertmend.io',
    utm_medium: 'website',
    utm_campaign: campaign,
  })
  return `${CALENDLY_BASE}?${params.toString()}`
}
