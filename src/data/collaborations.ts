export type MediaLayout = "full" | "wide" | "tall";

export type CollaborationMedia = (
  | { type: "image"; src: string; caption: string }
  | { type: "video"; src: string; poster: string; caption: string }
) & { layout?: MediaLayout };

export interface Collaboration {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  organisedBy: string;
  partner: string;
  date: string;
  dateLabel: string;
  venue: string;
  coverImage: string;
  summary: string;
  /** Paragraphs of the story. Wrap text in **double asterisks** to highlight it. */
  story: string[];
  activities?: { title: string; items: string[] };
  closingQuote: string;
  media: CollaborationMedia[];
}

const base = "/collaborations/ramnadi-mula-nature-walk";

export const collaborations: Collaboration[] = [
  {
    slug: "ramnadi-mula-nature-walk",
    title: "Nature Walk at Ramnadi–Mula River Confluence",
    tagline: "Observe, learn, connect and take responsibility for the rivers that sustain our city.",
    category: "Environment & Sustainability",
    organisedBy: "Ecological Society, Pune",
    partner: "Prachetas Foundation",
    date: "2026-09-27",
    dateLabel: "27 September 2026",
    venue: "Ramnadi–Mula River Confluence, Baner–Aundh Link Road, Pune",
    coverImage: `${base}/community-meal.jpg`,
    summary:
      "A nature walk for students associated with Ecosan Services along a pristine riparian ecosystem, exploring river biodiversity and the challenges it faces from human activity.",
    story: [
      "A nature walk was organised for students associated with **Ecosan Services** at the beautiful Ramnadi–Mula river confluence on Baner–Aundh Link Road.",
      "Nestled along the river, this pristine **riparian ecosystem** supports a rich diversity of flora and fauna, offering a unique opportunity to experience and understand the natural environment within an urban landscape.",
      "The walk focused on understanding the **river ecosystem, its biodiversity, and the challenges it faces due to increasing human activities**. Participants explored how urbanisation, pollution, waste, and other human interventions impact our rivers and surrounding ecosystems. The session also encouraged students to reflect on how each of us, as responsible citizens, can contribute meaningfully towards protecting and conserving nature in our cities.",
      "This river stretch has been adopted by **Jeevitnadi**, an organisation dedicated to the natural rejuvenation of Pune's rivers. Through sustained efforts and active community participation, several responsible and environmentally conscious citizens are working to conserve the river ecosystem while reconnecting people with their rivers.",
      "Jeevitnadi regularly conducts a variety of engaging activities along the riverbanks, including **nature walks, tree walks, bird walks, butterfly and spider walks, yoga, meditation and healing sessions, art activities, and other community initiatives**.",
      "The event provided participants with more than just a walk in nature—it was an opportunity to **observe, learn, connect and take responsibility for the natural ecosystems that sustain our cities**.",
    ],
    activities: {
      title: "Along the riverbanks with Jeevitnadi",
      items: [
        "Nature walks",
        "Tree walks",
        "Bird walks",
        "Butterfly & spider walks",
        "Yoga",
        "Meditation & healing",
        "Art activities",
        "Community initiatives",
      ],
    },
    closingQuote: "When we reconnect with nature, we become more conscious of our responsibility to protect it.",
    media: [
      { type: "image", src: `${base}/group-photo-1.jpg`, caption: "Together at the Ramnadi–Mula confluence", layout: "full" },
      { type: "image", src: `${base}/community-meal.jpg`, caption: "Students sharing a mindful meal under the canopy", layout: "tall" },
      { type: "video", src: `${base}/walk-1.mp4`, poster: `${base}/walk-1-poster.jpg`, caption: "Understanding the river ecosystem" },
      { type: "video", src: `${base}/walk-2.mp4`, poster: `${base}/walk-2-poster.jpg`, caption: "Young nature enthusiasts at the confluence" },
      { type: "image", src: `${base}/group-photo-2.jpg`, caption: "Prachetas Foundation with the walk participants", layout: "wide" },
      { type: "image", src: `${base}/serving-food.jpg`, caption: "Serving wholesome food to participants" },
      { type: "video", src: `${base}/walk-3.mp4`, poster: `${base}/walk-3-poster.jpg`, caption: "A shared meal amidst nature" },
      { type: "video", src: `${base}/walk-4.mp4`, poster: `${base}/walk-4-poster.jpg`, caption: "Food prepared and served with love" },
      { type: "image", src: `${base}/serving-lunch.jpg`, caption: "Lunch served with care after the walk" },
      { type: "video", src: `${base}/walk-5.mp4`, poster: `${base}/walk-5-poster.jpg`, caption: "Students enjoying lunch in the woods" },
      { type: "video", src: `${base}/walk-6.mp4`, poster: `${base}/walk-6-poster.jpg`, caption: "Reconnecting with nature, together" },
    ],
  },
];

export const getCollaboration = (slug: string) => collaborations.find((c) => c.slug === slug);
