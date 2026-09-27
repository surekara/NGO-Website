import ProgramDetail from "../components/ProgramDetail";

const galleryImages = [
  { src: "/wellness-1.png", caption: "" },
  { src: "/wellness-2.png", caption: "" },
  { src: "/wellness-3.png", caption: "" },
  { src: "/wellness-4.png", caption: "" },
  { src: "/wellness-5.png", caption: "" },
  { src: "/wellness-6.png", caption: "" },
];

const WellnessProgram = () => (
  <ProgramDetail
    title="WELLNESS"
    heroImage="/wellness-hero.png"
    description={'At Prachetas, we believe true well-being begins with balance. We organize free yoga sessions, health camps, and wellness programs to promote physical and mental wellness. Rooted in holistic practices and Vedic wisdom, our initiatives help individuals lead healthier, more balanced lives. Through yoga, naturopathy, mindfulness, and sustainable living workshops, we empower communities to heal naturally without dependency on medicines.'}
    gallery={galleryImages}
    ribbon={["Yoga","Mindfulness","Naturopathy","Health Camps","Vedic Wisdom","Balance"]}
  />
);

export default WellnessProgram;
