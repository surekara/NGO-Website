import ProgramDetail from "../components/ProgramDetail";

const galleryImages = [
  { src: "/food-1.png", caption: "Groups of labourers" },
  { src: "/food-2.png", caption: "Labour Adda Annadaan" },
  { src: "/food-3.png", caption: "At Hospital" },
  { src: "/food-4.png", caption: "Full Meals" },
  { src: "/food-5.png", caption: "Needy patients" },
  { src: "/food-6.png", caption: "Needy patients" },
];

const FoodDistributionProgram = () => (
  <ProgramDetail
    title="FOOD DISTRIBUTION"
    heroImage="/food-hero.png"
    description={'We believe that access to nutritious food is a fundamental human right. Through our food distribution program, we aim to alleviate hunger and malnutrition in our community by providing wholesome meals to those in need. Our initiatives focus on serving underprivileged communities, slum areas, patients, and the homeless with sanctified, nourishing meals prepared with care and compassion.'}
    gallery={galleryImages}
    ribbon={["Annadaan","Nourishment","Compassion","Dignity","No One Sleeps Hungry","Service"]}
  />
);

export default FoodDistributionProgram;
